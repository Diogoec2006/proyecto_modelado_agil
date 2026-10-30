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
export class Grade {
    id;
    activity;
    score;
    percentage;
    comments;
    createdAt;
}
__decorate([
    ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' }),
    __metadata("design:type", String)
], Grade.prototype, "id", void 0);
__decorate([
    ApiProperty({ example: 'Parcial 1', description: 'Nombre o concepto de la evaluación' }),
    __metadata("design:type", String)
], Grade.prototype, "activity", void 0);
__decorate([
    ApiProperty({ example: 4.5, description: 'Calificación obtenida' }),
    __metadata("design:type", Number)
], Grade.prototype, "score", void 0);
__decorate([
    ApiProperty({ example: 30, description: 'Porcentaje o peso de la nota (ej. 30%)' }),
    __metadata("design:type", Number)
], Grade.prototype, "percentage", void 0);
__decorate([
    ApiProperty({ example: 'Excelente dominio de los conceptos', required: false }),
    __metadata("design:type", String)
], Grade.prototype, "comments", void 0);
__decorate([
    ApiProperty({ example: '2026-10-30T04:00:00.000Z' }),
    __metadata("design:type", Date)
], Grade.prototype, "createdAt", void 0);
//# sourceMappingURL=grade.entity.js.map