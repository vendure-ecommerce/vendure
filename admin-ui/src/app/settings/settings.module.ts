import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { TaxCategoryDetailComponent } from './components/tax-category-detail/tax-category-detail.component';
import { TaxCategoryListComponent } from './components/tax-category-list/tax-category-list.component';
import { TaxCategoryResolver } from './providers/routing/tax-category-resolver';
import { settingsRoutes } from './settings.routes';

@NgModule({
    imports: [SharedModule, RouterModule.forChild(settingsRoutes)],
    declarations: [TaxCategoryListComponent, TaxCategoryDetailComponent],
    providers: [TaxCategoryResolver],
})
export class SettingsModule {}
