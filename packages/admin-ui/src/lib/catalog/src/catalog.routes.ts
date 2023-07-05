import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Route } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    CanDeactivateDetailGuard,
    createResolveData,
    DataService,
    PageComponent,
    PageService,
} from '@vendure/admin-ui/core';
import { map } from 'rxjs/operators';
import { ProductOptionsEditorComponent } from './components/product-options-editor/product-options-editor.component';
import { ProductVariantsEditorComponent } from './components/product-variants-editor/product-variants-editor.component';
import { ProductVariantsResolver } from './providers/routing/product-variants-resolver';

export const createRoutes = (pageService: PageService): Route[] => [
    {
        path: 'inventory',
        component: PageComponent,
        data: {
            locationId: 'product-list',
            breadcrumb: _('breadcrumb.inventory'),
        },
        children: pageService.getPageTabRoutes('product-list'),
    },
    {
        path: 'inventory/:id',
        component: PageComponent,
        data: {
            locationId: 'product-detail',
            breadcrumb: { label: _('breadcrumb.inventory'), link: ['../', 'inventory'] },
        },
        children: [
            {
                path: 'manage-variants',
                component: ProductVariantsEditorComponent,
                canDeactivate: [CanDeactivateDetailGuard],
                data: {
                    breadcrumb: ({ product }) => [
                        {
                            label: `${product.name}`,
                            link: ['../'],
                        },
                        {
                            label: _('breadcrumb.manage-variants'),
                            link: ['manage-variants'],
                        },
                    ],
                },
                resolve: {
                    product: (route: ActivatedRouteSnapshot) =>
                        inject(DataService)
                            .product.getProductVariantsOptions(route.parent?.params.id)
                            .mapSingle(data => data.product),
                },
            },
            ...pageService.getPageTabRoutes('product-detail'),
        ],
    },
    {
        path: 'inventory/:productId/variants/:id',
        component: PageComponent,
        data: {
            locationId: 'product-variant-detail',
            breadcrumb: { label: _('breadcrumb.inventory'), link: ['../', 'inventory'] },
        },
        children: pageService.getPageTabRoutes('product-variant-detail'),
    },
    {
        path: 'inventory/:id/options',
        component: ProductOptionsEditorComponent,
        resolve: createResolveData(ProductVariantsResolver),
        canDeactivate: [CanDeactivateDetailGuard],
        data: {
            breadcrumb: productOptionsEditorBreadcrumb,
        },
    },
    {
        path: 'inventory/stock-locations/:id',
        component: PageComponent,
        data: {
            locationId: 'stock-location-detail',
            breadcrumb: [
                { label: _('breadcrumb.inventory'), link: ['../', 'inventory'] },
                {
                    label: _('breadcrumb.stock-locations'),
                    link: ['../', 'inventory', 'stock-locations'],
                },
            ],
        },
        children: pageService.getPageTabRoutes('stock-location-detail'),
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
        component: PageComponent,
        data: {
            locationId: 'facet-detail',
            breadcrumb: { label: _('breadcrumb.facets'), link: ['../', 'facets'] },
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
        component: PageComponent,
        data: {
            locationId: 'collection-detail',
            breadcrumb: { label: _('breadcrumb.collections'), link: ['../', 'collections'] },
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
        component: PageComponent,
        data: {
            locationId: 'asset-detail',
            breadcrumb: { label: _('breadcrumb.assets'), link: ['../', 'assets'] },
        },
        children: pageService.getPageTabRoutes('asset-detail'),
    },
];

export function productOptionsEditorBreadcrumb(data: any, params: any) {
    return data.entity.pipe(
        map((entity: any) => [
            {
                label: _('breadcrumb.inventory'),
                link: ['../', 'inventory'],
            },
            {
                label: `${entity.name}`,
                link: ['../', 'inventory', params.id],
            },
            {
                label: _('breadcrumb.product-options'),
                link: ['options'],
            },
        ]),
    );
}
