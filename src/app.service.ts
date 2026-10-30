import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiInfo() {
    return {
      name: 'API de Registro de Notas y Cursos',
      version: '1.0.0',
      description:
        'Sistema en NestJS para crear cursos, inscribir estudiantes y registrar calificaciones con cálculo ponderado y base de datos Supabase.',
      theme: 'Azul y Plomo (Blue & Lead Slate)',
      dashboard: '/dashboard',
      documentation: '/api/docs',
      status: 'online',
      database: {
        provider: 'Supabase (PostgreSQL)',
        statusEndpoint: '/api/supabase/status',
        schemaEndpoint: '/api/supabase/schema',
      },
      endpoints: [
        { method: 'GET', path: '/courses', description: 'Listar cursos' },
        { method: 'POST', path: '/courses', description: 'Crear un curso' },
        { method: 'GET', path: '/courses/:id', description: 'Detalle del curso' },
        { method: 'POST', path: '/courses/:id/students', description: 'Inscribir estudiante' },
        { method: 'POST', path: '/courses/:id/students/:studentId/grades', description: 'Registrar nota' },
        { method: 'GET', path: '/courses/:id/students/:studentId/grades', description: 'Consultar notas y promedio' },
        { method: 'GET', path: '/courses/:id/report', description: 'Reporte del curso' },
        { method: 'GET', path: '/api/supabase/status', description: 'Estado de conexión con Supabase' },
        { method: 'GET', path: '/api/supabase/schema', description: 'Esquema SQL para Supabase' },
      ],
    };
  }
}
