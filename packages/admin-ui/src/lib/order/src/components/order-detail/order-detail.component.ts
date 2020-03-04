import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { omit } from '@vendure/common/lib/omit';
import { Observable, of, Subject } from 'rxjs';
import { startWith, switchMap, take } from 'rxjs/operators';

import { BaseDetailComponent } from '@vendure/admin-ui/core';
import {
    AdjustmentType,
    CustomFieldConfig,
    GetOrderHistory,
    Order,
    OrderDetail,
    SortOrder,
} from '@vendure/admin-ui/core';
import { NotificationService } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';
import { ServerConfigService } from '@vendure/admin-ui/core';
import { ModalService } from '@vendure/admin-ui/core';
import { CancelOrderDialogComponent } from '../cancel-order-dialog/cancel-order-dialog.component';
import { FulfillOrderDialogComponent } from '../fulfill-order-dialog/fulfill-order-dialog.component';
import { RefundOrderDialogComponent } from '../refund-order-dialog/refund-order-dialog.component';
import { SettleRefundDialogComponent } from '../settle-refund-dialog/settle-refund-dialog.component';

@Component({
    selector: 'vdr-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailComponent extends BaseDetailComponent<OrderDetail.Fragment>
    implements OnInit, OnDestroy {
    detailForm = new FormGroup({});
    history$: Observable<GetOrderHistory.Items[] | null>;
    fetchHistory = new Subject<void>();
    customFields: CustomFieldConfig[];
    orderLineCustomFields: CustomFieldConfig[];
    orderLineCustomFieldsVisible = false;
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

    get visibileOrderLineCustomFields(): CustomFieldConfig[] {
        return this.orderLineCustomFieldsVisible ? this.orderLineCustomFields : [];
    }

    get showElided(): boolean {
        return !this.orderLineCustomFieldsVisible && 0 < this.orderLineCustomFields.length;
    }

    ngOnInit() {
        this.init();
        this.customFields = this.getCustomFieldConfig('Order');
        this.orderLineCustomFields = this.getCustomFieldConfig('OrderLine');
        this.orderLineCustomFieldsVisible = this.orderLineCustomFields.length < 2;
        this.history$ = this.fetchHistory.pipe(
            startWith(null),
            switchMap(() => {
                return this.dataService.order
                    .getOrderHistory(this.id, {
                        sort: {
                            createdAt: SortOrder.DESC,
                        },
                    })
                    .mapStream(data => data.order && data.order.history.items);
            }),
        );
    }

    ngOnDestroy() {
        this.destroy();
    }

    toggleOrderLineCustomFields() {
        this.orderLineCustomFieldsVisible = !this.orderLineCustomFieldsVisible;
    }

    getLinePromotions(line: OrderDetail.Lines) {
        return line.adjustments.filter(a => a.type === AdjustmentType.PROMOTION);
    }

    getPromotionLink(promotion: OrderDetail.Adjustments): any[] {
        const id = promotion.adjustmentSource.split(':')[1];
        return ['/marketing', 'promotions', id];
    }

    getCouponCodeForAdjustment(
        order: OrderDetail.Fragment,
        promotionAdjustment: OrderDetail.Adjustments,
    ): string | undefined {
        const id = promotionAdjustment.adjustmentSource.split(':')[1];
        const promotion = order.promotions.find(p => p.id === id);
        if (promotion) {
            return promotion.couponCode || undefined;
        }
    }

    getShippingAddressLines(shippingAddress?: { [key: string]: string }): string[] {
        if (!shippingAddress) {
            return [];
        }
        return Object.values(shippingAddress)
            .filter(val => val !== 'OrderAddress')
            .filter(line => !!line);
    }

    settlePayment(payment: OrderDetail.Payments) {
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
                switchMap(result => this.refetchOrder(result)),
            )
            .subscribe(result => {
                if (result) {
                    this.notificationService.success(_('order.create-fulfillment-success'));
                }
            });
    }

    cancelOrRefund(order: OrderDetail.Fragment) {
        if (order.state === 'PaymentAuthorized' || order.active === true) {
            this.cancelOrder(order);
        } else {
            this.refundOrder(order);
        }
    }

    settleRefund(refund: OrderDetail.Refunds) {
        this.modalService
            .fromComponent(SettleRefundDialogComponent, {
                size: 'md',
                locals: {
                    refund,
                },
            })
            .pipe(
                switchMap(transactionId => {
                    if (transactionId) {
                        return this.dataService.order.settleRefund(
                            {
                                transactionId,
                                id: refund.id,
                            },
                            this.id,
                        );
                    } else {
                        return of(undefined);
                    }
                }),
                // switchMap(result => this.refetchOrder(result)),
            )
            .subscribe(result => {
                if (result) {
                    this.notificationService.success(_('order.settle-refund-success'));
                }
            });
    }

    addNote(event: { note: string; isPublic: boolean }) {
        const { note, isPublic } = event;
        this.dataService.order
            .addNoteToOrder({
                id: this.id,
                note,
                isPublic,
            })
            .pipe(switchMap(result => this.refetchOrder(result)))
            .subscribe(result => {
                this.notificationService.success(_('order.add-note-success'));
            });
    }

    private cancelOrder(order: OrderDetail.Fragment) {
        this.modalService
            .fromComponent(CancelOrderDialogComponent, {
                size: 'xl',
                locals: {
                    order,
                },
            })
            .pipe(
                switchMap(input => {
                    if (input) {
                        return this.dataService.order.cancelOrder(input);
                    } else {
                        return of(undefined);
                    }
                }),
                switchMap(result => this.refetchOrder(result)),
            )
            .subscribe(result => {
                if (result) {
                    this.notificationService.success(_('order.cancelled-order-success'));
                }
            });
    }

    private refundOrder(order: OrderDetail.Fragment) {
        this.modalService
            .fromComponent(RefundOrderDialogComponent, {
                size: 'xl',
                locals: {
                    order,
                },
            })
            .pipe(
                switchMap(input => {
                    if (input) {
                        return this.dataService.order.refundOrder(omit(input, ['cancel'])).pipe(
                            switchMap(result => {
                                if (input.cancel.length) {
                                    return this.dataService.order.cancelOrder({
                                        orderId: this.id,
                                        lines: input.cancel,
                                        reason: input.reason,
                                    });
                                } else {
                                    return of(result);
                                }
                            }),
                        );
                    } else {
                        return of(undefined);
                    }
                }),
                switchMap(result => this.refetchOrder(result)),
            )
            .subscribe(result => {
                if (result) {
                    this.notificationService.success(_('order.refund-order-success'));
                }
            });
    }

    private refetchOrder(result: object | undefined) {
        this.fetchHistory.next();
        if (result) {
            return this.dataService.order.getOrder(this.id).single$;
        } else {
            return of(undefined);
        }
    }

    protected setFormValues(entity: Order.Fragment): void {
        // empty
    }
}
