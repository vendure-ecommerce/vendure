import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardModule } from '@vendure/admin-ui';

@NgModule({
    imports: [DashboardModule],
})
export class DashboardWrapperModule {}
