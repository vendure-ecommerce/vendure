import { vendureDashboardPlugin } from '@vendure/dashboard/plugin';
import path from 'path';
import { pathToFileURL } from 'url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        root: path.resolve(__dirname, '../dashboard'),
    },
    plugins: [vendureDashboardPlugin({ vendureConfigPath: pathToFileURL('./dev-config.ts') }) as any],
});
