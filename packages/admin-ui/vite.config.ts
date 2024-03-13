/// <reference types="vitest" />

import * as path from 'path';
import angular from '@analogjs/vite-plugin-angular';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    return {
        root: __dirname,
        plugins: [
            angular(),
            tsconfigPaths({
                // projects: [path.resolve(__dirname, 'tsconfig.spec.json')],
                root: '.',
            }),
        ],
        test: {
            // alias: {
            //     '@vendure/admin-ui/core': path.resolve(__dirname, './src/lib/core/src/public_api.ts'),
            // },
            globals: true,
            environment: 'jsdom',
            setupFiles: ['src/test-setup.ts'],
            include: ['**/localization.service.spec.ts'],
            reporters: ['verbose'],
            passWithNoTests: false,
            watch: false,
        },
        define: {
            'import.meta.vitest': mode !== 'production',
        },
    };
});
