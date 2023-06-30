import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    AssetDetailQueryDocument,
    BulkActionRegistryService,
    CollectionDetailQueryDocument,
    detailComponentWithResolver,
    GetFacetDetailDocument,
    GetProductDetailDocument,
    GetProductVariantDetailDocument,
    GetStockLocationDetailDocument,
    PageService,
    SharedModule,
} from '@vendure/admin-ui/core';

import { createRoutes } from './catalog.routes';
import { ApplyFacetDialogComponent } from './components/apply-facet-dialog/apply-facet-dialog.component';
import { AssetDetailComponent } from './components/asset-detail/asset-detail.component';
import { AssetListComponent } from './components/asset-list/asset-list.component';
import { AssetsComponent } from './components/assets/assets.component';
import { AssignProductsToChannelDialogComponent } from './components/assign-products-to-channel-dialog/assign-products-to-channel-dialog.component';
import { BulkAddFacetValuesDialogComponent } from './components/bulk-add-facet-values-dialog/bulk-add-facet-values-dialog.component';
import { CollectionContentsComponent } from './components/collection-contents/collection-contents.component';
import { CollectionDataTableComponent } from './components/collection-data-table/collection-data-table.component';
import { CollectionDetailComponent } from './components/collection-detail/collection-detail.component';
import { CollectionBreadcrumbPipe } from './components/collection-list/collection-breadcrumb.pipe';
import {
    assignCollectionsToChannelBulkAction,
    deleteCollectionsBulkAction,
    moveCollectionsBulkAction,
    removeCollectionsFromChannelBulkAction,
} from './components/collection-list/collection-list-bulk-actions';
import { CollectionListComponent } from './components/collection-list/collection-list.component';
import { CollectionTreeNodeComponent } from './components/collection-tree/collection-tree-node.component';
import { CollectionTreeComponent } from './components/collection-tree/collection-tree.component';
import { ConfirmVariantDeletionDialogComponent } from './components/confirm-variant-deletion-dialog/confirm-variant-deletion-dialog.component';
import { CreateProductOptionGroupDialogComponent } from './components/create-product-option-group-dialog/create-product-option-group-dialog.component';
import { CreateProductVariantDialogComponent } from './components/create-product-variant-dialog/create-product-variant-dialog.component';
import { FacetDetailComponent } from './components/facet-detail/facet-detail.component';
import {
    assignFacetsToChannelBulkAction,
    deleteFacetsBulkAction,
    removeFacetsFromChannelBulkAction,
} from './components/facet-list/facet-list-bulk-actions';
import { FacetListComponent } from './components/facet-list/facet-list.component';
import { GenerateProductVariantsComponent } from './components/generate-product-variants/generate-product-variants.component';
import { MoveCollectionsDialogComponent } from './components/move-collections-dialog/move-collections-dialog.component';
import { OptionValueInputComponent } from './components/option-value-input/option-value-input.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import {
    assignFacetValuesToProductsBulkAction,
    assignProductsToChannelBulkAction,
    deleteProductsBulkAction,
    removeProductsFromChannelBulkAction,
} from './components/product-list/product-list-bulk-actions';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductOptionsEditorComponent } from './components/product-options-editor/product-options-editor.component';
import { ProductVariantDetailComponent } from './components/product-variant-detail/product-variant-detail.component';
import { ProductVariantListComponent } from './components/product-variant-list/product-variant-list.component';
import {
    assignProductVariantsToChannelBulkAction,
    removeProductVariantsFromChannelBulkAction,
    deleteProductVariantsBulkAction,
} from './components/product-variant-list/product-variant-list-bulk-actions';
import { ProductVariantQuickJumpComponent } from './components/product-variant-quick-jump/product-variant-quick-jump.component';
import { ProductVariantsEditorComponent } from './components/product-variants-editor/product-variants-editor.component';
import { ProductVariantsTableComponent } from './components/product-variants-table/product-variants-table.component';
import { StockLocationDetailComponent } from './components/stock-location-detail/stock-location-detail.component';
import {
    assignStockLocationsToChannelBulkAction,
    deleteStockLocationsBulkAction,
    removeStockLocationsFromChannelBulkAction,
} from './components/stock-location-list/stock-location-list-bulk-actions';
import { StockLocationListComponent } from './components/stock-location-list/stock-location-list.component';
import { UpdateProductOptionDialogComponent } from './components/update-product-option-dialog/update-product-option-dialog.component';
import { VariantPriceDetailComponent } from './components/variant-price-detail/variant-price-detail.component';

