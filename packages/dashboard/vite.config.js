import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import babel from 'vite-plugin-babel';
import { lingui } from '@lingui/vite-plugin';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        TanStackRouterVite({ autoCodeSplitting: true }),
        react({
            babel: {
                plugins: ['@lingui/babel-plugin-lingui-macro'],
            },
        }),
        lingui(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
