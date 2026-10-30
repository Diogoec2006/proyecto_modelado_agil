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
import { Controller, Get, Res, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { AppService } from './app.service.js';
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getApiInfo(req, res) {
        if (res && req) {
            const acceptHeader = req.headers?.accept || '';
            if (acceptHeader.startsWith('text/html')) {
                return res.redirect('/dashboard');
            }
            return res.json(this.appService.getApiInfo());
        }
        return this.appService.getApiInfo();
    }
    getDashboard(res) {
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
};
__decorate([
    Get(),
    ApiOperation({ summary: 'Información general de la API' }),
    ApiResponse({ status: 200, description: 'Estado y endpoints de la API.' }),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getApiInfo", null);
__decorate([
    Get('dashboard'),
    ApiOperation({ summary: 'Panel de Control Web (Tema Azul y Plomo)' }),
    ApiResponse({ status: 200, description: 'Interfaz gráfica de usuario.' }),
    __param(0, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getDashboard", null);
AppController = __decorate([
    ApiTags('General'),
    Controller(),
    __metadata("design:paramtypes", [AppService])
], AppController);
export { AppController };
//# sourceMappingURL=app.controller.js.map