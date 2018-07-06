import { Route } from '@angular/router';
import { map } from 'rxjs/operators';
import { _ } from '../core/providers/i18n/mark-for-extraction';
import { DataService } from '../data/providers/data.service';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductResolver } from './providers/routing/product-resolver';

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
        resolve: {
            product: ProductResolver,
        },
        data: {
            breadcrumb: productBreadcrumb,
        },
    },
];

export function productBreadcrumb(data: any, params: any, dataService: DataService) {
    return dataService.product.getProduct(params.id).stream$.pipe(
        map(productData => {
            return [
                   {
                       label: _('breadcrumb.products'),
                       link: ['../', 'products'],
                   },
                   {
                       label: `#${params.id} (${productData.product.name})`,
                       link: [params.id],
                   },
               ];
        }),
    );
}
