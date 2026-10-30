import { CoursesService } from './courses.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { RegisterStudentDto } from './dto/register-student.dto.js';
import { CreateGradeDto } from './dto/create-grade.dto.js';
import { UpdateGradeDto } from './dto/update-grade.dto.js';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    createCourse(dto: CreateCourseDto): Promise<import("./entities/course.entity.js").Course>;
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
    findCourseById(courseId: string): Promise<import("./entities/course.entity.js").Course>;
    updateCourse(courseId: string, dto: UpdateCourseDto): Promise<import("./entities/course.entity.js").Course>;
    deleteCourse(courseId: string): Promise<{
        message: string;
        deletedId: string;
    }>;
    registerStudent(courseId: string, dto: RegisterStudentDto): Promise<import("./entities/student.entity.js").Student>;
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
    getStudentById(courseId: string, studentId: string): Promise<import("./entities/student.entity.js").Student>;
    addGrade(courseId: string, studentId: string, dto: CreateGradeDto): Promise<import("./entities/grade.entity.js").Grade>;
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
        grades: import("./entities/grade.entity.js").Grade[];
        calculation: {
            accumulatedPercentage: number;
            remainingPercentage: number;
            currentAverage: number;
            status: "Aprobado" | "Reprobado" | "En progreso";
            passingGradeRequired: number;
        };
    }>;
    updateGrade(courseId: string, studentId: string, gradeId: string, dto: UpdateGradeDto): Promise<import("./entities/grade.entity.js").Grade>;
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
}
