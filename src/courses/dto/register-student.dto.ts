import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterStudentDto {
  @ApiProperty({
    description: 'Código o matrícula única del estudiante',
    example: 'EST-2026-01',
  })
  @IsString({ message: 'El código del estudiante debe ser texto' })
  @IsNotEmpty({ message: 'El código del estudiante es obligatorio' })
  code: string;

  @ApiProperty({
    description: 'Nombre completo del estudiante',
    example: 'Alejandro Morales',
  })
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre del estudiante es obligatorio' })
  name: string;

  @ApiProperty({
    description: 'Correo electrónico institucional o personal',
    example: 'alejandro.morales@universidad.edu',
  })
  @IsEmail({}, { message: 'El correo debe ser un email válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email: string;
}
