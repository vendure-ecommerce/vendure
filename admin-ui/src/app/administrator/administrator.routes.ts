import { Route } from '@angular/router';
import { Role } from 'shared/generated-types';

import { createResolveData } from '../common/base-entity-resolver';
import { detailBreadcrumb } from '../common/detail-breadcrumb';
import { _ } from '../core/providers/i18n/mark-for-extraction';

import { AdministratorListComponent } from './components/administrator-list/administrator-list.component';
import { RoleDetailComponent } from './components/role-detail/role-detail.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { RoleResolver } from './providers/routing/role-resolver';

export const administratorRoutes: Route[] = [
    {
        path: 'administrators',
        component: AdministratorListComponent,
        data: {
            breadcrumb: _('breadcrumb.administrators'),
        },
    },
    {
        path: 'roles',
        component: RoleListComponent,
        data: {
            breadcrumb: _('breadcrumb.roles'),
        },
    },
    {
        path: 'roles/:id',
        component: RoleDetailComponent,
        resolve: createResolveData(RoleResolver),
        data: { breadcrumb: roleBreadcrumb },
    },
];

export function roleBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<Role>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.roles',
        getName: product => product.description,
        route: 'roles',
    });
}
