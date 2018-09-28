import { Route } from '@angular/router';
import { FacetWithValues, ProductWithVariants } from 'shared/generated-types';

import { createResolveData } from '../common/base-entity-resolver';
import { detailBreadcrumb } from '../common/detail-breadcrumb';
import { _ } from '../core/providers/i18n/mark-for-extraction';

import { AssetListComponent } from './components/asset-list/asset-list.component';
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
        resolve: createResolveData(ProductResolver),
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
        resolve: createResolveData(FacetResolver),
        data: {
            breadcrumb: facetBreadcrumb,
        },
    },
    {
        path: 'assets',
        component: AssetListComponent,
        data: {
            breadcrumb: _('breadcrumb.assets'),
        },
    },
];

export function productBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<ProductWithVariants.Fragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.products',
        getName: product => product.name,
        route: 'products',
    });
}

export function facetBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<FacetWithValues.Fragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.facets',
        getName: facet => facet.name,
        route: 'facets',
    });
}
