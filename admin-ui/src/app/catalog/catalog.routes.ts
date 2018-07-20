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
            breadcrumb: _('breadcrumb.products'),
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
            let productLabel = '';
            if (params.id === 'create') {
                productLabel = 'common.create';
            } else {
                productLabel = `#${params.id} (${productData.product && productData.product.name})`;
            }
            return [
                {
                    label: _('breadcrumb.products'),
                    link: ['../', 'products'],
                },
                {
                    label: productLabel,
                    link: [params.id],
                },
            ];
        }),
    );
}
