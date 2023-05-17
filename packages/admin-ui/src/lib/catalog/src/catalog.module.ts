import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { BulkActionRegistryService, SharedModule, PageService } from '@vendure/admin-ui/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

import { createRoutes } from './catalog.routes';
import { ApplyFacetDialogComponent } from './components/apply-facet-dialog/apply-facet-dialog.component';
import { AssetDetailComponent } from './components/asset-detail/asset-detail.component';
import { AssetListComponent } from './components/asset-list/asset-list.component';
import { AssetsComponent } from './components/assets/assets.component';
import { AssignProductsToChannelDialogComponent } from './components/assign-products-to-channel-dialog/assign-products-to-channel-dialog.component';
import { AssignToChannelDialogComponent } from './components/assign-to-channel-dialog/assign-to-channel-dialog.component';
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
import { ProductVariantListComponent } from './components/product-variant-list/product-variant-list.component';
import { ProductVariantsEditorComponent } from './components/product-variants-editor/product-variants-editor.component';
import { ProductVariantsListComponent } from './components/product-variants-list/product-variants-list.component';
import { ProductVariantsTableComponent } from './components/product-variants-table/product-variants-table.component';
import { UpdateProductOptionDialogComponent } from './components/update-product-option-dialog/update-product-option-dialog.component';
import { VariantPriceDetailComponent } from './components/variant-price-detail/variant-price-detail.component';

const CATALOG_COMPONENTS = [
    ProductListComponent,
    ProductDetailComponent,
    FacetListComponent,
    FacetDetailComponent,
    GenerateProductVariantsComponent,
    ProductVariantsListComponent,
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
    AssignToChannelDialogComponent,
    CollectionDataTableComponent,
    CollectionBreadcrumbPipe,
    MoveCollectionsDialogComponent,
    ProductVariantListComponent,
];

@NgModule({
    imports: [SharedModule, RouterModule.forChild([])],
    exports: [...CATALOG_COMPONENTS],
    declarations: [...CATALOG_COMPONENTS],
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
        bulkActionRegistryService.registerBulkAction(removeProductsFromChannelBulkAction);
        bulkActionRegistryService.registerBulkAction(deleteProductsBulkAction);

        bulkActionRegistryService.registerBulkAction(assignFacetsToChannelBulkAction);
        bulkActionRegistryService.registerBulkAction(removeFacetsFromChannelBulkAction);
        bulkActionRegistryService.registerBulkAction(deleteFacetsBulkAction);

        bulkActionRegistryService.registerBulkAction(assignCollectionsToChannelBulkAction);
        bulkActionRegistryService.registerBulkAction(removeCollectionsFromChannelBulkAction);
        bulkActionRegistryService.registerBulkAction(deleteCollectionsBulkAction);
        bulkActionRegistryService.registerBulkAction(moveCollectionsBulkAction);

        pageService.registerPageTab({
            location: 'product-list',
            tab: _('catalog.products'),
            route: '',
            component: ProductListComponent,
        });
        pageService.registerPageTab({
            location: 'product-list',
            tab: _('catalog.product-variants'),
            route: 'variants',
            component: ProductVariantListComponent,
        });
        pageService.registerPageTab({
            location: 'facet-list',
            tab: _('catalog.facets'),
            route: '',
            component: FacetListComponent,
        });
        pageService.registerPageTab({
            location: 'collection-list',
            tab: _('catalog.collections'),
            route: '',
            component: CollectionListComponent,
        });
        pageService.registerPageTab({
            location: 'collection-detail',
            tab: _('catalog.collection'),
            route: '',
            component: CollectionDetailComponent,
        });
        pageService.registerPageTab({
            location: 'asset-list',
            tab: _('catalog.assets'),
            route: '',
            component: AssetListComponent,
        });
    }
}
