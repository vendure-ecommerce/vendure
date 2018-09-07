import { Route } from '@angular/router';

import { _ } from '../core/providers/i18n/mark-for-extraction';

import { AdministratorListComponent } from './components/administrator-list/administrator-list.component';

export const administratorRoutes: Route[] = [
    {
        path: 'administrators',
        component: AdministratorListComponent,
        data: {
            breadcrumb: _('breadcrumb.administrators'),
        },
    },
];
