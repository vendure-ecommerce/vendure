import { vendureDashboardPlugin } from './vite/vite-plugin-vendure-dashboard.js';
import path from 'path';
import { pathToFileURL } from 'url';
import { defineConfig } from 'vitest/config';

process.env.IS_LOCAL_DEV = 'true';

const adminApiHost = process.env.ADMIN_API_HOST || 'http://localhost';
const adminApiPort = process.env.ADMIN_API_PORT ? +process.env.ADMIN_API_PORT : 'auto';

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
