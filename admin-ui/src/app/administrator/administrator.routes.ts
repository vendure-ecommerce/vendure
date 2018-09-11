import { Route } from '@angular/router';
import { Administrator, Role } from 'shared/generated-types';

import { createResolveData } from '../common/base-entity-resolver';
import { detailBreadcrumb } from '../common/detail-breadcrumb';
import { _ } from '../core/providers/i18n/mark-for-extraction';

import { AdminDetailComponent } from './components/admin-detail/admin-detail.component';
import { AdministratorListComponent } from './components/administrator-list/administrator-list.component';
import { RoleDetailComponent } from './components/role-detail/role-detail.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { AdministratorResolver } from './providers/routing/administrator-resolver';
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
        path: 'administrators/:id',
        component: AdminDetailComponent,
        resolve: createResolveData(AdministratorResolver),
        data: { breadcrumb: administratorBreadcrumb },
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

export function administratorBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<Administrator>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.administrators',
        getName: admin => `${admin.firstName} ${admin.lastName}`,
        route: 'administrators',
    });
}

export function roleBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<Role>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.roles',
        getName: role => role.description,
        route: 'roles',
    });
}
