import { Route } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

import { HealthCheckComponent } from './components/health-check/health-check.component';
import { JobListComponent } from './components/job-list/job-list.component';

export const systemRoutes: Route[] = [
    {
        path: 'jobs',
        component: JobListComponent,
        data: {
            breadcrumb: _('breadcrumb.job-queue'),
        },
    },
    {
        path: 'system-status',
        component: HealthCheckComponent,
        data: {
            breadcrumb: _('breadcrumb.system-status'),
        },
    },
];
