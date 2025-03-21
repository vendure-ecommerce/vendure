import { defineConfig } from 'vitest/config';
import { vendureDashboardPlugin } from './dist/plugin/index.js';
import { pathToFileURL } from 'url';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
    },
    plugins: [
        vendureDashboardPlugin({
            vendureConfigPath: pathToFileURL('../dev-server/dev-config.ts'),
        }) as any,
    ],
});
