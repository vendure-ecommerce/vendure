/// <reference types="vitest" />

import * as path from 'path';
import angular from '@analogjs/vite-plugin-angular';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    return {
        root: __dirname,
        cacheDir: path.resolve(__dirname, '../../node_modules/.vite'),
        plugins: [
            angular(),
            tsconfigPaths({
                root: '.',
            }),
        ],
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: ['src/test-setup.ts'],
            include: ['**/*.spec.ts'],
            reporters: ['verbose'],
            passWithNoTests: false,
            watch: false,
            server: {
                deps: {
                    inline: [/fesm2022/, 'ngx-pagination'],
                },
            },
        },
        define: {
            'import.meta.vitest': mode !== 'production',
        },
    };
});
