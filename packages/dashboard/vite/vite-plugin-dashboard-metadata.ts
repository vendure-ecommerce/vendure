import { VendureConfig } from '@vendure/core';
import { DocumentNode } from 'graphql/index.js';
import { Plugin } from 'vite';

const virtualModuleId = 'virtual:dashboard-extensions';
const resolvedVirtualModuleId = `\0${virtualModuleId}`;

export interface DashboardBaseRouteDefinition {
    id: string;
    title?: string;
}

export interface DashboardListRouteDefinition extends DashboardBaseRouteDefinition {
    listQuery: DocumentNode;
}

export type DashboardRouteDefinition = DashboardListRouteDefinition;

export interface DashboardExtension {
    routes: DashboardRouteDefinition[];
}

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
                return `

                `;
            }
        },
    };
}
