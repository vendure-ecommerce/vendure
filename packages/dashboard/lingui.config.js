import { defineConfig } from '@lingui/cli';

export default defineConfig({
    sourceLocale: 'en',
    locales: ['de', 'en'],
    catalogs: [
        {
            path: '<rootDir>/src/i18n/locales/{locale}',
            include: ['<rootDir>'],
        },
    ],
});
