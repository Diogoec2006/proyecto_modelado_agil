import { Controller, Get, Res, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { AppService } from './app.service.js';

@ApiTags('General')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Información general de la API' })
  @ApiResponse({ status: 200, description: 'Estado y endpoints de la API.' })
  getApiInfo(@Req() req?: Request, @Res() res?: Response) {
    if (res && req) {
      const acceptHeader = req.headers?.accept || '';
      if (acceptHeader.startsWith('text/html')) {
        return res.redirect('/dashboard');
      }
      return res.json(this.appService.getApiInfo());
    }
    return this.appService.getApiInfo();
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Panel de Control Web (Tema Azul y Plomo)' })
  @ApiResponse({ status: 200, description: 'Interfaz gráfica de usuario.' })
  getDashboard(@Res() res: Response) {
    const indexPath = join(process.cwd(), 'public', 'index.html');
    if (existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    return res.send(`
      <html>
        <body style="font-family:sans-serif; text-align:center; padding:50px; background:#f1f5f9; color:#1e293b;">
          <h2>Dashboard en Construcción</h2>
          <p><a href="/api/docs" style="color:#2563eb;">Ver Documentación Swagger</a></p>
        </body>
      </html>
    `);
  }
}
