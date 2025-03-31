import { vendureDashboardPlugin } from './vite/vite-plugin-vendure-dashboard.js';
import path from 'path';
import { pathToFileURL } from 'url';
import { defineConfig } from 'vitest/config';

const adminApiHost = process.env.VITE_ADMIN_API_HOST || 'http://localhost';
const adminApiPort = process.env.VITE_ADMIN_API_PORT ? +process.env.VITE_ADMIN_API_PORT : 'auto';

process.env.IS_LOCAL_DEV = adminApiHost.includes('localhost') ? 'true' : 'false';

console.log('Admin API Connection Info', {
    adminApiHost,
    adminApiPort,
    isLocalDev: process.env.IS_LOCAL_DEV,
});

/**
 * This config is used for local development
 */
export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
    },
    plugins: [
        vendureDashboardPlugin({
            vendureConfigPath: pathToFileURL('./sample-vendure-config.ts'),
            adminUiConfig: { apiHost: adminApiHost, apiPort: adminApiPort },
            // gqlTadaOutputPath: path.resolve(__dirname, './graphql/'),
            tempCompilationDir: path.resolve(__dirname, './.temp'),
        }) as any,
    ],
});
