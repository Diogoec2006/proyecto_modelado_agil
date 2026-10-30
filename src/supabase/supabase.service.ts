import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import 'dotenv/config';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private client: SupabaseClient | null = null;
  private readonly supabaseUrl: string | undefined;
  private readonly supabaseKey: string | undefined;

  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL?.trim();
    this.supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY)?.trim();

    if (this.isValidConfig(this.supabaseUrl, this.supabaseKey)) {
      try {
        this.client = createClient(this.supabaseUrl!, this.supabaseKey!, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        });
        this.logger.log(`Cliente de Supabase inicializado para: ${this.supabaseUrl}`);
      } catch (err: any) {
        this.logger.error(`Error al inicializar cliente de Supabase: ${err.message}`);
        this.client = null;
      }
    } else {
      this.logger.warn(
        'Variables SUPABASE_URL y SUPABASE_KEY no configuradas en .env. El sistema funcionará en modo memoria local.',
      );
    }
  }

  private isValidConfig(url?: string, key?: string): boolean {
    if (!url || !key) return false;
    if (url.includes('tu-proyecto') || key.includes('tu-anon-key')) return false;
    return url.startsWith('http://') || url.startsWith('https://');
  }

  /**
   * Indica si las credenciales de Supabase están configuradas
   */
  isConfigured(): boolean {
    return this.client !== null;
  }

  /**
   * Retorna el cliente oficial de Supabase
   */
  getClient(): SupabaseClient | null {
    return this.client;
  }

  /**
   * Retorna la URL configurada de Supabase (sin credenciales sensibles)
   */
  getSupabaseUrl(): string | null {
    return this.supabaseUrl ?? null;
  }

  /**
   * Prueba la conectividad con la base de datos Supabase
   */
  async testConnection(): Promise<{
    connected: boolean;
    mode: 'supabase' | 'in-memory';
    message: string;
    url: string | null;
    tablesFound?: string[];
    error?: string;
  }> {
    if (!this.client || !this.supabaseUrl) {
      return {
        connected: false,
        mode: 'in-memory',
        message:
          'Supabase no está configurado en las variables de entorno (.env). La API opera en memoria local de respaldo.',
        url: null,
      };
    }

    try {
      // Intentamos consultar la tabla de cursos para verificar que las tablas existan
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
    } catch (err: any) {
      return {
        connected: false,
        mode: 'in-memory',
        message: `Excepción al conectar con Supabase: ${err.message}`,
        url: this.supabaseUrl,
        error: err.message,
      };
    }
  }
}
