import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyCode } from '@vendure/admin-ui/core';
import { OrderDetail } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-order-payment-card',
    templateUrl: './order-payment-card.component.html',
    styleUrls: ['./order-payment-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPaymentCardComponent {
    @Input() payment: OrderDetail.Payments;
    @Input() currencyCode: CurrencyCode;
    @Output() settlePayment = new EventEmitter<OrderDetail.Payments>();
    @Output() transitionPaymentState = new EventEmitter<{ payment: OrderDetail.Payments; state: string }>();
    @Output() settleRefund = new EventEmitter<OrderDetail.Refunds>();

    refundHasMetadata(refund?: OrderDetail.Refunds): boolean {
        return !!refund && Object.keys(refund.metadata).length > 0;
    }

    nextOtherStates(): string[] {
        if (!this.payment) {
            return [];
        }
        return this.payment.nextStates.filter(s => s !== 'Settled');
    }
}
