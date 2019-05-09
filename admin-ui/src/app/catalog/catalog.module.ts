import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { catalogRoutes } from './catalog.routes';
import { ApplyFacetDialogComponent } from './components/apply-facet-dialog/apply-facet-dialog.component';
import { AssetFileInputComponent } from './components/asset-file-input/asset-file-input.component';
import { AssetGalleryComponent } from './components/asset-gallery/asset-gallery.component';
import { AssetListComponent } from './components/asset-list/asset-list.component';
import { AssetPickerDialogComponent } from './components/asset-picker-dialog/asset-picker-dialog.component';
import { AssetPreviewComponent } from './components/asset-preview/asset-preview.component';
import { CollectionContentsComponent } from './components/collection-contents/collection-contents.component';
import { CollectionDetailComponent } from './components/collection-detail/collection-detail.component';
import { CollectionListComponent } from './components/collection-list/collection-list.component';
import { CollectionTreeNodeComponent } from './components/collection-tree/collection-tree-node.component';
import { CollectionTreeComponent } from './components/collection-tree/collection-tree.component';
import { CreateOptionGroupDialogComponent } from './components/create-option-group-dialog/create-option-group-dialog.component';
import { CreateOptionGroupFormComponent } from './components/create-option-group-form/create-option-group-form.component';
import { FacetDetailComponent } from './components/facet-detail/facet-detail.component';
import { FacetListComponent } from './components/facet-list/facet-list.component';
import { GenerateProductVariantsComponent } from './components/generate-product-variants/generate-product-variants.component';
import { ProductAssetsComponent } from './components/product-assets/product-assets.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductVariantsListComponent } from './components/product-variants-list/product-variants-list.component';
import { ProductVariantsTableComponent } from './components/product-variants-table/product-variants-table.component';
import { ProductVariantsWizardComponent } from './components/product-variants-wizard/product-variants-wizard.component';
import { SelectOptionGroupDialogComponent } from './components/select-option-group-dialog/select-option-group-dialog.component';
import { SelectOptionGroupComponent } from './components/select-option-group/select-option-group.component';
import { VariantPriceDetailComponent } from './components/variant-price-detail/variant-price-detail.component';
import { CollectionResolver } from './providers/routing/collection-resolver';
import { FacetResolver } from './providers/routing/facet-resolver';
import { ProductResolver } from './providers/routing/product-resolver';

@NgModule({
    imports: [SharedModule, RouterModule.forChild(catalogRoutes), DragDropModule],
    exports: [],
    declarations: [
        ProductListComponent,
        ProductDetailComponent,
        CreateOptionGroupDialogComponent,
        ProductVariantsWizardComponent,
        SelectOptionGroupDialogComponent,
        CreateOptionGroupFormComponent,
        SelectOptionGroupComponent,
        FacetListComponent,
        FacetDetailComponent,
        GenerateProductVariantsComponent,
        ProductVariantsListComponent,
        ApplyFacetDialogComponent,
        AssetListComponent,
        AssetGalleryComponent,
        ProductAssetsComponent,
        AssetPickerDialogComponent,
        AssetFileInputComponent,
        VariantPriceDetailComponent,
        CollectionListComponent,
        CollectionDetailComponent,
        CollectionTreeComponent,
        CollectionTreeNodeComponent,
        CollectionContentsComponent,
        ProductVariantsTableComponent,
        AssetPreviewComponent,
    ],
    entryComponents: [
        AssetPickerDialogComponent,
        CreateOptionGroupDialogComponent,
        SelectOptionGroupDialogComponent,
        ApplyFacetDialogComponent,
        AssetPreviewComponent,
    ],
    providers: [ProductResolver, FacetResolver, CollectionResolver],
})
export class CatalogModule {}
