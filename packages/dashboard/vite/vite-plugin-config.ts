import path from 'path';
import { Plugin, UserConfig } from 'vite';

export function viteConfigPlugin({ packageRoot }: { packageRoot: string }): Plugin {
    return {
        name: 'vendure:vite-config-plugin',
        config: (config: UserConfig) => {
            config.root = packageRoot;
            config.resolve = {
                alias: {
                    ...(config.resolve?.alias ?? {}),
                    '@': path.resolve(packageRoot, './src/lib'),
                },
            };
            // This is required to prevent Vite from pre-bundling the
            // dashboard source when it resides in node_modules.
            config.optimizeDeps = {
                ...config.optimizeDeps,
                exclude: [
                    ...(config.optimizeDeps?.exclude || []),
                    '@vendure/dashboard',
                    '@/providers',
                    '@/framework',
                    '@/lib',
                    '@/components',
                    '@/hooks',
                    'virtual:vendure-ui-config',
                    'virtual:admin-api-schema',
                    'virtual:dashboard-extensions',
                ],
                // We however do want to pre-bundle recharts, as it depends
                // on lodash which is a CJS packages and _does_ require
                // pre-bundling.
                include: [
                    ...(config.optimizeDeps?.include || []),
                    '@/components > recharts',
                    '@/components > react-dropzone',
                ],
            };
            return config;
        },
    };
}
