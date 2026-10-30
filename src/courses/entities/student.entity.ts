import { ApiProperty } from '@nestjs/swagger';
import { Grade } from './grade.entity.js';

export class Student {
  @ApiProperty({ example: 's1-uuid-1234' })
  id: string;

  @ApiProperty({ example: 'EST-2026-01', description: 'Código o matrícula del estudiante' })
  code: string;

  @ApiProperty({ example: 'Alejandro Morales', description: 'Nombre completo del estudiante' })
  name: string;

  @ApiProperty({ example: 'alejandro.morales@universidad.edu' })
  email: string;

  @ApiProperty({ type: () => [Grade], description: 'Historial de calificaciones registradas' })
  grades: Grade[];
}
