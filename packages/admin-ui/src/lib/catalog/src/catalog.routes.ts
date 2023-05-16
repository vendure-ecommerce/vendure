import { Route } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    AssetFragment,
    CanDeactivateDetailGuard,
    CollectionFragment,
    createResolveData,
    detailBreadcrumb,
    FacetWithValuesFragment,
    GetProductWithVariantsQuery,
} from '@vendure/admin-ui/core';
import { map } from 'rxjs/operators';
import { PageService } from '../../core/src/providers/page/page.service';
import { PageComponent } from '../../core/src/shared/components/page/page.component';

import { AssetDetailComponent } from './components/asset-detail/asset-detail.component';
import { AssetListComponent } from './components/asset-list/asset-list.component';
import { CollectionDetailComponent } from './components/collection-detail/collection-detail.component';
import { CollectionListComponent } from './components/collection-list/collection-list.component';
import { FacetDetailComponent } from './components/facet-detail/facet-detail.component';
import { FacetListComponent } from './components/facet-list/facet-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductOptionsEditorComponent } from './components/product-options-editor/product-options-editor.component';
import { ProductVariantsEditorComponent } from './components/product-variants-editor/product-variants-editor.component';
import { AssetResolver } from './providers/routing/asset-resolver';
import { CollectionResolver } from './providers/routing/collection-resolver';
import { FacetResolver } from './providers/routing/facet-resolver';
import { ProductResolver } from './providers/routing/product-resolver';
import { ProductVariantsResolver } from './providers/routing/product-variants-resolver';

export const createRoutes = (pageService: PageService): Route[] => [
    {
        path: 'products',
        component: PageComponent,
        data: {
            locationId: 'product-list',
            breadcrumb: _('breadcrumb.products'),
        },
        children: pageService.getPageTabRoutes('product-list'),
    },
    {
        path: 'products/:id',
        component: ProductDetailComponent,
        resolve: createResolveData(ProductResolver),
        canDeactivate: [CanDeactivateDetailGuard],
        data: {
            breadcrumb: productBreadcrumb,
        },
        children: pageService.getPageTabRoutes('product-detail'),
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
        path: 'products/:id/options',
        component: ProductOptionsEditorComponent,
        resolve: createResolveData(ProductVariantsResolver),
        canDeactivate: [CanDeactivateDetailGuard],
        data: {
            breadcrumb: productOptionsEditorBreadcrumb,
        },
    },
    {
        path: 'facets',
        component: PageComponent,
        data: {
            locationId: 'facet-list',
            breadcrumb: _('breadcrumb.facets'),
        },
        children: pageService.getPageTabRoutes('facet-list'),
    },
    {
        path: 'facets/:id',
        component: FacetDetailComponent,
        resolve: createResolveData(FacetResolver),
        canDeactivate: [CanDeactivateDetailGuard],
        data: {
            breadcrumb: facetBreadcrumb,
        },
        children: pageService.getPageTabRoutes('facet-detail'),
    },
    {
        path: 'collections',
        component: PageComponent,
        data: {
            locationId: 'collection-list',
            breadcrumb: _('breadcrumb.collections'),
        },
        children: pageService.getPageTabRoutes('collection-list'),
    },
    {
        path: 'collections/:id',
        component: CollectionDetailComponent,
        resolve: createResolveData(CollectionResolver),
        canDeactivate: [CanDeactivateDetailGuard],
        data: {
            breadcrumb: collectionBreadcrumb,
        },
        children: pageService.getPageTabRoutes('collection-detail'),
    },
    {
        path: 'assets',
        component: PageComponent,
        data: {
            locationId: 'asset-list',
            breadcrumb: _('breadcrumb.assets'),
        },
        children: pageService.getPageTabRoutes('asset-list'),
    },
    {
        path: 'assets/:id',
        component: AssetDetailComponent,
        resolve: createResolveData(AssetResolver),
        data: {
            breadcrumb: assetBreadcrumb,
        },
        children: pageService.getPageTabRoutes('asset-detail'),
    },
];

export function productBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<NonNullable<GetProductWithVariantsQuery['product']>>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.products',
        getName: product => product.name,
        route: 'products',
    });
}

export function productVariantEditorBreadcrumb(data: any, params: any) {
    return data.entity.pipe(
        map((entity: any) => [
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
        ]),
    );
}

export function productOptionsEditorBreadcrumb(data: any, params: any) {
    return data.entity.pipe(
        map((entity: any) => [
            {
                label: _('breadcrumb.products'),
                link: ['../', 'products'],
            },
            {
                label: `${entity.name}`,
                link: ['../', 'products', params.id, { tab: 'variants' }],
            },
            {
                label: _('breadcrumb.product-options'),
                link: ['options'],
            },
        ]),
    );
}

export function facetBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<FacetWithValuesFragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.facets',
        getName: facet => facet.name,
        route: 'facets',
    });
}

export function collectionBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<CollectionFragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.collections',
        getName: collection => collection.name,
        route: 'collections',
    });
}

export function assetBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<AssetFragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.assets',
        getName: asset => asset.name,
        route: 'assets',
    });
}
