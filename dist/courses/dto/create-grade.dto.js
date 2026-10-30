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
export class CreateGradeDto {
    activity;
    score;
    percentage;
    comments;
}
__decorate([
    ApiProperty({
        description: 'Nombre de la evaluación o actividad evaluativa',
        example: 'Parcial 1',
    }),
    IsString({ message: 'El nombre de la actividad debe ser texto' }),
    IsNotEmpty({ message: 'El nombre de la actividad es obligatorio' }),
    __metadata("design:type", String)
], CreateGradeDto.prototype, "activity", void 0);
__decorate([
    ApiProperty({
        description: 'Calificación numérica obtenida',
        example: 4.5,
    }),
    IsNumber({}, { message: 'La calificación debe ser un valor numérico' }),
    Min(0, { message: 'La calificación mínima es 0' }),
    __metadata("design:type", Number)
], CreateGradeDto.prototype, "score", void 0);
__decorate([
    ApiProperty({
        description: 'Porcentaje o peso de la nota dentro de la materia (1% a 100%)',
        example: 30,
    }),
    IsNumber({}, { message: 'El porcentaje debe ser un valor numérico' }),
    Min(1, { message: 'El porcentaje mínimo es 1%' }),
    Max(100, { message: 'El porcentaje no puede ser mayor a 100%' }),
    __metadata("design:type", Number)
], CreateGradeDto.prototype, "percentage", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Comentarios, feedback o justificación de la calificación',
        example: 'Excelente desempeño en la resolución del problema 3',
    }),
    IsOptional(),
    IsString({ message: 'Los comentarios deben ser texto' }),
    __metadata("design:type", String)
], CreateGradeDto.prototype, "comments", void 0);
//# sourceMappingURL=create-grade.dto.js.map