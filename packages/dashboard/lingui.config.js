import { defineConfig } from '@lingui/cli';

export default defineConfig({
    sourceLocale: 'en',
    locales: [
        'he',
        'ar',
        'de',
        'en',
        'es',
        'pl',
        'zh_Hans',
        'zh_Hant',
        'pt_BR',
        'pt_PT',
        'cs',
        'fr',
        'ru',
        'uk',
        'it',
        'fa',
        'ne',
        'hr',
        'nb',
        'sv',
        'tr',
        'ja',
        'bg',
        'nl'
    ],
    catalogs: [
        {
            path: '<rootDir>/src/i18n/locales/{locale}',
            include: ['<rootDir>/src'],
            exclude: ['<rootDir>/src/**/*.stories.tsx'],
        },
    ],
});
