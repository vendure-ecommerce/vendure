import { Route } from '@angular/router';
import { BreadcrumbFunction } from '../core/components/breadcrumb/breadcrumb.component';
import { DataService } from '../data/providers/data.service';
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

export function productBreadcrumb(data: any, params: any, dataService: DataService) {
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
