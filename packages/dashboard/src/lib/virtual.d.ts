declare module 'virtual:admin-api-schema' {
    import { SchemaInfo } from '../../vite/vite-plugin-admin-api-schema.js';
    export const schemaInfo: SchemaInfo;
}
declare module 'virtual:dashboard-extensions' {
    export const runDashboardExtensions: () => Promise<void>;
}

declare module 'virtual:vendure-ui-config' {
    import { UiConfigPluginOptions } from '../../vite/vite-plugin-ui-config.js';
    export const uiConfig: UiConfigPluginOptions;
}
