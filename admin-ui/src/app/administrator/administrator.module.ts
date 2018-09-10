import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { administratorRoutes } from './administrator.routes';
import { AdministratorListComponent } from './components/administrator-list/administrator-list.component';
import { RoleDetailComponent } from './components/role-detail/role-detail.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { RoleResolver } from './providers/routing/role-resolver';

@NgModule({
    imports: [SharedModule, RouterModule.forChild(administratorRoutes)],
    declarations: [AdministratorListComponent, RoleListComponent, RoleDetailComponent],
    providers: [RoleResolver],
})
export class AdministratorModule {}
