import { Course } from './entities/course.entity.js';
import { Student } from './entities/student.entity.js';
import { Grade } from './entities/grade.entity.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { RegisterStudentDto } from './dto/register-student.dto.js';
import { CreateGradeDto } from './dto/create-grade.dto.js';
import { UpdateGradeDto } from './dto/update-grade.dto.js';
import { SupabaseService } from '../supabase/supabase.service.js';
export declare class CoursesService {
    private readonly supabaseService?;
    private readonly logger;
    private courses;
    constructor(supabaseService?: SupabaseService | undefined);
    private isSupabaseActive;
    private getClient;
    createCourse(dto: CreateCourseDto): Promise<Course>;
    findAllCourses(): Promise<{
        id: string;
        code: string;
        name: string;
        description: string | undefined;
        professor: string;
        passingGrade: number;
        maxGrade: number;
        totalStudents: number;
        totalGradesCount: number;
        courseAverage: number;
        createdAt: Date;
    }[]>;
    private findAllCoursesFromMemory;
    private buildCourseSummary;
    findCourseById(courseId: string): Promise<Course>;
    updateCourse(courseId: string, dto: UpdateCourseDto): Promise<Course>;
    deleteCourse(courseId: string): Promise<{
        message: string;
        deletedId: string;
    }>;
    registerStudent(courseId: string, dto: RegisterStudentDto): Promise<Student>;
    getStudentsByCourse(courseId: string): Promise<{
        id: string;
        code: string;
        name: string;
        email: string;
        totalGrades: number;
        accumulatedPercentage: number;
        currentAverage: number;
        status: "Aprobado" | "Reprobado" | "En progreso";
    }[]>;
    getStudentById(courseId: string, studentId: string): Promise<Student>;
    addGrade(courseId: string, studentId: string, dto: CreateGradeDto): Promise<Grade>;
    getStudentGrades(courseId: string, studentId: string): Promise<{
        course: {
            id: string;
            code: string;
            name: string;
            passingGrade: number;
            maxGrade: number;
        };
        student: {
            id: string;
            code: string;
            name: string;
            email: string;
        };
        grades: Grade[];
        calculation: {
            accumulatedPercentage: number;
            remainingPercentage: number;
            currentAverage: number;
            status: "Aprobado" | "Reprobado" | "En progreso";
            passingGradeRequired: number;
        };
    }>;
    updateGrade(courseId: string, studentId: string, gradeId: string, dto: UpdateGradeDto): Promise<Grade>;
    deleteGrade(courseId: string, studentId: string, gradeId: string): Promise<{
        message: string;
        deletedId: string;
    }>;
    getCourseReport(courseId: string): Promise<{
        course: {
            id: string;
            code: string;
            name: string;
            professor: string;
            passingGrade: number;
            maxGrade: number;
        };
        metrics: {
            totalEnrolled: number;
            evaluatedStudents: number;
            classAverage: number;
            approvedCount: number;
            failedCount: number;
            inProgressCount: number;
            topStudent: {
                name: string;
                code: string;
                average: number;
            } | null;
            lowestStudent: {
                name: string;
                code: string;
                average: number;
            } | null;
        };
        students: {
            id: string;
            code: string;
            name: string;
            gradesCount: number;
            accumulatedPercentage: number;
            currentAverage: number;
            status: "Aprobado" | "Reprobado" | "En progreso";
        }[];
    }>;
    private findCourseByIdFromMemory;
    private mapCourse;
    private mapStudent;
    private mapGrade;
    private calculateStudentAverage;
    private seedInitialData;
}
