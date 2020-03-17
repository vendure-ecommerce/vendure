import { Route } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    Asset,
    CanDeactivateDetailGuard,
    Collection,
    createResolveData,
    detailBreadcrumb,
    FacetWithValues,
    ProductWithVariants,
} from '@vendure/admin-ui/core';
import { map } from 'rxjs/operators';

import { AssetDetailComponent } from './components/asset-detail/asset-detail.component';
import { AssetListComponent } from './components/asset-list/asset-list.component';
import { CollectionDetailComponent } from './components/collection-detail/collection-detail.component';
import { CollectionListComponent } from './components/collection-list/collection-list.component';
import { FacetDetailComponent } from './components/facet-detail/facet-detail.component';
import { FacetListComponent } from './components/facet-list/facet-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductVariantsEditorComponent } from './components/product-variants-editor/product-variants-editor.component';
import { AssetResolver } from './providers/routing/asset-resolver';
import { CollectionResolver } from './providers/routing/collection-resolver';
import { FacetResolver } from './providers/routing/facet-resolver';
import { ProductResolver } from './providers/routing/product-resolver';
import { ProductVariantsResolver } from './providers/routing/product-variants-resolver';

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
        path: 'products/:id/manage-variants',
        component: ProductVariantsEditorComponent,
        resolve: createResolveData(ProductVariantsResolver),
        canDeactivate: [CanDeactivateDetailGuard],
        data: {
            breadcrumb: productVariantEditorBreadcrumb,
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
        path: 'collections',
        component: CollectionListComponent,
        data: {
            breadcrumb: _('breadcrumb.collections'),
        },
    },
    {
        path: 'collections/:id',
        component: CollectionDetailComponent,
        resolve: createResolveData(CollectionResolver),
        canDeactivate: [CanDeactivateDetailGuard],
        data: {
            breadcrumb: collectionBreadcrumb,
        },
    },
    {
        path: 'assets',
        component: AssetListComponent,
        data: {
            breadcrumb: _('breadcrumb.assets'),
        },
    },
    {
        path: 'assets/:id',
        component: AssetDetailComponent,
        resolve: createResolveData(AssetResolver),
        data: {
            breadcrumb: assetBreadcrumb,
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

export function productVariantEditorBreadcrumb(data: any, params: any) {
    return data.entity.pipe(
        map((entity: any) => {
            return [
                {
                    label: _('breadcrumb.products'),
                    link: ['../', 'products'],
                },
                {
                    label: `${entity.name}`,
                    link: ['../', 'products', params.id, { tab: 'variants' }],
                },
                {
                    label: _('breadcrumb.manage-variants'),
                    link: ['manage-variants'],
                },
            ];
        }),
    );
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

export function collectionBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<Collection.Fragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.collections',
        getName: collection => collection.name,
        route: 'collections',
    });
}

export function assetBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<Asset.Fragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.assets',
        getName: asset => asset.name,
        route: 'assets',
    });
}
