import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { DashboardWidgetConfig, DashboardWidgetService, Permission } from '@vendure/admin-ui/core';

import { LatestOrdersWidgetComponent } from './widgets/latest-orders-widget/latest-orders-widget.component';
import { OrderSummaryWidgetComponent } from './widgets/order-summary-widget/order-summary-widget.component';
import { TestWidgetComponent } from './widgets/test-widget/test-widget.component';
import { WelcomeWidgetComponent } from './widgets/welcome-widget/welcome-widget.component';

export const DEFAULT_DASHBOARD_WIDGET_LAYOUT = ['welcome', 'orderSummary', 'latestOrders'] as const;

export const DEFAULT_WIDGETS: { [id: string]: DashboardWidgetConfig } = {
    welcome: {
        loadComponent: () => WelcomeWidgetComponent,
        width: 12,
    },
    orderSummary: {
        title: _('dashboard.orders-summary'),
        loadComponent: () => OrderSummaryWidgetComponent,
        width: 6,
        requiresPermissions: [Permission.ReadOrder],
    },
    latestOrders: {
        title: _('dashboard.latest-orders'),
        loadComponent: () => LatestOrdersWidgetComponent,
        width: 6,
        requiresPermissions: [Permission.ReadOrder],
    },
    testWidget: {
        title: 'Test Widget',
        loadComponent: () => TestWidgetComponent,
        width: 4,
    },
};
