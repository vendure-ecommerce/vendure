import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { AdminDetailComponent } from './components/admin-detail/admin-detail.component';
import { AdministratorListComponent } from './components/administrator-list/administrator-list.component';
import { PermissionGridComponent } from './components/permission-grid/permission-grid.component';
import { RoleDetailComponent } from './components/role-detail/role-detail.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { TaxCategoryDetailComponent } from './components/tax-category-detail/tax-category-detail.component';
import { TaxCategoryListComponent } from './components/tax-category-list/tax-category-list.component';
import { AdministratorResolver } from './providers/routing/administrator-resolver';
import { RoleResolver } from './providers/routing/role-resolver';
import { TaxCategoryResolver } from './providers/routing/tax-category-resolver';
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
    ],
    providers: [TaxCategoryResolver, AdministratorResolver, RoleResolver],
})
export class SettingsModule {}
