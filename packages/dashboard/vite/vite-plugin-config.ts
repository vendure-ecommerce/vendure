import path from 'path';
import { ConfigEnv, Plugin, UserConfig } from 'vite';

export function viteConfigPlugin({ packageRoot }: { packageRoot: string }): Plugin {
    return {
        name: 'vendure:vite-config-plugin',
        config: (config: UserConfig, env: ConfigEnv) => {
            // Only set the vite `root` to the dashboard package when running the dev server.
            // During a production build we still need to reference the dashboard source which
            // lives in `node_modules`, but we don't want the build output to be emitted in there.
            // Therefore we set `root` only for `serve` and, for `build`, we instead make sure that
            // an `outDir` **outside** of `node_modules` is used (defaulting to the current working
            // directory if the user did not provide one already).
            config.root = packageRoot;

            // If we are building and no explicit outDir has been provided (or it is a relative path),
            // set it to an **absolute** path relative to the cwd so that the output never ends up in
            // `node_modules`.
            if (env.command === 'build') {
                const buildConfig = config.build ?? {};

                const hasOutDir = typeof buildConfig.outDir === 'string' && buildConfig.outDir.length > 0;
                const outDirIsAbsolute = hasOutDir && path.isAbsolute(buildConfig.outDir as string);

                const normalizedOutDir = hasOutDir
                    ? outDirIsAbsolute
                        ? (buildConfig.outDir as string)
                        : path.resolve(process.cwd(), buildConfig.outDir as string)
                    : path.resolve(process.cwd(), 'dist/vendure-dashboard');

                config.build = {
                    ...buildConfig,
                    outDir: normalizedOutDir,
                };
            }

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
