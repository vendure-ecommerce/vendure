import { DashboardWidgetDefinition } from './types.js';
import { globalRegistry } from '../registry/global-registry.js';

globalRegistry.register('dashboardWidgetRegistry', new Map<string, DashboardWidgetDefinition>());

export function registerDashboardWidget(widget: DashboardWidgetDefinition) {
    globalRegistry.set('dashboardWidgetRegistry', map => {
        map.set(widget.id, widget);
        return map;
    });
}

export function getDashboardWidgetRegistry() {
    return globalRegistry.get('dashboardWidgetRegistry');
}

export function getDashboardWidget(id: string) {
    return globalRegistry.get('dashboardWidgetRegistry').get(id);
}
