var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SupabaseService_1;
import { Injectable, Logger } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
let SupabaseService = SupabaseService_1 = class SupabaseService {
    logger = new Logger(SupabaseService_1.name);
    client = null;
    supabaseUrl;
    supabaseKey;
    constructor() {
        this.supabaseUrl = process.env.SUPABASE_URL?.trim();
        this.supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY)?.trim();
        if (this.isValidConfig(this.supabaseUrl, this.supabaseKey)) {
            try {
                this.client = createClient(this.supabaseUrl, this.supabaseKey, {
                    auth: {
                        persistSession: false,
                        autoRefreshToken: false,
                    },
                });
                this.logger.log(`Cliente de Supabase inicializado para: ${this.supabaseUrl}`);
            }
            catch (err) {
                this.logger.error(`Error al inicializar cliente de Supabase: ${err.message}`);
                this.client = null;
            }
        }
        else {
            this.logger.warn('Variables SUPABASE_URL y SUPABASE_KEY no configuradas en .env. El sistema funcionará en modo memoria local.');
        }
    }
    isValidConfig(url, key) {
        if (!url || !key)
            return false;
        if (url.includes('tu-proyecto') || key.includes('tu-anon-key'))
            return false;
        return url.startsWith('http://') || url.startsWith('https://');
    }
    isConfigured() {
        return this.client !== null;
    }
    getClient() {
        return this.client;
    }
    getSupabaseUrl() {
        return this.supabaseUrl ?? null;
    }
    async testConnection() {
        if (!this.client || !this.supabaseUrl) {
            return {
                connected: false,
                mode: 'in-memory',
                message: 'Supabase no está configurado en las variables de entorno (.env). La API opera en memoria local de respaldo.',
                url: null,
            };
        }
        try {
            const { error } = await this.client
                .from('courses')
                .select('id, code')
                .limit(1);
            if (error) {
                this.logger.warn(`Prueba de conexión a Supabase falló: ${error.message}`);
                return {
                    connected: false,
                    mode: 'in-memory',
                    message: `Error al consultar la tabla 'courses' en Supabase: ${error.message}. Por favor ejecuta el script 'supabase-schema.sql' en el SQL Editor de tu proyecto Supabase.`,
                    url: this.supabaseUrl,
                    error: error.message,
                };
            }
            return {
                connected: true,
                mode: 'supabase',
                message: '¡Conexión exitosa a la base de datos en Supabase!',
                url: this.supabaseUrl,
                tablesFound: ['courses', 'students', 'grades'],
            };
        }
        catch (err) {
            return {
                connected: false,
                mode: 'in-memory',
                message: `Excepción al conectar con Supabase: ${err.message}`,
                url: this.supabaseUrl,
                error: err.message,
            };
        }
    }
};
SupabaseService = SupabaseService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], SupabaseService);
export { SupabaseService };
//# sourceMappingURL=supabase.service.js.map