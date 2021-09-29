import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    CancelOrderInput,
    Dialog,
    I18nService,
    OrderDetail,
    OrderDetailFragment,
    OrderLineInput,
    RefundOrderInput,
} from '@vendure/admin-ui/core';
import { summate } from '@vendure/common/lib/shared-utils';

type SelectionLine = { quantity: number; refund: boolean; cancel: boolean };

@Component({
    selector: 'vdr-refund-order-dialog',
    templateUrl: './refund-order-dialog.component.html',
    styleUrls: ['./refund-order-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundOrderDialogComponent
    implements OnInit, Dialog<{ cancel: CancelOrderInput; refund: RefundOrderInput }> {
    order: OrderDetailFragment;
    resolveWith: (result?: { cancel: CancelOrderInput; refund: RefundOrderInput }) => void;
    reason: string;
    settledPayments: OrderDetail.Payments[];
    selectedPayment: OrderDetail.Payments;
    lineQuantities: { [lineId: string]: SelectionLine } = {};
    refundShipping = false;
    adjustment = 0;
    reasons: string[] = [_('order.refund-reason-customer-request'), _('order.refund-reason-not-available')];

    constructor(private i18nService: I18nService) {
        this.reasons = this.reasons.map(r => this.i18nService.translate(r));
    }

    get refundTotal(): number {
        const itemTotal = this.order.lines.reduce((total, line) => {
            const lineRef = this.lineQuantities[line.id];
            const refundCount = (lineRef.refund && lineRef.quantity) || 0;
            return total + line.proratedUnitPriceWithTax * refundCount;
        }, 0);
        return itemTotal + (this.refundShipping ? this.order.shippingWithTax : 0) + this.adjustment;
    }

    get settledPaymentsTotal(): number {
        return this.settledPayments
            .map(payment => {
                const paymentTotal = payment.amount;
                const alreadyRefundedTotal = summate(
                    payment.refunds.filter(r => r.state !== 'Failed') as Array<Required<OrderDetail.Refunds>>,
                    'total',
                );
                return paymentTotal - alreadyRefundedTotal;
            })
            .reduce((sum, amount) => sum + amount, 0);
    }

    lineCanBeRefundedOrCancelled(line: OrderDetail.Lines): boolean {
        const refunds =
            this.order.payments?.reduce(
                (all, payment) => [...all, ...payment.refunds],
                [] as OrderDetail.Refunds[],
            ) ?? [];

        const refundable = line.items.filter(i => {
            if (i.cancelled) {
                return false;
            }
            if (i.refundId == null) {
                return true;
            }
            const refund = refunds.find(r => r.id === i.refundId);
            return refund?.state === 'Failed';
        });
        return 0 < refundable.length;
    }

    ngOnInit() {
        this.lineQuantities = this.order.lines.reduce((result, line) => {
            return {
                ...result,
                [line.id]: {
                    quantity: 0,
                    refund: false,
                    cancel: false,
                },
            };
        }, {});
        this.settledPayments = (this.order.payments || []).filter(p => p.state === 'Settled');
        if (this.settledPayments.length) {
            this.selectedPayment = this.settledPayments[0];
        }
    }

    handleZeroQuantity(line?: SelectionLine) {
        if (line?.quantity === 0) {
            line.cancel = false;
            line.refund = false;
        }
    }

    isRefunding(): boolean {
        const result = Object.values(this.lineQuantities).reduce((isRefunding, line) => {
            return isRefunding || (0 < line.quantity && line.refund);
        }, false);
        return result;
    }

    isCancelling(): boolean {
        const result = Object.values(this.lineQuantities).reduce((isCancelling, line) => {
            return isCancelling || (0 < line.quantity && line.cancel);
        }, false);
        return result;
    }

    canSubmit(): boolean {
        if (this.isRefunding()) {
            return !!(
                this.selectedPayment &&
                this.reason &&
                0 < this.refundTotal &&
                this.refundTotal <= this.settledPaymentsTotal
            );
        } else if (this.isCancelling()) {
            return !!this.reason;
        }
        return false;
    }

    select() {
        const payment = this.selectedPayment;
        if (payment) {
            const refundLines = this.getOrderLineInput(line => line.refund);
            const cancelLines = this.getOrderLineInput(line => line.cancel);

            this.resolveWith({
                refund: {
                    lines: refundLines,
                    reason: this.reason,
                    shipping: this.refundShipping ? this.order.shippingWithTax : 0,
                    adjustment: this.adjustment,
                    paymentId: payment.id,
                },
                cancel: {
                    lines: cancelLines,
                    orderId: this.order.id,
                    reason: this.reason,
                },
            });
        }
    }

    cancel() {
        this.resolveWith();
    }

    private getOrderLineInput(filterFn: (line: SelectionLine) => boolean): OrderLineInput[] {
        return Object.entries(this.lineQuantities)
            .filter(([orderLineId, line]) => 0 < line.quantity && filterFn(line))
            .map(([orderLineId, line]) => ({
                orderLineId,
                quantity: line.quantity,
            }));
    }
}
