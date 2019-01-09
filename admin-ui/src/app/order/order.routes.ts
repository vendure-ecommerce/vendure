import { Route } from '@angular/router';
import { OrderWithLines } from 'shared/generated-types';

import { createResolveData } from '../common/base-entity-resolver';
import { detailBreadcrumb } from '../common/detail-breadcrumb';
import { _ } from '../core/providers/i18n/mark-for-extraction';
import { CanDeactivateDetailGuard } from '../shared/providers/routing/can-deactivate-detail-guard';

import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderResolver } from './providers/routing/order-resolver';

export const orderRoutes: Route[] = [
    {
        path: '',
        component: OrderListComponent,
        data: {
            breadcrumb: _('breadcrumb.orders'),
        },
    },
    {
        path: ':id',
        component: OrderDetailComponent,
        resolve: createResolveData(OrderResolver),
        canDeactivate: [CanDeactivateDetailGuard],
        data: {
            breadcrumb: orderBreadcrumb,
        },
    },
];

export function orderBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<OrderWithLines.Fragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.orders',
        getName: order => order.code,
        route: '',
    });
}
