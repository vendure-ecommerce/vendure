import { Route } from '@angular/router';
import { map } from 'rxjs/operators';
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
    return dataService.product.getProduct(params.id).single$.pipe(
        map(productData => {
            return [
                   {
                       label: 'Products',
                       link: ['../', 'products'],
                   },
                   {
                       label: productData.product.name,
                       link: [params.id],
                   },
               ];
        }),
    );
}
