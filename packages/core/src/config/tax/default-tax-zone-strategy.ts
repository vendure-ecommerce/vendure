import { Channel, Order, Zone } from '../../entity';

import { TaxZoneStrategy } from './tax-zone-strategy';

/**
 * @description
 * A default method of determining Zone for tax calculations.
 *
 * @docsCategory tax
 */
export class DefaultTaxZoneStrategy implements TaxZoneStrategy {
    determineTaxZone(zones: Zone[], channel: Channel, order?: Order): Zone {
        return channel.defaultTaxZone;
    }
}
