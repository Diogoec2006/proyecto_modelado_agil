import { ApiProperty } from '@nestjs/swagger';
import { Student } from './student.entity.js';

export class Course {
  @ApiProperty({ example: 'c1-uuid-9876' })
  id: string;

  @ApiProperty({ example: 'MAT-201', description: 'Código único del curso' })
  code: string;

  @ApiProperty({ example: 'Cálculo Multivariable', description: 'Nombre de la materia o curso' })
  name: string;

  @ApiProperty({ example: 'Curso enfocado en derivadas parciales e integrales múltiples', required: false })
  description?: string;

  @ApiProperty({ example: 'Dra. Elena Ramos', description: 'Nombre del docente o profesor' })
  professor: string;

  @ApiProperty({ example: 3.0, description: 'Nota mínima necesaria para aprobar el curso' })
  passingGrade: number;

  @ApiProperty({ example: 5.0, description: 'Nota máxima posible del sistema de calificación' })
  maxGrade: number;

  @ApiProperty({ type: () => [Student], description: 'Estudiantes inscritos en este curso' })
  students: Student[];

  @ApiProperty({ example: '2026-10-30T04:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-10-30T04:00:00.000Z' })
  updatedAt: Date;
}
