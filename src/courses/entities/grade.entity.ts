import { ApiProperty } from '@nestjs/swagger';

export class Grade {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'Parcial 1', description: 'Nombre o concepto de la evaluación' })
  activity: string;

  @ApiProperty({ example: 4.5, description: 'Calificación obtenida' })
  score: number;

  @ApiProperty({ example: 30, description: 'Porcentaje o peso de la nota (ej. 30%)' })
  percentage: number;

  @ApiProperty({ example: 'Excelente dominio de los conceptos', required: false })
  comments?: string;

  @ApiProperty({ example: '2026-10-30T04:00:00.000Z' })
  createdAt: Date;
}
