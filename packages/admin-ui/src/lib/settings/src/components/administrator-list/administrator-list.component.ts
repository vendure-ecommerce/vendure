import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    GetAdministrators,
    ModalService,
    NotificationService,
} from '@vendure/admin-ui/core';
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'vdr-administrator-list',
    templateUrl: './administrator-list.component.html',
    styleUrls: ['./administrator-list.component.scss'],
})
export class AdministratorListComponent extends BaseListComponent<
    GetAdministrators.Query,
    GetAdministrators.Items
> {
    constructor(
        private dataService: DataService,
        router: Router,
        route: ActivatedRoute,
        private modalService: ModalService,
        private notificationService: NotificationService,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.administrator.getAdministrators(...args),
            (data) => data.administrators,
        );
    }

    deleteAdministrator(administrator: GetAdministrators.Items) {
        return this.modalService
            .dialog({
                title: _('catalog.confirm-delete-administrator'),
                body: `${administrator.firstName} ${administrator.lastName}`,
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap((res) =>
                    res ? this.dataService.administrator.deleteAdministrator(administrator.id) : EMPTY,
                ),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'Administrator',
                    });
                    this.refresh();
                },
                (err) => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'Administrator',
                    });
                },
            );
    }
}
