import { SupabaseService } from './supabase.service.js';
export declare class SupabaseController {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    getStatus(): Promise<{
        connected: boolean;
        mode: "supabase" | "in-memory";
        message: string;
        url: string | null;
        tablesFound?: string[];
        error?: string;
    }>;
    testConnection(): Promise<{
        connected: boolean;
        mode: "supabase" | "in-memory";
        message: string;
        url: string | null;
        tablesFound?: string[];
        error?: string;
    }>;
    getSchema(): {
        filename: string;
        sql: string;
    };
}
