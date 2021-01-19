import { Route } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BreadcrumbLabelLinkPair,
    CanDeactivateDetailGuard,
    createResolveData,
    detailBreadcrumb,
    OrderDetail,
} from '@vendure/admin-ui/core';
import { map } from 'rxjs/operators';

import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderEditorComponent } from './components/order-editor/order-editor.component';
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
    {
        path: ':id/modify',
        component: OrderEditorComponent,
        resolve: createResolveData(OrderResolver),
        // canDeactivate: [CanDeactivateDetailGuard],
        data: {
            breadcrumb: modifyingOrderBreadcrumb,
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

export function modifyingOrderBreadcrumb(data: any, params: any) {
    return orderBreadcrumb(data, params).pipe(
        map((breadcrumbs: BreadcrumbLabelLinkPair[]) => {
            const modifiedBreadcrumbs = breadcrumbs.slice();
            modifiedBreadcrumbs[0].link[0] = '../';
            modifiedBreadcrumbs[1].link[0] = '../orders';
            return modifiedBreadcrumbs.concat({ label: _('breadcrumb.modifying'), link: [''] });
        }) as any,
    );
}
