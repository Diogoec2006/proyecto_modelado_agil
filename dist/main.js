import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'node:path';
import { AppModule } from './app.module.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useStaticAssets(join(process.cwd(), 'public'));
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new DocumentBuilder()
        .setTitle('API de Registro de Notas y Cursos | Supabase DB')
        .setDescription('Documentación interactiva de la API con enlace a base de datos Supabase (PostgreSQL). ' +
        'Diseñada bajo el sistema de diseño Azul y Plomo (Blue & Lead Slate).')
        .setVersion('1.0.0')
        .addTag('Cursos y Registro de Notas')
        .addTag('Supabase Database')
        .addTag('General')
        .build();
    const customCss = `
    /* Barra superior en Plomo Oscuro con borde Azul */
    .swagger-ui .topbar {
      background-color: #1e293b !important;
      border-bottom: 3px solid #2563eb !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .swagger-ui .topbar a span {
      color: #f8fafc !important;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    /* Encabezados y títulos en Azul y Plomo */
    .swagger-ui .info .title {
      color: #1e3a8a !important;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .swagger-ui .info h2, .swagger-ui .info p {
      color: #334155 !important;
    }
    /* Botones primarios en Azul Rey */
    .swagger-ui .btn.execute {
      background-color: #2563eb !important;
      border-color: #1d4ed8 !important;
      color: #ffffff !important;
      font-weight: 600;
      border-radius: 6px;
    }
    .swagger-ui .btn.execute:hover {
      background-color: #1d4ed8 !important;
    }
    .swagger-ui .btn.authorize {
      border-color: #2563eb !important;
      color: #2563eb !important;
      border-radius: 6px;
    }
    /* Estilo de bloques y métodos */
    .swagger-ui .opblock.opblock-get {
      border-color: #3b82f6 !important;
      background: rgba(59, 130, 246, 0.05) !important;
    }
    .swagger-ui .opblock.opblock-get .opblock-summary-method {
      background: #2563eb !important;
    }
    .swagger-ui .opblock.opblock-post {
      border-color: #0284c7 !important;
      background: rgba(2, 132, 199, 0.05) !important;
    }
    .swagger-ui .opblock.opblock-post .opblock-summary-method {
      background: #0284c7 !important;
    }
    .swagger-ui .opblock.opblock-patch {
      border-color: #64748b !important;
      background: rgba(100, 116, 139, 0.05) !important;
    }
    .swagger-ui .opblock.opblock-patch .opblock-summary-method {
      background: #475569 !important;
    }
    .swagger-ui .opblock.opblock-delete {
      border-color: #475569 !important;
      background: rgba(71, 85, 105, 0.08) !important;
    }
    .swagger-ui .opblock.opblock-delete .opblock-summary-method {
      background: #334155 !important;
    }
    /* Fondo y contenedores en Plomo Pizarra */
    .swagger-ui .scheme-container {
      background-color: #f1f5f9 !important;
      border-bottom: 1px solid #cbd5e1 !important;
      padding: 15px 0;
    }
    .swagger-ui section.models {
      border-color: #cbd5e1 !important;
      border-radius: 8px;
    }
    .swagger-ui section.models h4 {
      color: #1e293b !important;
    }
  `;
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
        customCss,
        customSiteTitle: 'API Registro de Notas | Supabase DB (Azul & Plomo)',
    });
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`\n======================================================`);
    console.log(`🚀 Servidor NestJS iniciado con éxito`);
    console.log(`🌐 Base URL:          http://localhost:${port}`);
    console.log(`🎨 Dashboard Web:     http://localhost:${port}/dashboard  (Tema Azul y Plomo)`);
    console.log(`📚 Swagger (Docs):    http://localhost:${port}/api/docs  (Tema Azul y Plomo)`);
    console.log(`⚡ Supabase Status:   http://localhost:${port}/api/supabase/status`);
    console.log(`======================================================\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map