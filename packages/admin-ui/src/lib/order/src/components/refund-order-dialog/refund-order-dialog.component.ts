import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Dialog, I18nService, OrderDetail, OrderDetailFragment, OrderLineInput, RefundOrderInput } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-refund-order-dialog',
    templateUrl: './refund-order-dialog.component.html',
    styleUrls: ['./refund-order-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundOrderDialogComponent
    implements OnInit, Dialog<RefundOrderInput & { cancel: OrderLineInput[] }> {
    order: OrderDetailFragment;
    resolveWith: (result?: RefundOrderInput & { cancel: OrderLineInput[] }) => void;
    reason: string;
    settledPayments: OrderDetail.Payments[];
    selectedPayment: OrderDetail.Payments;
    lineQuantities: { [lineId: string]: { quantity: number; cancel: boolean } } = {};
    refundShipping = false;
    adjustment = 0;
    reasons: string[] = [_('order.refund-reason-customer-request'), _('order.refund-reason-not-available')];

    constructor(private i18nService: I18nService) {
        this.reasons = this.reasons.map(r => this.i18nService.translate(r));
    }

    get refundTotal(): number {
        const itemTotal = this.order.lines.reduce((total, line) => {
            return total + line.unitPriceWithTax * (this.lineQuantities[line.id].quantity || 0);
        }, 0);
        return itemTotal + (this.refundShipping ? this.order.shipping : 0) + this.adjustment;
    }

    lineCanBeRefunded(line: OrderDetail.Lines): boolean {
        return 0 < line.items.filter(i => i.refundId == null && !i.cancelled).length;
    }

    ngOnInit() {
        this.lineQuantities = this.order.lines.reduce((result, line) => {
            return {
                ...result,
                [line.id]: {
                    quantity: 0,
                    cancel: false,
                },
            };
        }, {});
        this.settledPayments = (this.order.payments || []).filter(p => p.state === 'Settled');
        if (this.settledPayments.length) {
            this.selectedPayment = this.settledPayments[0];
        }
    }

    select() {
        const payment = this.selectedPayment;
        if (payment) {
            const lines = Object.entries(this.lineQuantities)
                .map(([orderLineId, data]) => ({
                    orderLineId,
                    quantity: data.quantity,
                }))
                .filter(l => 0 < l.quantity);
            const cancel = Object.entries(this.lineQuantities)
                .filter(([orderLineId, data]) => data.cancel)
                .map(([orderLineId, data]) => ({
                    orderLineId,
                    quantity: data.quantity,
                }));
            this.resolveWith({
                lines,
                cancel,
                reason: this.reason,
                shipping: this.refundShipping ? this.order.shipping : 0,
                adjustment: this.adjustment,
                paymentId: payment.id,
            });
        }
    }

    cancel() {
        this.resolveWith();
    }
}