const CATALOG_COMPONENTS = [
    ProductListComponent,
    ProductDetailComponent,
    FacetListComponent,
    FacetDetailComponent,
    GenerateProductVariantsComponent,
    ApplyFacetDialogComponent,
    AssetListComponent,
    AssetsComponent,
    VariantPriceDetailComponent,
    CollectionListComponent,
    CollectionDetailComponent,
    CollectionTreeComponent,
    CollectionTreeNodeComponent,
    CollectionContentsComponent,
    ProductVariantsTableComponent,
    OptionValueInputComponent,
    UpdateProductOptionDialogComponent,
    ProductVariantsEditorComponent,
    AssignProductsToChannelDialogComponent,
    AssetDetailComponent,
    ConfirmVariantDeletionDialogComponent,
    ProductOptionsEditorComponent,
    BulkAddFacetValuesDialogComponent,
    CollectionDataTableComponent,
    CollectionBreadcrumbPipe,
    MoveCollectionsDialogComponent,
    ProductVariantListComponent,
    ProductDetailComponent,
    ProductVariantDetailComponent,
    CreateProductVariantDialogComponent,
    CreateProductOptionGroupDialogComponent,
    ProductVariantQuickJumpComponent,
    StockLocationListComponent,
];

@NgModule({
    imports: [SharedModule, RouterModule.forChild([])],
    exports: [...CATALOG_COMPONENTS],
    declarations: [...CATALOG_COMPONENTS, StockLocationDetailComponent],
    providers: [
        {
            provide: ROUTES,
            useFactory: (pageService: PageService) => createRoutes(pageService),
            multi: true,
            deps: [PageService],
        },
    ],
})
export class CatalogModule {
    constructor(
        private bulkActionRegistryService: BulkActionRegistryService,
        private pageService: PageService,
    ) {
        bulkActionRegistryService.registerBulkAction(assignFacetValuesToProductsBulkAction);
        bulkActionRegistryService.registerBulkAction(assignProductsToChannelBulkAction);
        bulkActionRegistryService.registerBulkAction(assignProductVariantsToChannelBulkAction);
        bulkActionRegistryService.registerBulkAction(removeProductsFromChannelBulkAction);
        bulkActionRegistryService.registerBulkAction(removeProductVariantsFromChannelBulkAction);
        bulkActionRegistryService.registerBulkAction(deleteProductsBulkAction);
        bulkActionRegistryService.registerBulkAction(deleteProductVariantsBulkAction);

        bulkActionRegistryService.registerBulkAction(assignFacetsToChannelBulkAction);
        bulkActionRegistryService.registerBulkAction(removeFacetsFromChannelBulkAction);
        bulkActionRegistryService.registerBulkAction(deleteFacetsBulkAction);

        bulkActionRegistryService.registerBulkAction(moveCollectionsBulkAction);
        bulkActionRegistryService.registerBulkAction(assignCollectionsToChannelBulkAction);
        bulkActionRegistryService.registerBulkAction(removeCollectionsFromChannelBulkAction);
        bulkActionRegistryService.registerBulkAction(deleteCollectionsBulkAction);

        bulkActionRegistryService.registerBulkAction(assignStockLocationsToChannelBulkAction);
        bulkActionRegistryService.registerBulkAction(removeStockLocationsFromChannelBulkAction);
        bulkActionRegistryService.registerBulkAction(deleteStockLocationsBulkAction);

        pageService.registerPageTab({
            priority: 0,
            location: 'product-list',
            tab: _('catalog.products'),
            route: '',
            component: ProductListComponent,
        });
        pageService.registerPageTab({
            priority: 0,
            location: 'product-detail',
            tab: _('catalog.product'),
            route: '',
            component: detailComponentWithResolver({
                component: ProductDetailComponent,
                query: GetProductDetailDocument,
                entityKey: 'product',
                getBreadcrumbs: entity => [
                    {
                        label: entity ? entity.name : _('catalog.create-new-product'),
                        link: [entity?.id],
                    },
                ],
            }),
        });
        pageService.registerPageTab({
            priority: 0,
            location: 'product-list',
            tab: _('catalog.product-variants'),
            route: 'variants',
            component: ProductVariantListComponent,
        });
        pageService.registerPageTab({
            priority: 0,
            location: 'stock-location-detail',
            tab: _('catalog.stock-location'),
            route: '',
            component: detailComponentWithResolver({
                component: StockLocationDetailComponent,
                query: GetStockLocationDetailDocument,
                entityKey: 'stockLocation',
                getBreadcrumbs: entity => [
                    {
                        label: entity ? entity.name : _('catalog.create-new-stock-location'),
                        link: [entity?.id],
                    },
                ],
            }),
        });
        pageService.registerPageTab({
            priority: 0,
            location: 'product-list',
            tab: _('catalog.stock-locations'),
            route: 'stock-locations',
            component: StockLocationListComponent,
        });
        pageService.registerPageTab({
            priority: 0,
            location: 'product-variant-detail',
            tab: _('catalog.product-variants'),
            route: '',
            component: detailComponentWithResolver({
                component: ProductVariantDetailComponent,
                query: GetProductVariantDetailDocument,
                entityKey: 'productVariant',
                getBreadcrumbs: entity => [
                    {
                        label: `${entity?.product.name}`,
                        link: ['/catalog', 'inventory', entity?.product.id],
                    },
                    {
                        label: `${entity?.name} (${entity?.sku})`,
                        link: ['variants', entity?.id],
                    },
                ],
            }),
        });
        pageService.registerPageTab({
            priority: 0,
            location: 'facet-list',
            tab: _('catalog.facets'),
            route: '',
            component: FacetListComponent,
        });
        pageService.registerPageTab({
            priority: 0,
            location: 'facet-detail',
            tab: _('catalog.facet'),
            route: '',
            component: detailComponentWithResolver({
                component: FacetDetailComponent,
                query: GetFacetDetailDocument,
                entityKey: 'facet',
                getBreadcrumbs: entity => [
                    {
                        label: entity ? entity.name : _('catalog.create-new-facet'),
                        link: [entity?.id],
                    },
                ],
            }),
        });
        pageService.registerPageTab({
            priority: 0,
            location: 'collection-list',
            tab: _('catalog.collections'),
            route: '',
            component: CollectionListComponent,
        });
        pageService.registerPageTab({
            priority: 0,
            location: 'collection-detail',
            tab: _('catalog.collection'),
            route: '',
            component: detailComponentWithResolver({
                component: CollectionDetailComponent,
                query: CollectionDetailQueryDocument,
                entityKey: 'collection',
                getBreadcrumbs: entity => [
                    {
                        label: entity ? entity.name : _('catalog.create-new-collection'),
                        link: [entity?.id],
                    },
                ],
            }),
        });
        pageService.registerPageTab({
            priority: 0,
            location: 'asset-list',
            tab: _('catalog.assets'),
            route: '',
            component: AssetListComponent,
        });
        pageService.registerPageTab({
            priority: 0,
            location: 'asset-detail',
            tab: _('catalog.asset'),
            route: '',
            component: detailComponentWithResolver({
                component: AssetDetailComponent,
                query: AssetDetailQueryDocument,
                entityKey: 'asset',
                getBreadcrumbs: entity => [
                    {
                        label: `${entity?.name}`,
                        link: [entity?.id],
                    },
                ],
            }),
        });
    }
}
