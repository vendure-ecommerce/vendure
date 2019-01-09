import { Route } from '@angular/router';
import { FacetWithValues, ProductWithVariants } from 'shared/generated-types';

import { createResolveData } from '../common/base-entity-resolver';
import { detailBreadcrumb } from '../common/detail-breadcrumb';
import { _ } from '../core/providers/i18n/mark-for-extraction';
import { CanDeactivateDetailGuard } from '../shared/providers/routing/can-deactivate-detail-guard';

import { AssetListComponent } from './components/asset-list/asset-list.component';
import { FacetDetailComponent } from './components/facet-detail/facet-detail.component';
import { FacetListComponent } from './components/facet-list/facet-list.component';
import { ProductCategoryDetailComponent } from './components/product-category-detail/product-category-detail.component';
import { ProductCategoryListComponent } from './components/product-category-list/product-category-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { FacetResolver } from './providers/routing/facet-resolver';
import { ProductCategoryResolver } from './providers/routing/product-category-resolver';
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
        canDeactivate: [CanDeactivateDetailGuard],
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
        canDeactivate: [CanDeactivateDetailGuard],
        data: {
            breadcrumb: facetBreadcrumb,
        },
    },
    {
        path: 'categories',
        component: ProductCategoryListComponent,
        data: {
            breadcrumb: _('breadcrumb.categories'),
        },
    },
    {
        path: 'categories/:id',
        component: ProductCategoryDetailComponent,
        resolve: createResolveData(ProductCategoryResolver),
        canDeactivate: [CanDeactivateDetailGuard],
        data: {
            breadcrumb: productCategoryBreadcrumb,
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

export function productCategoryBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<FacetWithValues.Fragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.categories',
        getName: facet => facet.name,
        route: 'categories',
    });
}
