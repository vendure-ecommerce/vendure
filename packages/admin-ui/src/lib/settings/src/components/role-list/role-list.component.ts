import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { CUSTOMER_ROLE_CODE, SUPER_ADMIN_ROLE_CODE } from '@vendure/common/lib/shared-constants';
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { BaseListComponent } from '@vendure/admin-ui/core';
import { GetRoles, Role } from '@vendure/admin-ui/core';
import { NotificationService } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';
import { ModalService } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-role-list',
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleListComponent extends BaseListComponent<GetRoles.Query, GetRoles.Items> {
    readonly initialLimit = 3;
    displayLimit: { [id: string]: number } = {};

    constructor(
        private modalService: ModalService,
        private notificationService: NotificationService,
        private dataService: DataService,
        router: Router,
        route: ActivatedRoute,
    ) {
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

    deleteRole(id: string) {
        this.modalService
            .dialog({
                title: _('settings.confirm-delete-role'),
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(switchMap(response => (response ? this.dataService.administrator.deleteRole(id) : EMPTY)))
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'Role',
                    });
                    this.refresh();
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'Role',
                    });
                },
            );
    }
}
