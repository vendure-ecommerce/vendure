import { RequestContext } from '../../api/common/request-context';
import { Channel, Order, Zone } from '../../entity';

import { TaxZoneStrategy } from './tax-zone-strategy';

/**
 * @description
 * A default method of determining Zone for tax calculations.
 *
 * @docsCategory tax
 */
export class DefaultTaxZoneStrategy implements TaxZoneStrategy {
    determineTaxZone(ctx: RequestContext, zones: Zone[], channel: Channel, order?: Order): Zone {
        return channel.defaultTaxZone;
    }
}
