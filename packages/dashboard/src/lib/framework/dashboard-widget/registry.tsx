import { DashboardWidgetDefinition } from './types.js';

const dashboardWidgetRegistry = new Map<string, DashboardWidgetDefinition>();

export function registerDashboardWidget(widget: DashboardWidgetDefinition) {
    dashboardWidgetRegistry.set(widget.id, widget);
}

export function getDashboardWidgetRegistry() {
    return dashboardWidgetRegistry;
}

export function getDashboardWidget(id: string) {
    return dashboardWidgetRegistry.get(id);
}
