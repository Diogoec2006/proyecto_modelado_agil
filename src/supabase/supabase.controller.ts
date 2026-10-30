import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SupabaseService } from './supabase.service.js';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

@ApiTags('Supabase Database')
@Controller('api/supabase')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get('status')
  @ApiOperation({
    summary: 'Estado de la conexión a Supabase',
    description:
      'Verifica si el backend está enlazado a la base de datos de Supabase o funcionando en modo memoria local.',
  })
  @ApiResponse({ status: 200, description: 'Estado obtenido exitosamente.' })
  async getStatus() {
    return await this.supabaseService.testConnection();
  }

  @Post('test')
  @ApiOperation({
    summary: 'Probar conexión a Supabase',
    description: 'Ejecuta una consulta de prueba a las tablas de Supabase.',
  })
  async testConnection() {
    return await this.supabaseService.testConnection();
  }

  @Get('schema')
  @ApiOperation({
    summary: 'Obtener script SQL para Supabase',
    description:
      'Devuelve el código SQL necesario para crear las tablas de cursos, alumnos y notas en Supabase.',
  })
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
}

