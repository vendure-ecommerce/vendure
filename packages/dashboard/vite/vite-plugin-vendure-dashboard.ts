import { lingui } from '@lingui/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import { VendureConfig } from '@vendure/core';
import react from '@vitejs/plugin-react';
import path from 'path';
import { PluginOption, UserConfig } from 'vite';
import { adminApiSchemaPlugin } from './vite-plugin-admin-api-schema.js';
import { dashboardMetadataPlugin } from './vite-plugin-dashboard-metadata.js';

export function vendureDashboardPlugin(config: VendureConfig): PluginOption[] {
    const packageRoot = path
        .join(import.meta.resolve('@vendure/dashboard'), '../../..')
        .replace(/file:[\/\\]+/, '');
    const linguiConfigPath = path.join(packageRoot, 'lingui.config.js');
    console.log(`linguiConfigPath: ${linguiConfigPath}`);

    const tanstackRoutesDirectory = path.join(packageRoot, 'src');

    // (import.meta as any).env?.LINGUI_CONFIG = linguiConfigPath;
    process.env.LINGUI_CONFIG = linguiConfigPath;
    return [
        // TanStackRouterVite({ routesDirectory: tanstackRoutesDirectory }),
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
