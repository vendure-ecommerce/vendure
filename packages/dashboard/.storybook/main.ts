import type { StorybookConfig } from '@storybook/react-vite';

import { dirname, resolve } from 'path';

import { vendureDashboardPlugin } from '@vendure/dashboard/vite';
import { fileURLToPath, pathToFileURL } from 'url';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
    return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@chromatic-com/storybook',
        '@storybook/addon-docs',
        '@storybook/addon-a11y',
        '@storybook/addon-vitest',
    ],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    core: {
        builder: '@storybook/builder-vite',
    },
    async viteFinal(config) {
        const vendureConfigPath = pathToFileURL(resolve(__dirname, '../sample-vendure-config.ts'));

        return {
            ...config,
            plugins: [
                ...(config.plugins ?? []),
                vendureDashboardPlugin({
                    vendureConfigPath,
                    api: {
                        host: 'https://demo.vendure.io',
                        port: 443,
                    },
                    gqlOutputPath: resolve(__dirname, '../src/lib/graphql/'),
                    tempCompilationDir: resolve(__dirname, '../.temp'),
                    disableTansStackRouterPlugin: true,
                }),
            ],
        };
    },
};
export default config;
