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
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class RegisterStudentDto {
    code;
    name;
    email;
}
__decorate([
    ApiProperty({
        description: 'Código o matrícula única del estudiante',
        example: 'EST-2026-01',
    }),
    IsString({ message: 'El código del estudiante debe ser texto' }),
    IsNotEmpty({ message: 'El código del estudiante es obligatorio' }),
    __metadata("design:type", String)
], RegisterStudentDto.prototype, "code", void 0);
__decorate([
    ApiProperty({
        description: 'Nombre completo del estudiante',
        example: 'Alejandro Morales',
    }),
    IsString({ message: 'El nombre debe ser texto' }),
    IsNotEmpty({ message: 'El nombre del estudiante es obligatorio' }),
    __metadata("design:type", String)
], RegisterStudentDto.prototype, "name", void 0);
__decorate([
    ApiProperty({
        description: 'Correo electrónico institucional o personal',
        example: 'alejandro.morales@universidad.edu',
    }),
    IsEmail({}, { message: 'El correo debe ser un email válido' }),
    IsNotEmpty({ message: 'El correo electrónico es obligatorio' }),
    __metadata("design:type", String)
], RegisterStudentDto.prototype, "email", void 0);
//# sourceMappingURL=register-student.dto.js.map