var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CoursesService_1;
import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, Optional, } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { SupabaseService } from '../supabase/supabase.service.js';
let CoursesService = CoursesService_1 = class CoursesService {
    supabaseService;
    logger = new Logger(CoursesService_1.name);
    courses = [];
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
        this.seedInitialData();
    }
    isSupabaseActive() {
        return Boolean(this.supabaseService?.isConfigured());
    }
    getClient() {
        return this.supabaseService?.getClient() ?? null;
    }
    async createCourse(dto) {
        const passingGrade = dto.passingGrade ?? 3.0;
        const maxGrade = dto.maxGrade ?? 5.0;
        if (passingGrade > maxGrade) {
            throw new BadRequestException(`La nota de aprobación (${passingGrade}) no puede ser mayor que la nota máxima (${maxGrade})`);
        }
        if (this.isSupabaseActive()) {
            const client = this.getClient();
            const { data: existing, error: searchErr } = await client
                .from('courses')
                .select('id, code')
                .ilike('code', dto.code.trim())
                .maybeSingle();
            if (searchErr) {
                this.logger.error(`Error buscando curso en Supabase: ${searchErr.message}`);
            }
            if (existing) {
                throw new ConflictException(`Ya existe un curso con el código '${dto.code}'`);
            }
            const { data: created, error } = await client
                .from('courses')
                .insert({
                code: dto.code.trim().toUpperCase(),
                name: dto.name.trim(),
                description: dto.description?.trim() || null,
                professor: dto.professor.trim(),
                passing_grade: passingGrade,
                max_grade: maxGrade,
            })
                .select()
                .single();
            if (error) {
                this.logger.error(`Error al insertar curso en Supabase: ${error.message}`);
                throw new BadRequestException(`Error en Supabase: ${error.message}`);
            }
            return this.mapCourse(created, []);
        }
        const existing = this.courses.find((c) => c.code.toLowerCase() === dto.code.trim().toLowerCase());
        if (existing) {
            throw new ConflictException(`Ya existe un curso con el código '${dto.code}'`);
        }
        const newCourse = {
            id: randomUUID(),
            code: dto.code.trim().toUpperCase(),
            name: dto.name.trim(),
            description: dto.description?.trim(),
            professor: dto.professor.trim(),
            passingGrade,
            maxGrade,
            students: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.courses.push(newCourse);
        return newCourse;
    }
    async findAllCourses() {
        if (this.isSupabaseActive()) {
            const client = this.getClient();
            const { data, error } = await client
                .from('courses')
                .select(`
          *,
          students (
            *,
            grades (*)
          )
        `)
                .order('created_at', { ascending: false });
            if (error) {
                this.logger.error(`Error al consultar cursos en Supabase: ${error.message}`);
                return this.findAllCoursesFromMemory();
            }
            return (data || []).map((c) => {
                const course = this.mapCourse(c, c.students || []);
                return this.buildCourseSummary(course);
            });
        }
        return this.findAllCoursesFromMemory();
    }
    findAllCoursesFromMemory() {
        return this.courses.map((course) => this.buildCourseSummary(course));
    }
    buildCourseSummary(course) {
        const totalStudents = course.students.length;
        let totalGradesCount = 0;
        let totalCourseScore = 0;
        let studentWithGradesCount = 0;
        for (const student of course.students) {
            if (student.grades.length > 0) {
                const avg = this.calculateStudentAverage(student, course.passingGrade);
                totalCourseScore += avg.currentAverage;
                studentWithGradesCount++;
            }
            totalGradesCount += student.grades.length;
        }
        const courseAverage = studentWithGradesCount > 0
            ? Number((totalCourseScore / studentWithGradesCount).toFixed(2))
            : 0;
        return {
            id: course.id,
            code: course.code,
            name: course.name,
            description: course.description,
            professor: course.professor,
            passingGrade: course.passingGrade,
            maxGrade: course.maxGrade,
            totalStudents,
            totalGradesCount,
            courseAverage,
            createdAt: course.createdAt,
        };
    }
    async findCourseById(courseId) {
        if (this.isSupabaseActive()) {
            const client = this.getClient();
            const { data, error } = await client
                .from('courses')
                .select(`
          *,
          students (
            *,
            grades (*)
          )
        `)
                .eq('id', courseId)
                .maybeSingle();
            if (error) {
                this.logger.error(`Error al buscar curso ${courseId} en Supabase: ${error.message}`);
            }
            if (!data) {
                throw new NotFoundException(`Curso con ID '${courseId}' no encontrado`);
            }
            return this.mapCourse(data, data.students || []);
        }
        const course = this.courses.find((c) => c.id === courseId);
        if (!course) {
            throw new NotFoundException(`Curso con ID '${courseId}' no encontrado`);
        }
        return course;
    }
    async updateCourse(courseId, dto) {
        if (this.isSupabaseActive()) {
            const client = this.getClient();
            const current = await this.findCourseById(courseId);
            const passingGrade = dto.passingGrade ?? current.passingGrade;
            const maxGrade = dto.maxGrade ?? current.maxGrade;
            if (passingGrade > maxGrade) {
                throw new BadRequestException('La nota de aprobación no puede superar la nota máxima');
            }
            if (dto.code && dto.code.toLowerCase() !== current.code.toLowerCase()) {
                const { data: existing } = await client
                    .from('courses')
                    .select('id')
                    .neq('id', courseId)
                    .ilike('code', dto.code.trim())
                    .maybeSingle();
                if (existing) {
                    throw new ConflictException(`Ya existe otro curso con el código '${dto.code}'`);
                }
            }
            const updatePayload = {};
            if (dto.code !== undefined)
                updatePayload.code = dto.code.trim().toUpperCase();
            if (dto.name !== undefined)
                updatePayload.name = dto.name.trim();
            if (dto.description !== undefined)
                updatePayload.description = dto.description.trim();
            if (dto.professor !== undefined)
                updatePayload.professor = dto.professor.trim();
            if (dto.passingGrade !== undefined)
                updatePayload.passing_grade = dto.passingGrade;
            if (dto.maxGrade !== undefined)
                updatePayload.max_grade = dto.maxGrade;
            const { data, error } = await client
                .from('courses')
                .update(updatePayload)
                .eq('id', courseId)
                .select(`
          *,
          students (
            *,
            grades (*)
          )
        `)
                .single();
            if (error) {
                throw new BadRequestException(`Error al actualizar curso en Supabase: ${error.message}`);
            }
            return this.mapCourse(data, data.students || []);
        }
        const course = this.findCourseByIdFromMemory(courseId);
        if (dto.code && dto.code.toLowerCase() !== course.code.toLowerCase()) {
            const existing = this.courses.find((c) => c.id !== courseId && c.code.toLowerCase() === dto.code?.toLowerCase());
            if (existing) {
                throw new ConflictException(`Ya existe otro curso con el código '${dto.code}'`);
            }
            course.code = dto.code.trim().toUpperCase();
        }
        if (dto.name !== undefined)
            course.name = dto.name.trim();
        if (dto.description !== undefined)
            course.description = dto.description.trim();
        if (dto.professor !== undefined)
            course.professor = dto.professor.trim();
        if (dto.passingGrade !== undefined)
            course.passingGrade = dto.passingGrade;
        if (dto.maxGrade !== undefined)
            course.maxGrade = dto.maxGrade;
        if (course.passingGrade > course.maxGrade) {
            throw new BadRequestException('La nota de aprobación no puede superar la nota máxima');
        }
        course.updatedAt = new Date();
        return course;
    }
    async deleteCourse(courseId) {
        if (this.isSupabaseActive()) {
            const client = this.getClient();
            const current = await this.findCourseById(courseId);
            const { error } = await client.from('courses').delete().eq('id', courseId);
            if (error) {
                throw new BadRequestException(`Error al eliminar curso en Supabase: ${error.message}`);
            }
            return {
                message: `El curso '${current.name}' (${current.code}) ha sido eliminado con éxito de Supabase`,
                deletedId: current.id,
            };
        }
        const index = this.courses.findIndex((c) => c.id === courseId);
        if (index === -1) {
            throw new NotFoundException(`Curso con ID '${courseId}' no encontrado`);
        }
        const [deleted] = this.courses.splice(index, 1);
        return {
            message: `El curso '${deleted.name}' (${deleted.code}) ha sido eliminado con éxito`,
            deletedId: deleted.id,
        };
    }
    async registerStudent(courseId, dto) {
        if (this.isSupabaseActive()) {
            const client = this.getClient();
            await this.findCourseById(courseId);
            const { data: existingCode } = await client
                .from('students')
                .select('id')
                .eq('course_id', courseId)
                .ilike('code', dto.code.trim())
                .maybeSingle();
            if (existingCode) {
                throw new ConflictException(`Ya existe un estudiante con el código '${dto.code}' en este curso`);
            }
            const { data: existingEmail } = await client
                .from('students')
                .select('id')
                .eq('course_id', courseId)
                .ilike('email', dto.email.trim())
                .maybeSingle();
            if (existingEmail) {
                throw new ConflictException(`Ya existe un estudiante con el correo '${dto.email}' en este curso`);
            }
            const { data, error } = await client
                .from('students')
                .insert({
                course_id: courseId,
                code: dto.code.trim().toUpperCase(),
                name: dto.name.trim(),
                email: dto.email.trim().toLowerCase(),
            })
                .select()
                .single();
            if (error) {
                throw new BadRequestException(`Error al registrar estudiante en Supabase: ${error.message}`);
            }
            return this.mapStudent(data, []);
        }
        const course = this.findCourseByIdFromMemory(courseId);
        const codeExists = course.students.some((s) => s.code.toLowerCase() === dto.code.trim().toLowerCase());
        if (codeExists) {
            throw new ConflictException(`Ya existe un estudiante con el código '${dto.code}' en este curso`);
        }
        const emailExists = course.students.some((s) => s.email.toLowerCase() === dto.email.trim().toLowerCase());
        if (emailExists) {
            throw new ConflictException(`Ya existe un estudiante con el correo '${dto.email}' en este curso`);
        }
        const newStudent = {
            id: randomUUID(),
            code: dto.code.trim().toUpperCase(),
            name: dto.name.trim(),
            email: dto.email.trim().toLowerCase(),
            grades: [],
        };
        course.students.push(newStudent);
        course.updatedAt = new Date();
        return newStudent;
    }
    async getStudentsByCourse(courseId) {
        const course = await this.findCourseById(courseId);
        return course.students.map((student) => {
            const summary = this.calculateStudentAverage(student, course.passingGrade);
            return {
                id: student.id,
                code: student.code,
                name: student.name,
                email: student.email,
                totalGrades: student.grades.length,
                accumulatedPercentage: summary.totalPercentage,
                currentAverage: summary.currentAverage,
                status: summary.status,
            };
        });
    }
    async getStudentById(courseId, studentId) {
        const course = await this.findCourseById(courseId);
        const student = course.students.find((s) => s.id === studentId);
        if (!student) {
            throw new NotFoundException(`Estudiante con ID '${studentId}' no encontrado en el curso '${course.name}'`);
        }
        return student;
    }
    async addGrade(courseId, studentId, dto) {
        const course = await this.findCourseById(courseId);
        const student = await this.getStudentById(courseId, studentId);
        if (dto.score > course.maxGrade) {
            throw new BadRequestException(`La nota (${dto.score}) no puede exceder la nota máxima permitida en este curso (${course.maxGrade})`);
        }
        if (dto.score < 0) {
            throw new BadRequestException('La calificación no puede ser negativa');
        }
        const currentPercentage = student.grades.reduce((sum, g) => sum + g.percentage, 0);
        const newTotalPercentage = currentPercentage + dto.percentage;
        if (newTotalPercentage > 100) {
            throw new BadRequestException(`El porcentaje total acumulado superaría el 100%. Actualmente acumula ${currentPercentage}%, intentar sumar ${dto.percentage}% daría ${newTotalPercentage}%`);
        }
        if (this.isSupabaseActive()) {
            const client = this.getClient();
            const { data, error } = await client
                .from('grades')
                .insert({
                student_id: studentId,
                activity: dto.activity.trim(),
                score: Number(dto.score.toFixed(2)),
                percentage: Number(dto.percentage.toFixed(2)),
                comments: dto.comments?.trim() || null,
            })
                .select()
                .single();
            if (error) {
                throw new BadRequestException(`Error al insertar nota en Supabase: ${error.message}`);
            }
            return this.mapGrade(data);
        }
        const newGrade = {
            id: randomUUID(),
            activity: dto.activity.trim(),
            score: Number(dto.score.toFixed(2)),
            percentage: Number(dto.percentage.toFixed(2)),
            comments: dto.comments?.trim(),
            createdAt: new Date(),
        };
        student.grades.push(newGrade);
        course.updatedAt = new Date();
        return newGrade;
    }
    async getStudentGrades(courseId, studentId) {
        const course = await this.findCourseById(courseId);
        const student = await this.getStudentById(courseId, studentId);
        const summary = this.calculateStudentAverage(student, course.passingGrade);
        return {
            course: {
                id: course.id,
                code: course.code,
                name: course.name,
                passingGrade: course.passingGrade,
                maxGrade: course.maxGrade,
            },
            student: {
                id: student.id,
                code: student.code,
                name: student.name,
                email: student.email,
            },
            grades: student.grades,
            calculation: {
                accumulatedPercentage: summary.totalPercentage,
                remainingPercentage: Number((100 - summary.totalPercentage).toFixed(2)),
                currentAverage: summary.currentAverage,
                status: summary.status,
                passingGradeRequired: course.passingGrade,
            },
        };
    }
    async updateGrade(courseId, studentId, gradeId, dto) {
        const course = await this.findCourseById(courseId);
        const student = await this.getStudentById(courseId, studentId);
        const grade = student.grades.find((g) => g.id === gradeId);
        if (!grade) {
            throw new NotFoundException(`Nota con ID '${gradeId}' no encontrada`);
        }
        if (dto.score !== undefined) {
            if (dto.score > course.maxGrade || dto.score < 0) {
                throw new BadRequestException(`La nota debe estar en el rango entre 0 y ${course.maxGrade}`);
            }
        }
        if (dto.percentage !== undefined) {
            const otherPercentages = student.grades
                .filter((g) => g.id !== gradeId)
                .reduce((sum, g) => sum + g.percentage, 0);
            const updatedTotal = otherPercentages + dto.percentage;
            if (updatedTotal > 100) {
                throw new BadRequestException(`El porcentaje total no puede exceder el 100% (quedaría en ${updatedTotal}%)`);
            }
        }
        if (this.isSupabaseActive()) {
            const client = this.getClient();
            const updatePayload = {};
            if (dto.activity !== undefined)
                updatePayload.activity = dto.activity.trim();
            if (dto.score !== undefined)
                updatePayload.score = Number(dto.score.toFixed(2));
            if (dto.percentage !== undefined)
                updatePayload.percentage = Number(dto.percentage.toFixed(2));
            if (dto.comments !== undefined)
                updatePayload.comments = dto.comments.trim();
            const { data, error } = await client
                .from('grades')
                .update(updatePayload)
                .eq('id', gradeId)
                .select()
                .single();
            if (error) {
                throw new BadRequestException(`Error al actualizar nota en Supabase: ${error.message}`);
            }
            return this.mapGrade(data);
        }
        if (dto.score !== undefined)
            grade.score = Number(dto.score.toFixed(2));
        if (dto.percentage !== undefined)
            grade.percentage = Number(dto.percentage.toFixed(2));
        if (dto.activity !== undefined)
            grade.activity = dto.activity.trim();
        if (dto.comments !== undefined)
            grade.comments = dto.comments.trim();
        course.updatedAt = new Date();
        return grade;
    }
    async deleteGrade(courseId, studentId, gradeId) {
        const course = await this.findCourseById(courseId);
        const student = await this.getStudentById(courseId, studentId);
        const grade = student.grades.find((g) => g.id === gradeId);
        if (!grade) {
            throw new NotFoundException(`Nota con ID '${gradeId}' no encontrada`);
        }
        if (this.isSupabaseActive()) {
            const client = this.getClient();
            const { error } = await client.from('grades').delete().eq('id', gradeId);
            if (error) {
                throw new BadRequestException(`Error al eliminar nota en Supabase: ${error.message}`);
            }
            return {
                message: `La nota '${grade.activity}' (${grade.score}) fue eliminada exitosamente de Supabase`,
                deletedId: grade.id,
            };
        }
        const index = student.grades.findIndex((g) => g.id === gradeId);
        const [deleted] = student.grades.splice(index, 1);
        course.updatedAt = new Date();
        return {
            message: `La nota '${deleted.activity}' (${deleted.score}) fue eliminada exitosamente`,
            deletedId: deleted.id,
        };
    }
    async getCourseReport(courseId) {
        const course = await this.findCourseById(courseId);
        const studentsReport = course.students.map((student) => {
            const summary = this.calculateStudentAverage(student, course.passingGrade);
            return {
                id: student.id,
                code: student.code,
                name: student.name,
                gradesCount: student.grades.length,
                accumulatedPercentage: summary.totalPercentage,
                currentAverage: summary.currentAverage,
                status: summary.status,
            };
        });
        const evaluatedStudents = studentsReport.filter((s) => s.gradesCount > 0);
        const totalEnrolled = studentsReport.length;
        let classAverage = 0;
        let approvedCount = 0;
        let failedCount = 0;
        let inProgressCount = 0;
        if (evaluatedStudents.length > 0) {
            const totalScore = evaluatedStudents.reduce((sum, s) => sum + s.currentAverage, 0);
            classAverage = Number((totalScore / evaluatedStudents.length).toFixed(2));
            studentsReport.forEach((s) => {
                if (s.status === 'Aprobado')
                    approvedCount++;
                else if (s.status === 'Reprobado')
                    failedCount++;
                else
                    inProgressCount++;
            });
        }
        const sortedByScore = [...evaluatedStudents].sort((a, b) => b.currentAverage - a.currentAverage);
        const topStudent = sortedByScore.length > 0 ? sortedByScore[0] : null;
        const lowestStudent = sortedByScore.length > 0 ? sortedByScore[sortedByScore.length - 1] : null;
        return {
            course: {
                id: course.id,
                code: course.code,
                name: course.name,
                professor: course.professor,
                passingGrade: course.passingGrade,
                maxGrade: course.maxGrade,
            },
            metrics: {
                totalEnrolled,
                evaluatedStudents: evaluatedStudents.length,
                classAverage,
                approvedCount,
                failedCount,
                inProgressCount,
                topStudent: topStudent
                    ? { name: topStudent.name, code: topStudent.code, average: topStudent.currentAverage }
                    : null,
                lowestStudent: lowestStudent
                    ? {
                        name: lowestStudent.name,
                        code: lowestStudent.code,
                        average: lowestStudent.currentAverage,
                    }
                    : null,
            },
            students: studentsReport,
        };
    }
    findCourseByIdFromMemory(courseId) {
        const course = this.courses.find((c) => c.id === courseId);
        if (!course) {
            throw new NotFoundException(`Curso con ID '${courseId}' no encontrado`);
        }
        return course;
    }
    mapCourse(raw, rawStudents = []) {
        return {
            id: raw.id,
            code: raw.code,
            name: raw.name,
            description: raw.description ?? undefined,
            professor: raw.professor,
            passingGrade: Number(raw.passing_grade ?? raw.passingGrade ?? 3.0),
            maxGrade: Number(raw.max_grade ?? raw.maxGrade ?? 5.0),
            students: rawStudents.map((s) => this.mapStudent(s, s.grades || [])),
            createdAt: new Date(raw.created_at ?? raw.createdAt ?? Date.now()),
            updatedAt: new Date(raw.updated_at ?? raw.updatedAt ?? Date.now()),
        };
    }
    mapStudent(raw, rawGrades = []) {
        return {
            id: raw.id,
            code: raw.code,
            name: raw.name,
            email: raw.email,
            grades: rawGrades.map((g) => this.mapGrade(g)),
        };
    }
    mapGrade(raw) {
        return {
            id: raw.id,
            activity: raw.activity,
            score: Number(raw.score),
            percentage: Number(raw.percentage),
            comments: raw.comments ?? undefined,
            createdAt: new Date(raw.created_at ?? raw.createdAt ?? Date.now()),
        };
    }
    calculateStudentAverage(student, passingGrade = 3.0) {
        if (student.grades.length === 0) {
            return { totalPercentage: 0, currentAverage: 0, status: 'En progreso' };
        }
        const totalPercentage = student.grades.reduce((sum, g) => sum + g.percentage, 0);
        const weightedSum = student.grades.reduce((sum, g) => sum + g.score * (g.percentage / 100), 0);
        let currentAverage = 0;
        if (totalPercentage > 0) {
            currentAverage = Number((weightedSum / (totalPercentage / 100)).toFixed(2));
        }
        let status = 'En progreso';
        if (totalPercentage >= 100) {
            status = currentAverage >= passingGrade ? 'Aprobado' : 'Reprobado';
        }
        else {
            if (weightedSum >= passingGrade) {
                status = 'Aprobado';
            }
        }
        return {
            totalPercentage: Number(totalPercentage.toFixed(2)),
            currentAverage,
            status,
        };
    }
    seedInitialData() {
        const demoCourse = {
            id: 'demo-curso-01',
            code: 'PROG-101',
            name: 'Modelado y Programación Ágil',
            description: 'Curso práctico enfocado en arquitecturas limpias y desarrollo ágil',
            professor: 'Prof. Santiago Herrera',
            passingGrade: 3.0,
            maxGrade: 5.0,
            createdAt: new Date(),
            updatedAt: new Date(),
            students: [
                {
                    id: 'est-001',
                    code: '20241001',
                    name: 'Mateo Restrepo',
                    email: 'mateo.restrepo@universidad.edu',
                    grades: [
                        {
                            id: 'grade-001',
                            activity: 'Primer Parcial Teórico',
                            score: 4.2,
                            percentage: 30,
                            comments: 'Muy buen análisis de los patrones',
                            createdAt: new Date(),
                        },
                        {
                            id: 'grade-002',
                            activity: 'Taller de Casos de Uso',
                            score: 4.8,
                            percentage: 20,
                            comments: 'Excelente entrega a tiempo',
                            createdAt: new Date(),
                        },
                    ],
                },
                {
                    id: 'est-002',
                    code: '20241002',
                    name: 'Valentina Gómez',
                    email: 'valentina.gomez@universidad.edu',
                    grades: [
                        {
                            id: 'grade-003',
                            activity: 'Primer Parcial Teórico',
                            score: 3.5,
                            percentage: 30,
                            comments: 'Revisar conceptos de herencia',
                            createdAt: new Date(),
                        },
                    ],
                },
            ],
        };
        this.courses.push(demoCourse);
    }
};
CoursesService = CoursesService_1 = __decorate([
    Injectable(),
    __param(0, Optional()),
    __metadata("design:paramtypes", [SupabaseService])
], CoursesService);
export { CoursesService };
//# sourceMappingURL=courses.service.js.map