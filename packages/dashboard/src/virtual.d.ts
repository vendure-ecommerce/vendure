declare module 'virtual:admin-api-schema' {
    import { SchemaInfo } from '../vite/vite-plugin-admin-api-schema.js';
    export const schemaInfo: SchemaInfo;
}
declare module 'virtual:dashboard-extensions' {
    export const runDashboardExtensions: () => Promise<void>;
}
