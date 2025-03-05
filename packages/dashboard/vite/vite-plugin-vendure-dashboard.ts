import { lingui } from '@lingui/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { PluginOption, UserConfig } from 'vite';
import { compileFile, loadVendureConfig } from './config-loader.js';
import { adminApiSchemaPlugin } from './vite-plugin-admin-api-schema.js';
import { dashboardMetadataPlugin } from './vite-plugin-dashboard-metadata.js';

/**
 * @description
 * This is a Vite plugin which configures a set of plugins required to build the Vendure Dashboard.
 */
export async function vendureDashboardPlugin(options: {
    vendureConfigPath: string;
    vendureConfigExport?: string;
}): Promise<PluginOption[]> {
    // const config = await options.loadConfig();
    const config = await loadVendureConfig(options.vendureConfigPath);

    const packageRoot = path
        .join(import.meta.resolve('@vendure/dashboard'), '../..')
        .replace(/file:[\/\\]+/, '');
    const linguiConfigPath = path.join(packageRoot, 'lingui.config.js');

    process.env.LINGUI_CONFIG = linguiConfigPath;
    return [
        lingui({
            configPath: linguiConfigPath,
        }),
        react({
            babel: {
                plugins: ['@lingui/babel-plugin-lingui-macro'],
            },
        }),
        tailwindcss(),
        adminApiSchemaPlugin({ config }),
        dashboardMetadataPlugin({ config }),
        {
            name: 'vendure-set-root-plugin',
            config: (config: UserConfig) => {
                console.log(`Setting root to ${packageRoot}`);
                config.root = packageRoot;
                config.resolve = {
                    alias: {
                        '@': path.resolve(packageRoot, './src'),
                    },
                };
                return config;
            },
        },
    ];
}
