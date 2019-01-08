import { Channel, Order, Zone } from '../../entity';

import { TaxZoneStrategy } from './tax-zone-strategy';

export class DefaultTaxZoneStrategy implements TaxZoneStrategy {
    determineTaxZone(zones: Zone[], channel: Channel, order?: Order): Zone {
        return channel.defaultTaxZone;
    }
}
