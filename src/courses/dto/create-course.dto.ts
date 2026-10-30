import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'Código único identificador del curso',
    example: 'MAT-201',
  })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código del curso es obligatorio' })
  code: string;

  @ApiProperty({
    description: 'Nombre descriptivo de la materia o curso',
    example: 'Cálculo Multivariable',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del curso es obligatorio' })
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción breve de los objetivos y contenido del curso',
    example: 'Curso avanzado sobre cálculo vectorial e integrales múltiples',
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description?: string;

  @ApiProperty({
    description: 'Nombre del docente o profesor encargado de la materia',
    example: 'Dra. Elena Ramos',
  })
  @IsString({ message: 'El nombre del docente debe ser texto' })
  @IsNotEmpty({ message: 'El docente es obligatorio' })
  professor: string;

  @ApiPropertyOptional({
    description: 'Nota mínima requerida para aprobar (por defecto: 3.0)',
    example: 3.0,
    default: 3.0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'La nota de aprobación debe ser un número' })
  @Min(0, { message: 'La nota de aprobación no puede ser menor a 0' })
  @Max(100, { message: 'La nota de aprobación no puede exceder 100' })
  passingGrade?: number = 3.0;

  @ApiPropertyOptional({
    description: 'Nota máxima posible en la escala (por defecto: 5.0)',
    example: 5.0,
    default: 5.0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'La nota máxima debe ser un número' })
  @Min(1, { message: 'La nota máxima debe ser de al menos 1' })
  @Max(100, { message: 'La nota máxima no puede exceder 100' })
  maxGrade?: number = 5.0;
}
