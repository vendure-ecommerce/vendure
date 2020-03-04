import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CurrencyCode, OrderDetail } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-payment-detail',
    templateUrl: './payment-detail.component.html',
    styleUrls: ['./payment-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentDetailComponent {
    @Input() payment: OrderDetail.Payments;
    @Input() currencyCode: CurrencyCode;
}
