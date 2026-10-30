var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty } from '@nestjs/swagger';
import { Student } from './student.entity.js';
export class Course {
    id;
    code;
    name;
    description;
    professor;
    passingGrade;
    maxGrade;
    students;
    createdAt;
    updatedAt;
}
__decorate([
    ApiProperty({ example: 'c1-uuid-9876' }),
    __metadata("design:type", String)
], Course.prototype, "id", void 0);
__decorate([
    ApiProperty({ example: 'MAT-201', description: 'Código único del curso' }),
    __metadata("design:type", String)
], Course.prototype, "code", void 0);
__decorate([
    ApiProperty({ example: 'Cálculo Multivariable', description: 'Nombre de la materia o curso' }),
    __metadata("design:type", String)
], Course.prototype, "name", void 0);
__decorate([
    ApiProperty({ example: 'Curso enfocado en derivadas parciales e integrales múltiples', required: false }),
    __metadata("design:type", String)
], Course.prototype, "description", void 0);
__decorate([
    ApiProperty({ example: 'Dra. Elena Ramos', description: 'Nombre del docente o profesor' }),
    __metadata("design:type", String)
], Course.prototype, "professor", void 0);
__decorate([
    ApiProperty({ example: 3.0, description: 'Nota mínima necesaria para aprobar el curso' }),
    __metadata("design:type", Number)
], Course.prototype, "passingGrade", void 0);
__decorate([
    ApiProperty({ example: 5.0, description: 'Nota máxima posible del sistema de calificación' }),
    __metadata("design:type", Number)
], Course.prototype, "maxGrade", void 0);
__decorate([
    ApiProperty({ type: () => [Student], description: 'Estudiantes inscritos en este curso' }),
    __metadata("design:type", Array)
], Course.prototype, "students", void 0);
__decorate([
    ApiProperty({ example: '2026-10-30T04:00:00.000Z' }),
    __metadata("design:type", Date)
], Course.prototype, "createdAt", void 0);
__decorate([
    ApiProperty({ example: '2026-10-30T04:00:00.000Z' }),
    __metadata("design:type", Date)
], Course.prototype, "updatedAt", void 0);
//# sourceMappingURL=course.entity.js.map