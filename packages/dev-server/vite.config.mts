import { vendureDashboardPlugin } from '@vendure/dashboard/plugin';
import { pathToFileURL } from 'url';
import { defineConfig, UserConfig } from 'vite';

export default defineConfig(async () => {
    // TODO: hide this ugly stuff internally so we just need to pass a relative path to the plugin
    const vendureConfigPath = pathToFileURL('./dev-config.ts').href.replace(/^file:[\//]+/, '');

    return {
        plugins: [vendureDashboardPlugin({ vendureConfigPath })],
    } satisfies UserConfig;
});
