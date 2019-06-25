import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { _ } from 'src/app/core/providers/i18n/mark-for-extraction';

import { BaseDetailComponent } from '../../../common/base-detail.component';
import { Order, OrderWithLines } from '../../../common/generated-types';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { ServerConfigService } from '../../../data/server-config';
import { ModalService } from '../../../shared/providers/modal/modal.service';
import { FulfillOrderDialogComponent } from '../fulfill-order-dialog/fulfill-order-dialog.component';

@Component({
    selector: 'vdr-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailComponent extends BaseDetailComponent<OrderWithLines.Fragment>
    implements OnInit, OnDestroy {
    detailForm = new FormGroup({});
    constructor(
        router: Router,
        route: ActivatedRoute,
        serverConfigService: ServerConfigService,
        private changeDetector: ChangeDetectorRef,
        private dataService: DataService,
        private notificationService: NotificationService,
        private modalService: ModalService,
    ) {
        super(route, router, serverConfigService);
    }

    ngOnInit() {
        this.init();
    }

    ngOnDestroy() {
        this.destroy();
    }

    getShippingAddressLines(shippingAddress?: { [key: string]: string }): string[] {
        if (!shippingAddress) {
            return [];
        }
        return Object.values(shippingAddress)
            .filter(val => val !== 'OrderAddress')
            .filter(line => !!line);
    }

    getPaymentMetadata(payment: OrderWithLines.Payments) {
        return Object.entries(payment.metadata);
    }

    settlePayment(payment: OrderWithLines.Payments) {
        this.dataService.order.settlePayment(payment.id).subscribe(({ settlePayment }) => {
            if (settlePayment) {
                if (settlePayment.state === 'Settled') {
                    this.notificationService.success(_('order.settle-payment-success'));
                } else {
                    this.notificationService.error(_('order.settle-payment-error'));
                }
                this.dataService.order.getOrder(this.id).single$.subscribe();
            }
        });
    }

    fulfillOrder() {
        this.entity$
            .pipe(
                take(1),
                switchMap(order => {
                    return this.modalService.fromComponent(FulfillOrderDialogComponent, {
                        size: 'xl',
                        locals: {
                            order,
                        },
                    });
                }),
                switchMap(input => {
                    if (input) {
                        return this.dataService.order.createFullfillment(input);
                    } else {
                        return of(undefined);
                    }
                }),
                switchMap(result => {
                    if (result) {
                        return this.dataService.order.getOrder(this.id).single$;
                    } else {
                        return of(undefined);
                    }
                }),
            )
            .subscribe(result => {
                if (result) {
                    this.notificationService.success(_('order.create-fulfillment-success'));
                }
            });
    }

    protected setFormValues(entity: Order.Fragment): void {
        // empty
    }
}
