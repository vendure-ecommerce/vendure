import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@vendure/admin-ui/core';

import { HealthCheckComponent } from './components/health-check/health-check.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { JobStateLabelComponent } from './components/job-state-label/job-state-label.component';
import { systemRoutes } from './system.routes';

@NgModule({
    declarations: [HealthCheckComponent, JobListComponent, JobStateLabelComponent],
    imports: [SharedModule, RouterModule.forChild(systemRoutes)],
})
export class SystemModule {}
