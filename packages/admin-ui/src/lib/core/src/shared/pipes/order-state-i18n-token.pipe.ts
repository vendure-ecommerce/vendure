import { Pipe, PipeTransform } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

@Pipe({
    name: 'orderStateI18nToken',
})
export class OrderStateI18nTokenPipe implements PipeTransform {
    private readonly stateI18nTokens = {
        AddingItems: _('order.state-adding-items'),
        ArrangingPayment: _('order.state-arranging-payment'),
        PaymentAuthorized: _('order.state-payment-authorized'),
        PaymentSettled: _('order.state-payment-settled'),
        PartiallyDelivered: _('order.state-partially-delivered'),
        Delivered: _('order.state-delivered'),
        Cancelled: _('order.state-cancelled'),
    };
    transform<T extends unknown>(value: T): T {
        if (typeof value === 'string') {
            const defaultStateToken = this.stateI18nTokens[value as any];
            if (defaultStateToken) {
                return defaultStateToken;
            }
            return ('order.state-' +
                value
                    .replace(/([a-z])([A-Z])/g, '$1-$2')
                    .replace(/ +/g, '-')
                    .toLowerCase()) as any;
        }
        return value;
    }
}
