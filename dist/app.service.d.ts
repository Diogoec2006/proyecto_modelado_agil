export declare class AppService {
    getApiInfo(): {
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
}
