import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { dashboardRoutes } from './dashboard.routes';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(dashboardRoutes),
    ],
    declarations: [DashboardComponent],
})
export class DashboardModule { }
