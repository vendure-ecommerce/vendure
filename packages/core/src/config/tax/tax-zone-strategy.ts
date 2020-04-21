import { Channel, Order, Zone } from '../../entity';

/**
 * @description
 * Defines how the active {@link Zone} is determined for the purposes of calculating taxes.
 *
 * @docsCategory tax
 */
export interface TaxZoneStrategy {
    determineTaxZone(zones: Zone[], channel: Channel, order?: Order): Zone | undefined;
}
