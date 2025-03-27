import { vendureDashboardPlugin } from './vite/vite-plugin-vendure-dashboard.js';
import path from 'path';
import { pathToFileURL } from 'url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
    },
    plugins: [
        vendureDashboardPlugin({
            vendureConfigPath: pathToFileURL('./sample-vendure-config.ts'),
            adminUiConfig: { apiHost: 'http://localhost', apiPort: 3000 },
            // gqlTadaOutputPath: path.resolve(__dirname, './graphql/'),
            tempCompilationDir: path.resolve(__dirname, './.temp'),
        }) as any,
    ],
});
