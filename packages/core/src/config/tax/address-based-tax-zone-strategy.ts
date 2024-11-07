import { RequestContext } from '../../api/common/request-context';
import { Channel, Order, Zone } from '../../entity';
import { Logger } from '../logger/vendure-logger';

import { TaxZoneStrategy } from './tax-zone-strategy';

const loggerCtx = 'AddressBasedTaxZoneStrategy';

/**
 * @description
 * Address based {@link TaxZoneStrategy} which tries to find the applicable {@link Zone} based on the
 * country of the billing address, or else the country of the shipping address of the Order.
 *
 * Returns the default {@link Channel}'s default tax zone if no applicable zone is found.
 *
 * @since 3.1.0
 *
 * :::info
 *
 * This is configured via `taxOptions.taxZoneStrategy = new AddressBasedTaxZoneStrategy()` in
 * your VendureConfig.
 *
 * :::
 *
 * @docsCategory tax
 */
export class AddressBasedTaxZoneStrategy implements TaxZoneStrategy {
    determineTaxZone(ctx: RequestContext, zones: Zone[], channel: Channel, order?: Order): Zone {
        const countryCode = order?.billingAddress?.countryCode ?? order?.shippingAddress?.countryCode;
        if (order && countryCode) {
            const zone = zones.find(z => z.members?.find(member => member.code === countryCode));
            if (zone) {
                return zone;
            }
            Logger.debug(
                `No tax zone found for country ${countryCode}. Returning default ${channel.defaultTaxZone.name} for order ${order.code}`,
                loggerCtx,
            );
        }
        return channel.defaultTaxZone;
    }
}
