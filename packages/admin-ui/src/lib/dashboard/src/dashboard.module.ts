import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@vendure/admin-ui/core';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { dashboardRoutes } from './dashboard.routes';

@NgModule({
    imports: [SharedModule, RouterModule.forChild(dashboardRoutes)],
    declarations: [DashboardComponent],
})
export class DashboardModule {}
