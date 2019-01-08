import { Channel, Order, Zone } from '../../entity';

/**
 * Defines how the active Zone is determined for the purposes of calculating taxes.
 */
export interface TaxZoneStrategy {
    determineTaxZone(zones: Zone[], channel: Channel, order?: Order): Zone;
}
