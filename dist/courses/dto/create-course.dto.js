var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
export class CreateCourseDto {
    code;
    name;
    description;
    professor;
    passingGrade = 3.0;
    maxGrade = 5.0;
}
__decorate([
    ApiProperty({
        description: 'Código único identificador del curso',
        example: 'MAT-201',
    }),
    IsString({ message: 'El código debe ser una cadena de texto' }),
    IsNotEmpty({ message: 'El código del curso es obligatorio' }),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "code", void 0);
__decorate([
    ApiProperty({
        description: 'Nombre descriptivo de la materia o curso',
        example: 'Cálculo Multivariable',
    }),
    IsString({ message: 'El nombre debe ser una cadena de texto' }),
    IsNotEmpty({ message: 'El nombre del curso es obligatorio' }),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "name", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Descripción breve de los objetivos y contenido del curso',
        example: 'Curso avanzado sobre cálculo vectorial e integrales múltiples',
    }),
    IsOptional(),
    IsString({ message: 'La descripción debe ser una cadena de texto' }),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "description", void 0);
__decorate([
    ApiProperty({
        description: 'Nombre del docente o profesor encargado de la materia',
        example: 'Dra. Elena Ramos',
    }),
    IsString({ message: 'El nombre del docente debe ser texto' }),
    IsNotEmpty({ message: 'El docente es obligatorio' }),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "professor", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Nota mínima requerida para aprobar (por defecto: 3.0)',
        example: 3.0,
        default: 3.0,
    }),
    IsOptional(),
    IsNumber({}, { message: 'La nota de aprobación debe ser un número' }),
    Min(0, { message: 'La nota de aprobación no puede ser menor a 0' }),
    Max(100, { message: 'La nota de aprobación no puede exceder 100' }),
    __metadata("design:type", Number)
], CreateCourseDto.prototype, "passingGrade", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Nota máxima posible en la escala (por defecto: 5.0)',
        example: 5.0,
        default: 5.0,
    }),
    IsOptional(),
    IsNumber({}, { message: 'La nota máxima debe ser un número' }),
    Min(1, { message: 'La nota máxima debe ser de al menos 1' }),
    Max(100, { message: 'La nota máxima no puede exceder 100' }),
    __metadata("design:type", Number)
], CreateCourseDto.prototype, "maxGrade", void 0);
//# sourceMappingURL=create-course.dto.js.map