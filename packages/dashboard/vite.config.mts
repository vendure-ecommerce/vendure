import path from 'path';
import { pathToFileURL } from 'url';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import { vendureDashboardPlugin } from './vite/vite-plugin-vendure-dashboard.js';

/**
 * This config is used for local development
 */
export default ({ mode }: { mode: string }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    const adminApiHost = process.env.VITE_ADMIN_API_HOST ?? 'http://localhost:3000';
    const adminApiPort = process.env.VITE_ADMIN_API_PORT ? +process.env.VITE_ADMIN_API_PORT : 'auto';

    process.env.IS_LOCAL_DEV = adminApiHost.includes('localhost') ? 'true' : 'false';

    const vendureConfigPath = process.env.VITEST
        ? // This should always be used for running the tests
          './sample-vendure-config.ts'
        : // This one might be changed to '../dev-server/dev-config.ts' to test ui extensions
          './sample-vendure-config.ts';

    return defineConfig({
        test: {
            globals: true,
            environment: 'jsdom',
            exclude: ['./plugin/**/*', '**/node_modules/**/*'],
        },
        plugins: [
            vendureDashboardPlugin({
                vendureConfigPath: pathToFileURL(vendureConfigPath),
                adminUiConfig: { apiHost: adminApiHost, apiPort: adminApiPort },
                gqlOutputPath: path.resolve(__dirname, './src/lib/graphql/'),
                tempCompilationDir: path.resolve(__dirname, './.temp'),
            }) as any,
        ],
    });
};
