import { Route } from '@angular/router';

import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component';

export const catalogRoutes: Route[] = [
    {
        path: 'products',
        component: ProductListComponent,
        data: {
            breadcrumb: 'Products',
        },
    },
    {
        path: 'products/:id',
        component: ProductDetailComponent,
        data: {
            breadcrumb: productBreadcrumb,
        },
    },
];

export function productBreadcrumb(data, params, store) {
    return [
        {
            label: 'Products',
            link: ['../', 'products'],
        },
        {
            label: params.id,
            link: [params.id],
        },
    ];
}
