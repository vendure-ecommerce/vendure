import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { catalogRoutes } from './catalog.routes';
import { ApplyFacetDialogComponent } from './components/apply-facet-dialog/apply-facet-dialog.component';
import { AssetFileInputComponent } from './components/asset-file-input/asset-file-input.component';
import { AssetGalleryComponent } from './components/asset-gallery/asset-gallery.component';
import { AssetListComponent } from './components/asset-list/asset-list.component';
import { AssetPickerDialogComponent } from './components/asset-picker-dialog/asset-picker-dialog.component';
import { CreateOptionGroupDialogComponent } from './components/create-option-group-dialog/create-option-group-dialog.component';
import { CreateOptionGroupFormComponent } from './components/create-option-group-form/create-option-group-form.component';
import { FacetDetailComponent } from './components/facet-detail/facet-detail.component';
import { FacetListComponent } from './components/facet-list/facet-list.component';
import { FacetValueSelectorComponent } from './components/facet-value-selector/facet-value-selector.component';
import { GenerateProductVariantsComponent } from './components/generate-product-variants/generate-product-variants.component';
import { ProductAssetsComponent } from './components/product-assets/product-assets.component';
import { ProductCategoryDetailComponent } from './components/product-category-detail/product-category-detail.component';
import { ProductCategoryListComponent } from './components/product-category-list/product-category-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductVariantsListComponent } from './components/product-variants-list/product-variants-list.component';
import { ProductVariantsWizardComponent } from './components/product-variants-wizard/product-variants-wizard.component';
import { SelectOptionGroupDialogComponent } from './components/select-option-group-dialog/select-option-group-dialog.component';
import { SelectOptionGroupComponent } from './components/select-option-group/select-option-group.component';
import { VariantPriceDetailComponent } from './components/variant-price-detail/variant-price-detail.component';
import { FacetResolver } from './providers/routing/facet-resolver';
import { ProductCategoryResolver } from './providers/routing/product-category-resolver';
import { ProductResolver } from './providers/routing/product-resolver';

@NgModule({
    imports: [SharedModule, RouterModule.forChild(catalogRoutes)],
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
        FacetValueSelectorComponent,
        ApplyFacetDialogComponent,
        AssetListComponent,
        AssetGalleryComponent,
        ProductAssetsComponent,
        AssetPickerDialogComponent,
        AssetFileInputComponent,
        VariantPriceDetailComponent,
        ProductCategoryListComponent,
        ProductCategoryDetailComponent,
    ],
    entryComponents: [
        AssetPickerDialogComponent,
        CreateOptionGroupDialogComponent,
        SelectOptionGroupDialogComponent,
        ApplyFacetDialogComponent,
    ],
    providers: [ProductResolver, FacetResolver, ProductCategoryResolver],
})
export class CatalogModule {}
