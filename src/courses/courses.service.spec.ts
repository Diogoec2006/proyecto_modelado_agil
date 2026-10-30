import { BadRequestException, ConflictException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';
import { CoursesService } from './courses.service.js';

describe('CoursesService', () => {
  let service: CoursesService;

  beforeEach(() => {
    service = new CoursesService();
  });

  it('debe crearse con el curso inicial de demostración', async () => {
    const courses = await service.findAllCourses();
    expect(courses.length).toBeGreaterThan(0);
    expect(courses[0].code).toBe('PROG-101');
  });

  it('debe permitir crear un nuevo curso', async () => {
    const newCourse = await service.createCourse({
      code: 'BD-201',
      name: 'Bases de Datos Avanzadas',
      professor: 'Prof. Mario Lozano',
      passingGrade: 3.0,
      maxGrade: 5.0,
    });

    expect(newCourse).toBeDefined();
    expect(newCourse.code).toBe('BD-201');
    expect(newCourse.students).toEqual([]);
  });

  it('debe rechazar cursos con código duplicado', async () => {
    await expect(
      service.createCourse({
        code: 'PROG-101',
        name: 'Duplicado',
        professor: 'Cualquiera',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('debe registrar un estudiante en el curso', async () => {
    const courses = await service.findAllCourses();
    const courseId = courses[0].id;

    const student = await service.registerStudent(courseId, {
      code: '2026999',
      name: 'Camila Torres',
      email: 'camila.torres@universidad.edu',
    });

    expect(student.code).toBe('2026999');
    expect(student.grades).toEqual([]);
  });

  it('debe registrar notas y calcular el promedio correctamente', async () => {
    const course = await service.createCourse({
      code: 'FIS-101',
      name: 'Física I',
      professor: 'Prof. Einstein',
      passingGrade: 3.0,
      maxGrade: 5.0,
    });

    const student = await service.registerStudent(course.id, {
      code: 'EST-10',
      name: 'Daniel Mora',
      email: 'daniel.mora@universidad.edu',
    });

    await service.addGrade(course.id, student.id, {
      activity: 'Laboratorio 1',
      score: 4.0,
      percentage: 50,
    });

    await service.addGrade(course.id, student.id, {
      activity: 'Laboratorio 2',
      score: 5.0,
      percentage: 50,
    });

    const gradesSummary = await service.getStudentGrades(course.id, student.id);
    expect(gradesSummary.calculation.accumulatedPercentage).toBe(100);
    // (4.0 * 0.5) + (5.0 * 0.5) = 4.5
    expect(gradesSummary.calculation.currentAverage).toBe(4.5);
    expect(gradesSummary.calculation.status).toBe('Aprobado');
  });

  it('debe rechazar notas que hagan que el porcentaje acumulado supere el 100%', async () => {
    const course = await service.createCourse({
      code: 'QUIM-101',
      name: 'Química',
      professor: 'Prof. Curie',
    });

    const student = await service.registerStudent(course.id, {
      code: 'EST-20',
      name: 'Sofia Lara',
      email: 'sofia.lara@universidad.edu',
    });

    await service.addGrade(course.id, student.id, {
      activity: 'Taller 1',
      score: 4.0,
      percentage: 70,
    });

    await expect(
      service.addGrade(course.id, student.id, {
        activity: 'Taller 2',
        score: 3.5,
        percentage: 40, // 70 + 40 = 110% > 100%
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('debe rechazar notas mayores a la nota máxima del curso', async () => {
    const course = await service.createCourse({
      code: 'HIST-101',
      name: 'Historia',
      professor: 'Prof. García',
      maxGrade: 5.0,
    });

    const student = await service.registerStudent(course.id, {
      code: 'EST-30',
      name: 'Carlos Ruiz',
      email: 'carlos.ruiz@universidad.edu',
    });

    await expect(
      service.addGrade(course.id, student.id, {
        activity: 'Ensayo Final',
        score: 5.5, // > 5.0
        percentage: 30,
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
