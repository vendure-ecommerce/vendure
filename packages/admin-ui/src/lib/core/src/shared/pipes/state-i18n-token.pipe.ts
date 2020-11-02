import { Pipe, PipeTransform } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

@Pipe({
    name: 'stateI18nToken',
})
export class StateI18nTokenPipe implements PipeTransform {
    private readonly stateI18nTokens = {
        AddingItems: _('state.adding-items'),
        ArrangingPayment: _('state.arranging-payment'),
        PaymentAuthorized: _('state.payment-authorized'),
        PaymentSettled: _('state.payment-settled'),
        PartiallyShipped: _('state.partially-shipped'),
        Shipped: _('state.shipped'),
        PartiallyDelivered: _('state.partially-delivered'),
        Delivered: _('state.delivered'),
        Cancelled: _('state.cancelled'),
        Pending: _('state.pending'),
        Settled: _('state.settled'),
        Failed: _('state.failed'),
    };
    transform<T extends unknown>(value: T): T {
        if (typeof value === 'string') {
            const defaultStateToken = this.stateI18nTokens[value as any];
            if (defaultStateToken) {
                return defaultStateToken;
            }
            return ('state.' +
                value
                    .replace(/([a-z])([A-Z])/g, '$1-$2')
                    .replace(/ +/g, '-')
                    .toLowerCase()) as any;
        }
        return value;
    }
}
