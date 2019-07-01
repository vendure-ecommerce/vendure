import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyCode } from 'shared/generated-types';

import { OrderWithLines } from '../../../common/generated-types';

@Component({
    selector: 'vdr-order-payment-detail',
    templateUrl: './order-payment-detail.component.html',
    styleUrls: ['./order-payment-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPaymentDetailComponent {
    @Input() payment: OrderWithLines.Payments;
    @Input() currencyCode: CurrencyCode;
    @Output() settlePayment = new EventEmitter<OrderWithLines.Payments>();
    @Output() settleRefund = new EventEmitter<OrderWithLines.Refunds>();

    getPaymentMetadata(payment: OrderWithLines.Payments) {
        return Object.entries(payment.metadata);
    }
}
