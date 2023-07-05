import { Route } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BreadcrumbLabelLinkPair,
    CanDeactivateDetailGuard,
    detailBreadcrumb,
    OrderDetailFragment,
    PageComponent,
    PageService,
} from '@vendure/admin-ui/core';
import { map } from 'rxjs/operators';

import { DraftOrderDetailComponent } from './components/draft-order-detail/draft-order-detail.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderEditorComponent } from './components/order-editor/order-editor.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderResolver } from './providers/routing/order-resolver';
import { OrderGuard } from './providers/routing/order.guard';

export const createRoutes = (pageService: PageService): Route[] => [
    {
        path: '',
        component: PageComponent,
        pathMatch: 'full',
        data: {
            locationId: 'order-list',
            breadcrumb: _('breadcrumb.orders'),
        },
        children: pageService.getPageTabRoutes('order-list'),
    },
    {
        path: 'draft/:id',
        component: PageComponent,
        canActivate: [OrderGuard],
        data: {
            locationId: 'draft-order-detail',
            breadcrumb: { label: _('breadcrumb.orders'), link: ['../'] },
        },
        children: pageService.getPageTabRoutes('draft-order-detail'),
    },
    {
        path: ':id',
        component: PageComponent,
        canActivate: [OrderGuard],
        data: {
            locationId: 'order-detail',
            breadcrumb: { label: _('breadcrumb.orders'), link: ['../'] },
        },
        children: pageService.getPageTabRoutes('order-detail'),
    },
    {
        path: ':aggregateOrderId/seller-orders/:id',
        component: PageComponent,
        canActivate: [OrderGuard],
        data: {
            locationId: 'order-detail',
            breadcrumb: { label: _('breadcrumb.orders'), link: ['../'] },
        },
        children: pageService.getPageTabRoutes('order-detail'),
    },
    {
        path: ':id/modify',
        component: OrderEditorComponent,
        resolve: {
            entity: OrderResolver,
        },
        data: {
            breadcrumb: modifyingOrderBreadcrumb,
        },
    },
];

export function orderBreadcrumb(data: any, params: any) {
    return data.entity.pipe(
        map((entity: OrderDetailFragment) => {
            if (entity.aggregateOrder) {
                return [
                    {
                        label: 'breadcrumb.orders',
                        link: ['../'],
                    },
                    {
                        label: entity.aggregateOrder.code,
                        link: ['../', entity.aggregateOrder.id],
                    },
                    {
                        label: _('breadcrumb.seller-orders'),
                        link: ['../', entity.aggregateOrder.id],
                    },
                    {
                        label: entity.code,
                        link: [entity.id],
                    },
                ];
            } else {
                return [
                    {
                        label: 'breadcrumb.orders',
                        link: ['../'],
                    },
                    {
                        label: entity.code,
                        link: [entity.id],
                    },
                ];
            }
        }),
    );
}

export function modifyingOrderBreadcrumb(data: any, params: any) {
    return orderBreadcrumb(data, params).pipe(
        map((breadcrumbs: BreadcrumbLabelLinkPair[]) => {
            const modifiedBreadcrumbs = breadcrumbs.slice();
            modifiedBreadcrumbs[1].link = ['../', breadcrumbs[1].link[0]];
            return modifiedBreadcrumbs.concat({ label: _('breadcrumb.modifying'), link: [''] });
        }) as any,
    );
}
