import type { Request, Response } from 'express';
import { AppService } from './app.service.js';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getApiInfo(req?: Request, res?: Response): void | Response<any, Record<string, any>> | {
        name: string;
        version: string;
        description: string;
        theme: string;
        dashboard: string;
        documentation: string;
        status: string;
        database: {
            provider: string;
            statusEndpoint: string;
            schemaEndpoint: string;
        };
        endpoints: {
            method: string;
            path: string;
            description: string;
        }[];
    };
    getDashboard(res: Response): void | Response<any, Record<string, any>>;
}
