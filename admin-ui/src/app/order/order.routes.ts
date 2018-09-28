import { Route } from '@angular/router';

import { _ } from '../core/providers/i18n/mark-for-extraction';

import { OrderListComponent } from './components/order-list/order-list.component';

export const orderRoutes: Route[] = [
    {
        path: '',
        component: OrderListComponent,
        data: {
            breadcrumb: _('breadcrumb.orders'),
        },
    },
];
