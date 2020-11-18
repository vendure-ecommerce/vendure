import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    DashboardWidgetConfig,
    DashboardWidgetService,
    Permission,
    WidgetLayoutDefinition,
} from '@vendure/admin-ui/core';

import { LatestOrdersWidgetComponent } from './widgets/latest-orders-widget/latest-orders-widget.component';
import { OrderSummaryWidgetComponent } from './widgets/order-summary-widget/order-summary-widget.component';
import { TestWidgetComponent } from './widgets/test-widget/test-widget.component';
import { WelcomeWidgetComponent } from './widgets/welcome-widget/welcome-widget.component';

export const DEFAULT_DASHBOARD_WIDGET_LAYOUT: WidgetLayoutDefinition = [
    { id: 'welcome', width: 12 },
    { id: 'orderSummary', width: 6 },
    { id: 'latestOrders', width: 6 },
];

export const DEFAULT_WIDGETS: { [id: string]: DashboardWidgetConfig } = {
    welcome: {
        loadComponent: () => WelcomeWidgetComponent,
    },
    orderSummary: {
        title: _('dashboard.orders-summary'),
        loadComponent: () => OrderSummaryWidgetComponent,
        requiresPermissions: [Permission.ReadOrder],
    },
    latestOrders: {
        title: _('dashboard.latest-orders'),
        loadComponent: () => LatestOrdersWidgetComponent,
        supportedWidths: [6, 8, 12],
        requiresPermissions: [Permission.ReadOrder],
    },
    testWidget: {
        title: 'Test Widget',
        loadComponent: () => TestWidgetComponent,
    },
};
