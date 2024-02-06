import { APP_INITIALIZER, FactoryProvider } from '@angular/core';

import {
    DashboardWidgetConfig,
    WidgetLayoutDefinition,
} from '../providers/dashboard-widget/dashboard-widget-types';
import { DashboardWidgetService } from '../providers/dashboard-widget/dashboard-widget.service';

/**
 * @description
 * Registers a dashboard widget. Once registered, the widget can be set as part of the default
 * (using {@link setDashboardWidgetLayout}).
 *
 * @docsCategory dashboard-widgets
 */
export function registerDashboardWidget(id: string, config: DashboardWidgetConfig): FactoryProvider {
    return {
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: (dashboardWidgetService: DashboardWidgetService) => () => {
            dashboardWidgetService.registerWidget(id, config);
        },
        deps: [DashboardWidgetService],
    };
}

/**
 * @description
 * Sets the default widget layout for the Admin UI dashboard.
 *
 * @docsCategory dashboard-widgets
 */
export function setDashboardWidgetLayout(layoutDef: WidgetLayoutDefinition): FactoryProvider {
    return {
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: (dashboardWidgetService: DashboardWidgetService) => () => {
            dashboardWidgetService.setDefaultLayout(layoutDef);
        },
        deps: [DashboardWidgetService],
    };
}
