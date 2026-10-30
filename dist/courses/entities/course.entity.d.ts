import { Student } from './student.entity.js';
export declare class Course {
    id: string;
    code: string;
    name: string;
    description?: string;
    professor: string;
    passingGrade: number;
    maxGrade: number;
    students: Student[];
    createdAt: Date;
    updatedAt: Date;
}
