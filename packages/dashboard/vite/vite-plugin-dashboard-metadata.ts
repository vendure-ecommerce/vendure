import { VendureConfig } from '@vendure/core';
import { getPluginDashboardExtensions } from '@vendure/core';
import { Plugin } from 'vite';

const virtualModuleId = 'virtual:dashboard-extensions';
const resolvedVirtualModuleId = `\0${virtualModuleId}`;

export async function dashboardMetadataPlugin(options: { config: VendureConfig }): Promise<Plugin> {
    return {
        name: 'vendure-admin-api-schema',
        resolveId(id, importer) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId;
            }
        },
        load(id) {
            if (id === resolvedVirtualModuleId) {
                const extensions = getPluginDashboardExtensions(options.config.plugins ?? []);
                console.log(`dashboardMetadataPlugin: ${JSON.stringify(extensions)}`);
                return `
                    export const dashboardExtensions = ${JSON.stringify(extensions)};
                `;
            }
        },
    };
}
