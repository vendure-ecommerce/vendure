import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

@Component({
    selector: 'vdr-order-state-label',
    templateUrl: './order-state-label.component.html',
    styleUrls: ['./order-state-label.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderStateLabelComponent {
    @Input() state: string;
    private readonly stateI18nTokens = {
        AddingItems: _('order.state-adding-items'),
        ArrangingPayment: _('order.state-arranging-payment'),
        PaymentAuthorized: _('order.state-payment-authorized'),
        PaymentSettled: _('order.state-payment-settled'),
        PartiallyFulfilled: _('order.state-partially-fulfilled'),
        Fulfilled: _('order.state-fulfilled'),
        Cancelled: _('order.state-cancelled'),
    };

    get stateToken(): string {
        return this.stateI18nTokens[this.state as any] || this.state;
    }

    get chipColorType() {
        switch (this.state) {
            case 'PaymentAuthorized':
            case 'PaymentSettled':
            case 'PartiallyFulfilled':
                return 'warning';
            case 'Fulfilled':
                return 'success';
            case 'Cancelled':
                return 'error';
        }
    }
}
