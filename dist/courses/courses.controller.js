var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { RegisterStudentDto } from './dto/register-student.dto.js';
import { CreateGradeDto } from './dto/create-grade.dto.js';
import { UpdateGradeDto } from './dto/update-grade.dto.js';
let CoursesController = class CoursesController {
    coursesService;
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    async createCourse(dto) {
        return await this.coursesService.createCourse(dto);
    }
    async findAllCourses() {
        return await this.coursesService.findAllCourses();
    }
    async findCourseById(courseId) {
        return await this.coursesService.findCourseById(courseId);
    }
    async updateCourse(courseId, dto) {
        return await this.coursesService.updateCourse(courseId, dto);
    }
    async deleteCourse(courseId) {
        return await this.coursesService.deleteCourse(courseId);
    }
    async registerStudent(courseId, dto) {
        return await this.coursesService.registerStudent(courseId, dto);
    }
    async getStudentsByCourse(courseId) {
        return await this.coursesService.getStudentsByCourse(courseId);
    }
    async getStudentById(courseId, studentId) {
        return await this.coursesService.getStudentById(courseId, studentId);
    }
    async addGrade(courseId, studentId, dto) {
        return await this.coursesService.addGrade(courseId, studentId, dto);
    }
    async getStudentGrades(courseId, studentId) {
        return await this.coursesService.getStudentGrades(courseId, studentId);
    }
    async updateGrade(courseId, studentId, gradeId, dto) {
        return await this.coursesService.updateGrade(courseId, studentId, gradeId, dto);
    }
    async deleteGrade(courseId, studentId, gradeId) {
        return await this.coursesService.deleteGrade(courseId, studentId, gradeId);
    }
    async getCourseReport(courseId) {
        return await this.coursesService.getCourseReport(courseId);
    }
};
__decorate([
    Post(),
    ApiOperation({
        summary: 'Crear un nuevo curso',
        description: 'Registra un curso nuevo con su código, nombre, docente y escala de calificación.',
    }),
    ApiResponse({ status: 201, description: 'Curso creado con éxito.' }),
    ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' }),
    ApiResponse({ status: 409, description: 'Ya existe un curso con ese código.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCourseDto]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "createCourse", null);
__decorate([
    Get(),
    ApiOperation({
        summary: 'Listar todos los cursos',
        description: 'Devuelve la lista de cursos existentes con total de estudiantes y promedio global.',
    }),
    ApiResponse({ status: 200, description: 'Lista de cursos obtenida correctamente.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "findAllCourses", null);
__decorate([
    Get(':courseId'),
    ApiOperation({
        summary: 'Obtener un curso por ID',
        description: 'Devuelve la información detallada del curso junto con sus estudiantes y notas registradas.',
    }),
    ApiParam({ name: 'courseId', description: 'ID único del curso' }),
    ApiResponse({ status: 200, description: 'Curso encontrado.' }),
    ApiResponse({ status: 404, description: 'Curso no encontrado.' }),
    __param(0, Param('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "findCourseById", null);
__decorate([
    Patch(':courseId'),
    ApiOperation({
        summary: 'Actualizar un curso',
        description: 'Permite modificar nombre, docente, descripción o parámetros de calificación de un curso.',
    }),
    ApiParam({ name: 'courseId', description: 'ID único del curso' }),
    ApiResponse({ status: 200, description: 'Curso actualizado con éxito.' }),
    ApiResponse({ status: 404, description: 'Curso no encontrado.' }),
    __param(0, Param('courseId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateCourseDto]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "updateCourse", null);
__decorate([
    Delete(':courseId'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
        summary: 'Eliminar un curso',
        description: 'Elimina un curso y todos sus registros asociados en Supabase o memoria.',
    }),
    ApiParam({ name: 'courseId', description: 'ID único del curso' }),
    ApiResponse({ status: 200, description: 'Curso eliminado correctamente.' }),
    ApiResponse({ status: 404, description: 'Curso no encontrado.' }),
    __param(0, Param('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "deleteCourse", null);
__decorate([
    Post(':courseId/students'),
    ApiOperation({
        summary: 'Inscribir estudiante en un curso',
        description: 'Registra un nuevo alumno al curso indicado por su ID.',
    }),
    ApiParam({ name: 'courseId', description: 'ID único del curso' }),
    ApiResponse({ status: 201, description: 'Estudiante inscrito exitosamente.' }),
    ApiResponse({ status: 404, description: 'Curso no encontrado.' }),
    ApiResponse({ status: 409, description: 'El estudiante ya está inscrito (código o email repetido).' }),
    __param(0, Param('courseId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, RegisterStudentDto]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "registerStudent", null);
__decorate([
    Get(':courseId/students'),
    ApiOperation({
        summary: 'Listar estudiantes de un curso',
        description: 'Retorna los alumnos de un curso con su promedio ponderado actual y estado de aprobación.',
    }),
    ApiParam({ name: 'courseId', description: 'ID único del curso' }),
    ApiResponse({ status: 200, description: 'Lista de estudiantes obtenida.' }),
    ApiResponse({ status: 404, description: 'Curso no encontrado.' }),
    __param(0, Param('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getStudentsByCourse", null);
__decorate([
    Get(':courseId/students/:studentId'),
    ApiOperation({
        summary: 'Obtener un estudiante por ID dentro de un curso',
    }),
    ApiParam({ name: 'courseId', description: 'ID único del curso' }),
    ApiParam({ name: 'studentId', description: 'ID único del estudiante' }),
    __param(0, Param('courseId')),
    __param(1, Param('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getStudentById", null);
__decorate([
    Post(':courseId/students/:studentId/grades'),
    ApiOperation({
        summary: 'Registrar nota a un estudiante',
        description: 'Registra una calificación con su concepto, puntaje y porcentaje (ej. Parcial 1: 4.5 con 30%). Valida que la suma de porcentajes no exceda el 100%.',
    }),
    ApiParam({ name: 'courseId', description: 'ID único del curso' }),
    ApiParam({ name: 'studentId', description: 'ID único del estudiante' }),
    ApiResponse({ status: 201, description: 'Nota registrada con éxito.' }),
    ApiResponse({ status: 400, description: 'Nota inválida o el porcentaje acumulado excede el 100%.' }),
    ApiResponse({ status: 404, description: 'Curso o estudiante no encontrado.' }),
    __param(0, Param('courseId')),
    __param(1, Param('studentId')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, CreateGradeDto]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "addGrade", null);
__decorate([
    Get(':courseId/students/:studentId/grades'),
    ApiOperation({
        summary: 'Consultar notas y promedio de un estudiante',
        description: 'Obtiene el desglose de todas las notas del alumno, porcentaje evaluado hasta la fecha, promedio ponderado y estado académico.',
    }),
    ApiParam({ name: 'courseId', description: 'ID único del curso' }),
    ApiParam({ name: 'studentId', description: 'ID único del estudiante' }),
    ApiResponse({ status: 200, description: 'Notas obtenidas con éxito.' }),
    ApiResponse({ status: 404, description: 'Curso o estudiante no encontrado.' }),
    __param(0, Param('courseId')),
    __param(1, Param('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getStudentGrades", null);
__decorate([
    Patch(':courseId/students/:studentId/grades/:gradeId'),
    ApiOperation({
        summary: 'Actualizar una nota existente',
        description: 'Modifica la nota, porcentaje o comentario de una calificación previa.',
    }),
    ApiParam({ name: 'courseId', description: 'ID del curso' }),
    ApiParam({ name: 'studentId', description: 'ID del estudiante' }),
    ApiParam({ name: 'gradeId', description: 'ID de la nota' }),
    ApiResponse({ status: 200, description: 'Nota actualizada.' }),
    ApiResponse({ status: 400, description: 'Datos o porcentajes inválidos.' }),
    ApiResponse({ status: 404, description: 'Recurso no encontrado.' }),
    __param(0, Param('courseId')),
    __param(1, Param('studentId')),
    __param(2, Param('gradeId')),
    __param(3, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, UpdateGradeDto]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "updateGrade", null);
__decorate([
    Delete(':courseId/students/:studentId/grades/:gradeId'),
    HttpCode(HttpStatus.OK),
    ApiOperation({
        summary: 'Eliminar una nota',
        description: 'Remueve una calificación del historial del estudiante.',
    }),
    ApiParam({ name: 'courseId', description: 'ID del curso' }),
    ApiParam({ name: 'studentId', description: 'ID del estudiante' }),
    ApiParam({ name: 'gradeId', description: 'ID de la nota' }),
    ApiResponse({ status: 200, description: 'Nota eliminada.' }),
    ApiResponse({ status: 404, description: 'Recurso no encontrado.' }),
    __param(0, Param('courseId')),
    __param(1, Param('studentId')),
    __param(2, Param('gradeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "deleteGrade", null);
__decorate([
    Get(':courseId/report'),
    ApiOperation({
        summary: 'Obtener reporte estadístico y analítico del curso',
        description: 'Genera métricas consolidadas: promedio del salón, cantidad de aprobados, reprobados, mejor y peor estudiante.',
    }),
    ApiParam({ name: 'courseId', description: 'ID único del curso' }),
    ApiResponse({ status: 200, description: 'Reporte generado satisfactoriamente.' }),
    ApiResponse({ status: 404, description: 'Curso no encontrado.' }),
    __param(0, Param('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCourseReport", null);
CoursesController = __decorate([
    ApiTags('Cursos y Registro de Notas'),
    Controller('courses'),
    __metadata("design:paramtypes", [CoursesService])
], CoursesController);
export { CoursesController };
//# sourceMappingURL=courses.controller.js.map