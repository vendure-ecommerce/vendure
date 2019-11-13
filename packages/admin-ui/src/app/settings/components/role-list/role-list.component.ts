import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CUSTOMER_ROLE_CODE, SUPER_ADMIN_ROLE_CODE } from 'shared/shared-constants';

import { BaseListComponent } from '../../../common/base-list.component';
import { GetRoles, Role } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-role-list',
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleListComponent extends BaseListComponent<GetRoles.Query, GetRoles.Items> {
    readonly initialLimit = 3;
    displayLimit: { [id: string]: number } = {};

    constructor(private dataService: DataService, router: Router, route: ActivatedRoute) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.administrator.getRoles(...args),
            data => data.roles,
        );
    }

    toggleDisplayLimit(role: GetRoles.Items) {
        if (this.displayLimit[role.id] === role.permissions.length) {
            this.displayLimit[role.id] = this.initialLimit;
        } else {
            this.displayLimit[role.id] = role.permissions.length;
        }
    }

    isDefaultRole(role: Role): boolean {
        return role.code === SUPER_ADMIN_ROLE_CODE || role.code === CUSTOMER_ROLE_CODE;
    }
}
