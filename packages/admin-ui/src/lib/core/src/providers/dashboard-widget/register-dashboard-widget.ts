import { APP_INITIALIZER, FactoryProvider } from '@angular/core';

import { DashboardWidgetConfig } from './dashboard-widget-types';
import { DashboardWidgetService } from './dashboard-widget.service';

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

export function setDashboardWidgetLayout(ids: string[] | ReadonlyArray<string>): FactoryProvider {
    return {
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: (dashboardWidgetService: DashboardWidgetService) => () => {
            dashboardWidgetService.setDefaultLayout(ids);
        },
        deps: [DashboardWidgetService],
    };
}
