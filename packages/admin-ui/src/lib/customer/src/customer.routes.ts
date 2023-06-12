import { Route } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    CanDeactivateDetailGuard,
    createResolveData,
    CustomerFragment,
    detailBreadcrumb,
    PageComponent,
    PageService,
} from '@vendure/admin-ui/core';

import { CustomerDetailComponent } from './components/customer-detail/customer-detail.component';
import { CustomerGroupListComponent } from './components/customer-group-list/customer-group-list.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';

export const createRoutes = (pageService: PageService): Route[] => [
    {
        path: 'customers',
        component: PageComponent,
        data: {
            breadcrumb: _('breadcrumb.customers'),
        },
        children: pageService.getPageTabRoutes('customer-list'),
    },
    {
        path: 'customers/:id',
        component: PageComponent,
        data: {
            locationId: 'customer-detail',
            breadcrumb: { label: _('breadcrumb.customers'), link: ['../', 'customers'] },
        },
        children: pageService.getPageTabRoutes('customer-detail'),
    },
    {
        path: 'groups',
        component: PageComponent,
        data: {
            locationId: 'customer-detail',
            breadcrumb: _('breadcrumb.customer-groups'),
        },
        children: pageService.getPageTabRoutes('customer-group-list'),
    },
    {
        path: 'groups/:id',
        component: PageComponent,
        data: {
            locationId: 'customer-group-detail',
            breadcrumb: { label: _('breadcrumb.customer-groups'), link: ['../', 'groups'] },
        },
        children: pageService.getPageTabRoutes('customer-group-detail'),
    },
];

export function customerBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<CustomerFragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.customers',
        getName: customer => `${customer.firstName} ${customer.lastName}`,
        route: 'customers',
    });
}
