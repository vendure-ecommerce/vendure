import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { administratorRoutes } from './administrator.routes';
import { AdminDetailComponent } from './components/admin-detail/admin-detail.component';
import { AdministratorListComponent } from './components/administrator-list/administrator-list.component';
import { PermissionGridComponent } from './components/permission-grid/permission-grid.component';
import { RoleDetailComponent } from './components/role-detail/role-detail.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { AdministratorResolver } from './providers/routing/administrator-resolver';
import { RoleResolver } from './providers/routing/role-resolver';

@NgModule({
    imports: [SharedModule, RouterModule.forChild(administratorRoutes)],
    declarations: [
        AdministratorListComponent,
        RoleListComponent,
        RoleDetailComponent,
        AdminDetailComponent,
        PermissionGridComponent,
    ],
    providers: [AdministratorResolver, RoleResolver],
})
export class AdministratorModule {}
