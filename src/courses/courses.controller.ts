import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { RegisterStudentDto } from './dto/register-student.dto.js';
import { CreateGradeDto } from './dto/create-grade.dto.js';
import { UpdateGradeDto } from './dto/update-grade.dto.js';

@ApiTags('Cursos y Registro de Notas')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // -------------------------------------------------------------
  // GESTIÓN DE CURSOS
  // -------------------------------------------------------------

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo curso',
    description: 'Registra un curso nuevo con su código, nombre, docente y escala de calificación.',
  })
  @ApiResponse({ status: 201, description: 'Curso creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 409, description: 'Ya existe un curso con ese código.' })
  async createCourse(@Body() dto: CreateCourseDto) {
    return await this.coursesService.createCourse(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos los cursos',
    description: 'Devuelve la lista de cursos existentes con total de estudiantes y promedio global.',
  })
  @ApiResponse({ status: 200, description: 'Lista de cursos obtenida correctamente.' })
  async findAllCourses() {
    return await this.coursesService.findAllCourses();
  }

  @Get(':courseId')
  @ApiOperation({
    summary: 'Obtener un curso por ID',
    description: 'Devuelve la información detallada del curso junto con sus estudiantes y notas registradas.',
  })
  @ApiParam({ name: 'courseId', description: 'ID único del curso' })
  @ApiResponse({ status: 200, description: 'Curso encontrado.' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado.' })
  async findCourseById(@Param('courseId') courseId: string) {
    return await this.coursesService.findCourseById(courseId);
  }

  @Patch(':courseId')
  @ApiOperation({
    summary: 'Actualizar un curso',
    description: 'Permite modificar nombre, docente, descripción o parámetros de calificación de un curso.',
  })
  @ApiParam({ name: 'courseId', description: 'ID único del curso' })
  @ApiResponse({ status: 200, description: 'Curso actualizado con éxito.' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado.' })
  async updateCourse(@Param('courseId') courseId: string, @Body() dto: UpdateCourseDto) {
    return await this.coursesService.updateCourse(courseId, dto);
  }

  @Delete(':courseId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar un curso',
    description: 'Elimina un curso y todos sus registros asociados en Supabase o memoria.',
  })
  @ApiParam({ name: 'courseId', description: 'ID único del curso' })
  @ApiResponse({ status: 200, description: 'Curso eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado.' })
  async deleteCourse(@Param('courseId') courseId: string) {
    return await this.coursesService.deleteCourse(courseId);
  }

  // -------------------------------------------------------------
  // GESTIÓN DE ESTUDIANTES EN EL CURSO
  // -------------------------------------------------------------

  @Post(':courseId/students')
  @ApiOperation({
    summary: 'Inscribir estudiante en un curso',
    description: 'Registra un nuevo alumno al curso indicado por su ID.',
  })
  @ApiParam({ name: 'courseId', description: 'ID único del curso' })
  @ApiResponse({ status: 201, description: 'Estudiante inscrito exitosamente.' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado.' })
  @ApiResponse({ status: 409, description: 'El estudiante ya está inscrito (código o email repetido).' })
  async registerStudent(
    @Param('courseId') courseId: string,
    @Body() dto: RegisterStudentDto,
  ) {
    return await this.coursesService.registerStudent(courseId, dto);
  }

  @Get(':courseId/students')
  @ApiOperation({
    summary: 'Listar estudiantes de un curso',
    description: 'Retorna los alumnos de un curso con su promedio ponderado actual y estado de aprobación.',
  })
  @ApiParam({ name: 'courseId', description: 'ID único del curso' })
  @ApiResponse({ status: 200, description: 'Lista de estudiantes obtenida.' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado.' })
  async getStudentsByCourse(@Param('courseId') courseId: string) {
    return await this.coursesService.getStudentsByCourse(courseId);
  }

  @Get(':courseId/students/:studentId')
  @ApiOperation({
    summary: 'Obtener un estudiante por ID dentro de un curso',
  })
  @ApiParam({ name: 'courseId', description: 'ID único del curso' })
  @ApiParam({ name: 'studentId', description: 'ID único del estudiante' })
  async getStudentById(
    @Param('courseId') courseId: string,
    @Param('studentId') studentId: string,
  ) {
    return await this.coursesService.getStudentById(courseId, studentId);
  }

  // -------------------------------------------------------------
  // REGISTRO Y GESTIÓN DE NOTAS
  // -------------------------------------------------------------

  @Post(':courseId/students/:studentId/grades')
  @ApiOperation({
    summary: 'Registrar nota a un estudiante',
    description:
      'Registra una calificación con su concepto, puntaje y porcentaje (ej. Parcial 1: 4.5 con 30%). Valida que la suma de porcentajes no exceda el 100%.',
  })
  @ApiParam({ name: 'courseId', description: 'ID único del curso' })
  @ApiParam({ name: 'studentId', description: 'ID único del estudiante' })
  @ApiResponse({ status: 201, description: 'Nota registrada con éxito.' })
  @ApiResponse({ status: 400, description: 'Nota inválida o el porcentaje acumulado excede el 100%.' })
  @ApiResponse({ status: 404, description: 'Curso o estudiante no encontrado.' })
  async addGrade(
    @Param('courseId') courseId: string,
    @Param('studentId') studentId: string,
    @Body() dto: CreateGradeDto,
  ) {
    return await this.coursesService.addGrade(courseId, studentId, dto);
  }

  @Get(':courseId/students/:studentId/grades')
  @ApiOperation({
    summary: 'Consultar notas y promedio de un estudiante',
    description:
      'Obtiene el desglose de todas las notas del alumno, porcentaje evaluado hasta la fecha, promedio ponderado y estado académico.',
  })
  @ApiParam({ name: 'courseId', description: 'ID único del curso' })
  @ApiParam({ name: 'studentId', description: 'ID único del estudiante' })
  @ApiResponse({ status: 200, description: 'Notas obtenidas con éxito.' })
  @ApiResponse({ status: 404, description: 'Curso o estudiante no encontrado.' })
  async getStudentGrades(
    @Param('courseId') courseId: string,
    @Param('studentId') studentId: string,
  ) {
    return await this.coursesService.getStudentGrades(courseId, studentId);
  }

  @Patch(':courseId/students/:studentId/grades/:gradeId')
  @ApiOperation({
    summary: 'Actualizar una nota existente',
    description: 'Modifica la nota, porcentaje o comentario de una calificación previa.',
  })
  @ApiParam({ name: 'courseId', description: 'ID del curso' })
  @ApiParam({ name: 'studentId', description: 'ID del estudiante' })
  @ApiParam({ name: 'gradeId', description: 'ID de la nota' })
  @ApiResponse({ status: 200, description: 'Nota actualizada.' })
  @ApiResponse({ status: 400, description: 'Datos o porcentajes inválidos.' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado.' })
  async updateGrade(
    @Param('courseId') courseId: string,
    @Param('studentId') studentId: string,
    @Param('gradeId') gradeId: string,
    @Body() dto: UpdateGradeDto,
  ) {
    return await this.coursesService.updateGrade(courseId, studentId, gradeId, dto);
  }

  @Delete(':courseId/students/:studentId/grades/:gradeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar una nota',
    description: 'Remueve una calificación del historial del estudiante.',
  })
  @ApiParam({ name: 'courseId', description: 'ID del curso' })
  @ApiParam({ name: 'studentId', description: 'ID del estudiante' })
  @ApiParam({ name: 'gradeId', description: 'ID de la nota' })
  @ApiResponse({ status: 200, description: 'Nota eliminada.' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado.' })
  async deleteGrade(
    @Param('courseId') courseId: string,
    @Param('studentId') studentId: string,
    @Param('gradeId') gradeId: string,
  ) {
    return await this.coursesService.deleteGrade(courseId, studentId, gradeId);
  }

  // -------------------------------------------------------------
  // REPORTE ESTADÍSTICO DEL CURSO
  // -------------------------------------------------------------

  @Get(':courseId/report')
  @ApiOperation({
    summary: 'Obtener reporte estadístico y analítico del curso',
    description:
      'Genera métricas consolidadas: promedio del salón, cantidad de aprobados, reprobados, mejor y peor estudiante.',
  })
  @ApiParam({ name: 'courseId', description: 'ID único del curso' })
  @ApiResponse({ status: 200, description: 'Reporte generado satisfactoriamente.' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado.' })
  async getCourseReport(@Param('courseId') courseId: string) {
    return await this.coursesService.getCourseReport(courseId);
  }
}
