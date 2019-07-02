import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyCode } from 'shared/generated-types';

import { OrderDetail } from '../../../common/generated-types';

@Component({
    selector: 'vdr-order-payment-detail',
    templateUrl: './order-payment-detail.component.html',
    styleUrls: ['./order-payment-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPaymentDetailComponent {
    @Input() payment: OrderDetail.Payments;
    @Input() currencyCode: CurrencyCode;
    @Output() settlePayment = new EventEmitter<OrderDetail.Payments>();
    @Output() settleRefund = new EventEmitter<OrderDetail.Refunds>();

    getPaymentMetadata(payment: OrderDetail.Payments) {
        return Object.entries(payment.metadata);
    }
}
