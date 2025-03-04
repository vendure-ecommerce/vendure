import { lingui } from '@lingui/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

import { adminApiSchemaPlugin } from './vite/vite-plugin-admin-api-schema.js';

// https://vite.dev/config/
export default defineConfig(async () => {
    const vendureConfig = await import('../dev-server/dev-config.js').then(m => m.devConfig);
    return {
        plugins: [
            TanStackRouterVite({ autoCodeSplitting: true }),
            react({
                babel: {
                    plugins: ['@lingui/babel-plugin-lingui-macro'],
                },
            }),
            lingui(),
            tailwindcss(),
            adminApiSchemaPlugin({ config: vendureConfig }),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
    };
});
