import { vendureDashboardPlugin } from '@vendure/dashboard/plugin';
import { defineConfig, UserConfig } from 'vite';

export default defineConfig(async () => {
    const vendureConfig = await import('./dev-config.js').then(m => m.devConfig);
    return {
        plugins: [vendureDashboardPlugin(vendureConfig)],
    } satisfies UserConfig;
});
