import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        /**
         * For local debugging of the unit tests, we set a very long timeout value otherwise tests will
         * automatically fail for going over the 5 second default timeout.
         */
        testTimeout: process.env.TEST_DEBUG ? 1800 * 1000 : 5 * 1000,
        // threads: false,
        // singleThread: true,
        // reporters: ['verbose'],
    },
    plugins: [
        // SWC required to support decorators used in test plugins
        // See https://github.com/vitest-dev/vitest/issues/708#issuecomment-1118628479
        // Vite plugin
        swc.vite({
            jsc: {
                transform: {
                    // See https://github.com/vendure-ecommerce/vendure/issues/2099
                    useDefineForClassFields: false,
                },
            },
        }),
    ],
});
