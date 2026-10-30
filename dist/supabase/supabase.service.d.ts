import { SupabaseClient } from '@supabase/supabase-js';
import 'dotenv/config';
export declare class SupabaseService {
    private readonly logger;
    private client;
    private readonly supabaseUrl;
    private readonly supabaseKey;
    constructor();
    private isValidConfig;
    isConfigured(): boolean;
    getClient(): SupabaseClient | null;
    getSupabaseUrl(): string | null;
    testConnection(): Promise<{
        connected: boolean;
        mode: 'supabase' | 'in-memory';
        message: string;
        url: string | null;
        tablesFound?: string[];
        error?: string;
    }>;
}
