import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [
        // SWC required to support decorators used in test plugins
        swc.vite({
            jsc: {
                transform: {
                    useDefineForClassFields: false,
                },
            },
        }) as any,
    ],
    test: {
        include: ['e2e/**/*.e2e-spec.ts'],
        globals: true,
        environment: 'node',
        testTimeout: 30000,
        pool: 'forks',
        poolOptions: {
            forks: {
                singleFork: true,
            },
        },
    },
});