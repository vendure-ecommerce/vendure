import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { BaseListComponent } from '../../../common/base-list.component';
import { GetShippingMethodList } from '../../../common/generated-types';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { ModalService } from '../../../shared/providers/modal/modal.service';

@Component({
    selector: 'vdr-shipping-method-list',
    templateUrl: './shipping-method-list.component.html',
    styleUrls: ['./shipping-method-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingMethodListComponent extends BaseListComponent<
    GetShippingMethodList.Query,
    GetShippingMethodList.Items
> {
    constructor(
        private modalService: ModalService,
        private notificationService: NotificationService,
        private dataService: DataService,
        router: Router,
        route: ActivatedRoute,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.shippingMethod.getShippingMethods(...args),
            data => data.shippingMethods,
        );
    }

    deleteShippingMethod(id: string) {
        this.modalService
            .dialog({
                title: _('catalog.confirm-delete-shipping-method'),
                buttons: [
                    { type: 'seconday', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap(response =>
                    response ? this.dataService.shippingMethod.deleteShippingMethod(id) : EMPTY,
                ),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'ShippingMethod',
                    });
                    this.refresh();
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'ShippingMethod',
                    });
                },
            );
    }
}
