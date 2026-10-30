import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Course } from './entities/course.entity.js';
import { Student } from './entities/student.entity.js';
import { Grade } from './entities/grade.entity.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { RegisterStudentDto } from './dto/register-student.dto.js';
import { CreateGradeDto } from './dto/create-grade.dto.js';
import { UpdateGradeDto } from './dto/update-grade.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);
  private courses: Course[] = [];

  constructor(@Optional() private readonly supabaseService?: SupabaseService) {
    this.seedInitialData();
  }

  private isSupabaseActive(): boolean {
    return Boolean(this.supabaseService?.isConfigured());
  }

  private getClient() {
    return this.supabaseService?.getClient() ?? null;
  }

  // =========================================================================
  // GESTIÓN DE CURSOS
  // =========================================================================

  /**
   * Crea un nuevo curso (en Supabase o en memoria)
   */
  async createCourse(dto: CreateCourseDto): Promise<Course> {
    const passingGrade = dto.passingGrade ?? 3.0;
    const maxGrade = dto.maxGrade ?? 5.0;

    if (passingGrade > maxGrade) {
      throw new BadRequestException(
        `La nota de aprobación (${passingGrade}) no puede ser mayor que la nota máxima (${maxGrade})`,
      );
    }

    if (this.isSupabaseActive()) {
      const client = this.getClient()!;
      // Verificar si ya existe curso con ese código
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

    // Modo memoria local
    const existing = this.courses.find(
      (c) => c.code.toLowerCase() === dto.code.trim().toLowerCase(),
    );
    if (existing) {
      throw new ConflictException(`Ya existe un curso con el código '${dto.code}'`);
    }

    const newCourse: Course = {
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

  /**
   * Retorna todos los cursos con resumen de métricas
   */
  async findAllCourses() {
    if (this.isSupabaseActive()) {
      const client = this.getClient()!;
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
        // Fallback a memoria si las tablas aún no están creadas en Supabase
        return this.findAllCoursesFromMemory();
      }

      return (data || []).map((c: any) => {
        const course = this.mapCourse(c, c.students || []);
        return this.buildCourseSummary(course);
      });
    }

    return this.findAllCoursesFromMemory();
  }

  private findAllCoursesFromMemory() {
    return this.courses.map((course) => this.buildCourseSummary(course));
  }

  private buildCourseSummary(course: Course) {
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

    const courseAverage =
      studentWithGradesCount > 0
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

  /**
   * Retorna un curso específico por su ID
   */
  async findCourseById(courseId: string): Promise<Course> {
    if (this.isSupabaseActive()) {
      const client = this.getClient()!;
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

  /**
   * Actualiza los datos de un curso
   */
  async updateCourse(courseId: string, dto: UpdateCourseDto): Promise<Course> {
    if (this.isSupabaseActive()) {
      const client = this.getClient()!;
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

      const updatePayload: Record<string, any> = {};
      if (dto.code !== undefined) updatePayload.code = dto.code.trim().toUpperCase();
      if (dto.name !== undefined) updatePayload.name = dto.name.trim();
      if (dto.description !== undefined) updatePayload.description = dto.description.trim();
      if (dto.professor !== undefined) updatePayload.professor = dto.professor.trim();
      if (dto.passingGrade !== undefined) updatePayload.passing_grade = dto.passingGrade;
      if (dto.maxGrade !== undefined) updatePayload.max_grade = dto.maxGrade;

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
      const existing = this.courses.find(
        (c) => c.id !== courseId && c.code.toLowerCase() === dto.code?.toLowerCase(),
      );
      if (existing) {
        throw new ConflictException(`Ya existe otro curso con el código '${dto.code}'`);
      }
      course.code = dto.code.trim().toUpperCase();
    }

    if (dto.name !== undefined) course.name = dto.name.trim();
    if (dto.description !== undefined) course.description = dto.description.trim();
    if (dto.professor !== undefined) course.professor = dto.professor.trim();
    if (dto.passingGrade !== undefined) course.passingGrade = dto.passingGrade;
    if (dto.maxGrade !== undefined) course.maxGrade = dto.maxGrade;

    if (course.passingGrade > course.maxGrade) {
      throw new BadRequestException('La nota de aprobación no puede superar la nota máxima');
    }

    course.updatedAt = new Date();
    return course;
  }

  /**
   * Elimina un curso
   */
  async deleteCourse(courseId: string) {
    if (this.isSupabaseActive()) {
      const client = this.getClient()!;
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

  // =========================================================================
  // GESTIÓN DE ESTUDIANTES
  // =========================================================================

  /**
   * Inscribe o registra un nuevo estudiante en el curso
   */
  async registerStudent(courseId: string, dto: RegisterStudentDto): Promise<Student> {
    if (this.isSupabaseActive()) {
      const client = this.getClient()!;
      // Verificar que el curso exista
      await this.findCourseById(courseId);

      // Verificar código o email duplicado en el mismo curso
      const { data: existingCode } = await client
        .from('students')
        .select('id')
        .eq('course_id', courseId)
        .ilike('code', dto.code.trim())
        .maybeSingle();

      if (existingCode) {
        throw new ConflictException(
          `Ya existe un estudiante con el código '${dto.code}' en este curso`,
        );
      }

      const { data: existingEmail } = await client
        .from('students')
        .select('id')
        .eq('course_id', courseId)
        .ilike('email', dto.email.trim())
        .maybeSingle();

      if (existingEmail) {
        throw new ConflictException(
          `Ya existe un estudiante con el correo '${dto.email}' en este curso`,
        );
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

    const codeExists = course.students.some(
      (s) => s.code.toLowerCase() === dto.code.trim().toLowerCase(),
    );
    if (codeExists) {
      throw new ConflictException(
        `Ya existe un estudiante con el código '${dto.code}' en este curso`,
      );
    }

    const emailExists = course.students.some(
      (s) => s.email.toLowerCase() === dto.email.trim().toLowerCase(),
    );
    if (emailExists) {
      throw new ConflictException(
        `Ya existe un estudiante con el correo '${dto.email}' en este curso`,
      );
    }

    const newStudent: Student = {
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

  /**
   * Obtiene la lista de estudiantes inscritos en un curso con sus promedios
   */
  async getStudentsByCourse(courseId: string) {
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

  /**
   * Obtiene un estudiante de un curso
   */
  async getStudentById(courseId: string, studentId: string): Promise<Student> {
    const course = await this.findCourseById(courseId);
    const student = course.students.find((s) => s.id === studentId);
    if (!student) {
      throw new NotFoundException(
        `Estudiante con ID '${studentId}' no encontrado en el curso '${course.name}'`,
      );
    }
    return student;
  }

  // =========================================================================
  // GESTIÓN DE CALIFICACIONES / NOTAS
  // =========================================================================

  /**
   * Registra una nueva nota para un estudiante en un curso
   */
  async addGrade(courseId: string, studentId: string, dto: CreateGradeDto): Promise<Grade> {
    const course = await this.findCourseById(courseId);
    const student = await this.getStudentById(courseId, studentId);

    if (dto.score > course.maxGrade) {
      throw new BadRequestException(
        `La nota (${dto.score}) no puede exceder la nota máxima permitida en este curso (${course.maxGrade})`,
      );
    }

    if (dto.score < 0) {
      throw new BadRequestException('La calificación no puede ser negativa');
    }

    const currentPercentage = student.grades.reduce((sum, g) => sum + g.percentage, 0);
    const newTotalPercentage = currentPercentage + dto.percentage;

    if (newTotalPercentage > 100) {
      throw new BadRequestException(
        `El porcentaje total acumulado superaría el 100%. Actualmente acumula ${currentPercentage}%, intentar sumar ${dto.percentage}% daría ${newTotalPercentage}%`,
      );
    }

    if (this.isSupabaseActive()) {
      const client = this.getClient()!;
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

    const newGrade: Grade = {
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

  /**
   * Retorna las notas de un estudiante con el desglose del promedio ponderado
   */
  async getStudentGrades(courseId: string, studentId: string) {
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

  /**
   * Modifica una calificación existente
   */
  async updateGrade(
    courseId: string,
    studentId: string,
    gradeId: string,
    dto: UpdateGradeDto,
  ): Promise<Grade> {
    const course = await this.findCourseById(courseId);
    const student = await this.getStudentById(courseId, studentId);
    const grade = student.grades.find((g) => g.id === gradeId);

    if (!grade) {
      throw new NotFoundException(`Nota con ID '${gradeId}' no encontrada`);
    }

    if (dto.score !== undefined) {
      if (dto.score > course.maxGrade || dto.score < 0) {
        throw new BadRequestException(
          `La nota debe estar en el rango entre 0 y ${course.maxGrade}`,
        );
      }
    }

    if (dto.percentage !== undefined) {
      const otherPercentages = student.grades
        .filter((g) => g.id !== gradeId)
        .reduce((sum, g) => sum + g.percentage, 0);

      const updatedTotal = otherPercentages + dto.percentage;
      if (updatedTotal > 100) {
        throw new BadRequestException(
          `El porcentaje total no puede exceder el 100% (quedaría en ${updatedTotal}%)`,
        );
      }
    }

    if (this.isSupabaseActive()) {
      const client = this.getClient()!;
      const updatePayload: Record<string, any> = {};
      if (dto.activity !== undefined) updatePayload.activity = dto.activity.trim();
      if (dto.score !== undefined) updatePayload.score = Number(dto.score.toFixed(2));
      if (dto.percentage !== undefined) updatePayload.percentage = Number(dto.percentage.toFixed(2));
      if (dto.comments !== undefined) updatePayload.comments = dto.comments.trim();

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

    if (dto.score !== undefined) grade.score = Number(dto.score.toFixed(2));
    if (dto.percentage !== undefined) grade.percentage = Number(dto.percentage.toFixed(2));
    if (dto.activity !== undefined) grade.activity = dto.activity.trim();
    if (dto.comments !== undefined) grade.comments = dto.comments.trim();

    course.updatedAt = new Date();
    return grade;
  }

  /**
   * Elimina una calificación registrada
   */
  async deleteGrade(courseId: string, studentId: string, gradeId: string) {
    const course = await this.findCourseById(courseId);
    const student = await this.getStudentById(courseId, studentId);
    const grade = student.grades.find((g) => g.id === gradeId);

    if (!grade) {
      throw new NotFoundException(`Nota con ID '${gradeId}' no encontrada`);
    }

    if (this.isSupabaseActive()) {
      const client = this.getClient()!;
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

  // =========================================================================
  // REPORTE ANALÍTICO DEL CURSO
  // =========================================================================

  /**
   * Genera un reporte estadístico completo del curso
   */
  async getCourseReport(courseId: string) {
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
        if (s.status === 'Aprobado') approvedCount++;
        else if (s.status === 'Reprobado') failedCount++;
        else inProgressCount++;
      });
    }

    const sortedByScore = [...evaluatedStudents].sort(
      (a, b) => b.currentAverage - a.currentAverage,
    );

    const topStudent = sortedByScore.length > 0 ? sortedByScore[0] : null;
    const lowestStudent =
      sortedByScore.length > 0 ? sortedByScore[sortedByScore.length - 1] : null;

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

  // =========================================================================
  // MÉTODOS AUXILIARES Y MAPEADORES
  // =========================================================================

  private findCourseByIdFromMemory(courseId: string): Course {
    const course = this.courses.find((c) => c.id === courseId);
    if (!course) {
      throw new NotFoundException(`Curso con ID '${courseId}' no encontrado`);
    }
    return course;
  }

  private mapCourse(raw: any, rawStudents: any[] = []): Course {
    return {
      id: raw.id,
      code: raw.code,
      name: raw.name,
      description: raw.description ?? undefined,
      professor: raw.professor,
      passingGrade: Number(raw.passing_grade ?? raw.passingGrade ?? 3.0),
      maxGrade: Number(raw.max_grade ?? raw.maxGrade ?? 5.0),
      students: rawStudents.map((s: any) => this.mapStudent(s, s.grades || [])),
      createdAt: new Date(raw.created_at ?? raw.createdAt ?? Date.now()),
      updatedAt: new Date(raw.updated_at ?? raw.updatedAt ?? Date.now()),
    };
  }

  private mapStudent(raw: any, rawGrades: any[] = []): Student {
    return {
      id: raw.id,
      code: raw.code,
      name: raw.name,
      email: raw.email,
      grades: rawGrades.map((g: any) => this.mapGrade(g)),
    };
  }

  private mapGrade(raw: any): Grade {
    return {
      id: raw.id,
      activity: raw.activity,
      score: Number(raw.score),
      percentage: Number(raw.percentage),
      comments: raw.comments ?? undefined,
      createdAt: new Date(raw.created_at ?? raw.createdAt ?? Date.now()),
    };
  }

  /**
   * Método auxiliar para calcular el promedio ponderado de un estudiante
   */
  private calculateStudentAverage(
    student: Student,
    passingGrade = 3.0,
  ): {
    totalPercentage: number;
    currentAverage: number;
    status: 'Aprobado' | 'Reprobado' | 'En progreso';
  } {
    if (student.grades.length === 0) {
      return { totalPercentage: 0, currentAverage: 0, status: 'En progreso' };
    }

    const totalPercentage = student.grades.reduce((sum, g) => sum + g.percentage, 0);
    const weightedSum = student.grades.reduce(
      (sum, g) => sum + g.score * (g.percentage / 100),
      0,
    );

    let currentAverage = 0;
    if (totalPercentage > 0) {
      currentAverage = Number((weightedSum / (totalPercentage / 100)).toFixed(2));
    }

    let status: 'Aprobado' | 'Reprobado' | 'En progreso' = 'En progreso';
    if (totalPercentage >= 100) {
      status = currentAverage >= passingGrade ? 'Aprobado' : 'Reprobado';
    } else {
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

  /**
   * Datos iniciales de demostración en memoria local
   */
  private seedInitialData() {
    const demoCourse: Course = {
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
}
