import path from 'path';
import { pathToFileURL } from 'url';
import { defineConfig } from 'vite';

import { vendureDashboardPlugin } from './dist/plugin/index.js';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vendureDashboardPlugin({
            vendureConfigPath: pathToFileURL('../dev-server/dev-config.ts'),
        }),
    ],
});
