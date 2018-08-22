import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { catalogRoutes } from './catalog.routes';
import { CreateOptionGroupDialogComponent } from './components/create-option-group-dialog/create-option-group-dialog.component';
import { CreateOptionGroupFormComponent } from './components/create-option-group-form/create-option-group-form.component';
import { FacetListComponent } from './components/facet-list/facet-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductVariantsWizardComponent } from './components/product-variants-wizard/product-variants-wizard.component';
import { SelectOptionGroupDialogComponent } from './components/select-option-group-dialog/select-option-group-dialog.component';
import { SelectOptionGroupComponent } from './components/select-option-group/select-option-group.component';
import { ProductUpdaterService } from './providers/product-updater/product-updater.service';
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
    ],
    entryComponents: [CreateOptionGroupDialogComponent, SelectOptionGroupDialogComponent],
    providers: [ProductResolver, ProductUpdaterService],
})
export class CatalogModule {}
