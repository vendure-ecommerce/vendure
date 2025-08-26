export {};

// Here we declare the members of the process.env object, so that we
// can use them in our application code in a type-safe manner.
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            APP_ENV: string;
            PORT: string;
            COOKIE_SECRET: string;
            SUPERADMIN_USERNAME: string;
            SUPERADMIN_PASSWORD: string;
            DB_HOST: string;
            DB_PORT: number;
            DB_NAME: string;
            DB_USERNAME: string;
            DB_PASSWORD: string;
            DB_SCHEMA: string;
        }
    }
}
