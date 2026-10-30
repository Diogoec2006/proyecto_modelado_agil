var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SupabaseService } from './supabase.service.js';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
let SupabaseController = class SupabaseController {
    supabaseService;
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async getStatus() {
        return await this.supabaseService.testConnection();
    }
    async testConnection() {
        return await this.supabaseService.testConnection();
    }
    getSchema() {
        const schemaPath = join(process.cwd(), 'supabase-schema.sql');
        let sqlContent = '';
        if (existsSync(schemaPath)) {
            sqlContent = readFileSync(schemaPath, 'utf-8');
        }
        return {
            filename: 'supabase-schema.sql',
            sql: sqlContent,
        };
    }
};
__decorate([
    Get('status'),
    ApiOperation({
        summary: 'Estado de la conexión a Supabase',
        description: 'Verifica si el backend está enlazado a la base de datos de Supabase o funcionando en modo memoria local.',
    }),
    ApiResponse({ status: 200, description: 'Estado obtenido exitosamente.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SupabaseController.prototype, "getStatus", null);
__decorate([
    Post('test'),
    ApiOperation({
        summary: 'Probar conexión a Supabase',
        description: 'Ejecuta una consulta de prueba a las tablas de Supabase.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SupabaseController.prototype, "testConnection", null);
__decorate([
    Get('schema'),
    ApiOperation({
        summary: 'Obtener script SQL para Supabase',
        description: 'Devuelve el código SQL necesario para crear las tablas de cursos, alumnos y notas en Supabase.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SupabaseController.prototype, "getSchema", null);
SupabaseController = __decorate([
    ApiTags('Supabase Database'),
    Controller('api/supabase'),
    __metadata("design:paramtypes", [SupabaseService])
], SupabaseController);
export { SupabaseController };
//# sourceMappingURL=supabase.controller.js.map