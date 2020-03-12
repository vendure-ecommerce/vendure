import { Route } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { CanDeactivateDetailGuard, createResolveData, detailBreadcrumb, OrderDetail } from '@vendure/admin-ui/core';

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
    return detailBreadcrumb<OrderDetail.Fragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.orders',
        getName: order => order.code,
        route: '',
    });
}
