import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateGradeDto {
  @ApiProperty({
    description: 'Nombre de la evaluación o actividad evaluativa',
    example: 'Parcial 1',
  })
  @IsString({ message: 'El nombre de la actividad debe ser texto' })
  @IsNotEmpty({ message: 'El nombre de la actividad es obligatorio' })
  activity: string;

  @ApiProperty({
    description: 'Calificación numérica obtenida',
    example: 4.5,
  })
  @IsNumber({}, { message: 'La calificación debe ser un valor numérico' })
  @Min(0, { message: 'La calificación mínima es 0' })
  score: number;

  @ApiProperty({
    description: 'Porcentaje o peso de la nota dentro de la materia (1% a 100%)',
    example: 30,
  })
  @IsNumber({}, { message: 'El porcentaje debe ser un valor numérico' })
  @Min(1, { message: 'El porcentaje mínimo es 1%' })
  @Max(100, { message: 'El porcentaje no puede ser mayor a 100%' })
  percentage: number;

  @ApiPropertyOptional({
    description: 'Comentarios, feedback o justificación de la calificación',
    example: 'Excelente desempeño en la resolución del problema 3',
  })
  @IsOptional()
  @IsString({ message: 'Los comentarios deben ser texto' })
  comments?: string;
}
