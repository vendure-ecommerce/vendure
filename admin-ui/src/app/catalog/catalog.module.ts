import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { catalogRoutes } from './catalog.routes';
import { ApplyFacetDialogComponent } from './components/apply-facet-dialog/apply-facet-dialog.component';
import { CreateOptionGroupDialogComponent } from './components/create-option-group-dialog/create-option-group-dialog.component';
import { CreateOptionGroupFormComponent } from './components/create-option-group-form/create-option-group-form.component';
import { FacetDetailComponent } from './components/facet-detail/facet-detail.component';
import { FacetListComponent } from './components/facet-list/facet-list.component';
import { FacetValueSelectorComponent } from './components/facet-value-selector/facet-value-selector.component';
import { GenerateProductVariantsComponent } from './components/generate-product-variants/generate-product-variants.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductVariantsListComponent } from './components/product-variants-list/product-variants-list.component';
import { ProductVariantsWizardComponent } from './components/product-variants-wizard/product-variants-wizard.component';
import { SelectOptionGroupDialogComponent } from './components/select-option-group-dialog/select-option-group-dialog.component';
import { SelectOptionGroupComponent } from './components/select-option-group/select-option-group.component';
import { FacetResolver } from './providers/routing/facet-resolver';
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
    ],
    entryComponents: [
        CreateOptionGroupDialogComponent,
        SelectOptionGroupDialogComponent,
        ApplyFacetDialogComponent,
    ],
    providers: [ProductResolver, FacetResolver],
})
export class CatalogModule {}
