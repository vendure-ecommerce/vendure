import { DashboardListRouteDefinition } from '@/framework/internal/extension-api/extension-api-types.js';

export const listViewExtensionRoutes = new Map<string, DashboardListRouteDefinition>();

export function registerListView(config: DashboardListRouteDefinition) {
    if (config.path) {
        listViewExtensionRoutes.set(config.path, config);
    }
}
