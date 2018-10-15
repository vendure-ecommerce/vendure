import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { AdminDetailComponent } from './components/admin-detail/admin-detail.component';
import { AdministratorListComponent } from './components/administrator-list/administrator-list.component';
import { CountryDetailComponent } from './components/country-detail/country-detail.component';
import { CountryListComponent } from './components/country-list/country-list.component';
import { PermissionGridComponent } from './components/permission-grid/permission-grid.component';
import { RoleDetailComponent } from './components/role-detail/role-detail.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { TaxCategoryDetailComponent } from './components/tax-category-detail/tax-category-detail.component';
import { TaxCategoryListComponent } from './components/tax-category-list/tax-category-list.component';
import { TaxRateDetailComponent } from './components/tax-rate-detail/tax-rate-detail.component';
import { TaxRateListComponent } from './components/tax-rate-list/tax-rate-list.component';
import { ZoneSelectorDialogComponent } from './components/zone-selector-dialog/zone-selector-dialog.component';
import { AdministratorResolver } from './providers/routing/administrator-resolver';
import { CountryResolver } from './providers/routing/country-resolver';
import { RoleResolver } from './providers/routing/role-resolver';
import { TaxCategoryResolver } from './providers/routing/tax-category-resolver';
import { TaxRateResolver } from './providers/routing/tax-rate-resolver';
import { settingsRoutes } from './settings.routes';

@NgModule({
    imports: [SharedModule, RouterModule.forChild(settingsRoutes)],
    declarations: [
        TaxCategoryListComponent,
        TaxCategoryDetailComponent,
        AdministratorListComponent,
        RoleListComponent,
        RoleDetailComponent,
        AdminDetailComponent,
        PermissionGridComponent,
        CountryListComponent,
        CountryDetailComponent,
        ZoneSelectorDialogComponent,
        TaxRateListComponent,
        TaxRateDetailComponent,
    ],
    entryComponents: [ZoneSelectorDialogComponent],
    providers: [TaxCategoryResolver, AdministratorResolver, RoleResolver, CountryResolver, TaxRateResolver],
})
export class SettingsModule {}
