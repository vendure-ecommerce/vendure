import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    DeletionResult,
    GetPaymentMethodList,
    ModalService,
    NotificationService,
} from '@vendure/admin-ui/core';
import { EMPTY } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
    selector: 'vdr-payment-method-list',
    templateUrl: './payment-method-list.component.html',
    styleUrls: ['./payment-method-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodListComponent extends BaseListComponent<
    GetPaymentMethodList.Query,
    GetPaymentMethodList.Items
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
            (...args: any[]) => this.dataService.settings.getPaymentMethods(...args).refetchOnChannelChange(),
            data => data.paymentMethods,
        );
    }

    deletePaymentMethod(paymentMethodId: string) {
        this.showModalAndDelete(paymentMethodId)
            .pipe(
                switchMap(response => {
                    if (response.result === DeletionResult.DELETED) {
                        return [true];
                    } else {
                        return this.showModalAndDelete(paymentMethodId, response.message || '').pipe(
                            map(r => r.result === DeletionResult.DELETED),
                        );
                    }
                }),
                // Refresh the cached facets to reflect the changes
                switchMap(() => this.dataService.settings.getPaymentMethods(100).single$),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'PaymentMethod',
                    });
                    this.refresh();
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'PaymentMethod',
                    });
                },
            );
    }

    private showModalAndDelete(paymentMethodId: string, message?: string) {
        return this.modalService
            .dialog({
                title: _('settings.confirm-delete-payment-method'),
                body: message,
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap(res =>
                    res ? this.dataService.settings.deletePaymentMethod(paymentMethodId, !!message) : EMPTY,
                ),
                map(res => res.deletePaymentMethod),
            );
    }
}
