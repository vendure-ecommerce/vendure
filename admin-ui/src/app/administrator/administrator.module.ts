import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { administratorRoutes } from './administrator.routes';
import { AdministratorListComponent } from './components/administrator-list/administrator-list.component';

@NgModule({
    imports: [SharedModule, RouterModule.forChild(administratorRoutes)],
    declarations: [AdministratorListComponent],
})
export class AdministratorModule {}
