import { vendureDashboardPlugin } from '@vendure/dashboard/plugin';
import { pathToFileURL } from 'url';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [vendureDashboardPlugin({ vendureConfigPath: pathToFileURL('./dev-config.ts') })],
});
