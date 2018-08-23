import { Route } from '@angular/router';
import { map } from 'rxjs/operators';

import { _ } from '../core/providers/i18n/mark-for-extraction';
import { DataService } from '../data/providers/data.service';

import { FacetDetailComponent } from './components/facet-detail/facet-detail.component';
import { FacetListComponent } from './components/facet-list/facet-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { FacetResolver } from './providers/routing/facet-resolver';
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
    {
        path: 'facets',
        component: FacetListComponent,
        data: {
            breadcrumb: _('breadcrumb.facets'),
        },
    },
    {
        path: 'facets/:id',
        component: FacetDetailComponent,
        resolve: {
            facet: FacetResolver,
        },
        data: {
            breadcrumb: facetBreadcrumb,
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

export function facetBreadcrumb(data: any, params: any, dataService: DataService) {
    return dataService.facet.getFacet(params.id).stream$.pipe(
        map(facetData => {
            let facetLabel = '';
            if (params.id === 'create') {
                facetLabel = 'common.create';
            } else {
                facetLabel = `#${params.id} (${facetData.facet && facetData.facet.name})`;
            }
            return [
                {
                    label: _('breadcrumb.facets'),
                    link: ['../', 'facets'],
                },
                {
                    label: facetLabel,
                    link: [params.id],
                },
            ];
        }),
    );
}
