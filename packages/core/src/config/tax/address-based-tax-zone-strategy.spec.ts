import { RequestContext, Zone, Channel, Order } from '@vendure/core';
import { describe, it, expect } from 'vitest';

import { Logger } from '../logger/vendure-logger';

import { AddressBasedTaxZoneStrategy } from './address-based-tax-zone-strategy';

describe('AddressBasedTaxZoneStrategy', () => {
    const strategy = new AddressBasedTaxZoneStrategy();

    const ctx = {} as RequestContext;
    const defaultZone = { name: 'Default Zone' } as Zone;
    const channel = { defaultTaxZone: defaultZone } as Channel;

    const zones: Zone[] = [
        defaultZone,
        { name: 'US Zone', members: [{ code: 'US' }] } as Zone,
        { name: 'DE Zone', members: [{ code: 'DE' }] } as Zone,
    ];

    it('Determines zone based on billing address country', () => {
        const order = {
            billingAddress: { countryCode: 'US' },
            shippingAddress: { countryCode: 'DE' },
        } as Order;
        const result = strategy.determineTaxZone(ctx, zones, channel, order);
        expect(result.name).toBe('US Zone');
    });

    it('Determines zone based on shipping address if no billing address set', () => {
        const order = { shippingAddress: { countryCode: 'DE' } } as Order;
        const result = strategy.determineTaxZone(ctx, zones, channel, order);
        expect(result.name).toBe('DE Zone');
    });

    it('Returns the default zone if no matching zone is found', () => {
        const order = { billingAddress: { countryCode: 'FR' } } as Order;
        const result = strategy.determineTaxZone(ctx, zones, channel, order);
        expect(result.name).toBe('Default Zone');
    });

    it('Returns the default zone if no order is provided', () => {
        const result = strategy.determineTaxZone(ctx, zones, channel);
        expect(result.name).toBe('Default Zone');
    });

    it('Returns the default zone if no address is set on order', () => {
        const order = {} as Order;
        const result = strategy.determineTaxZone(ctx, zones, channel, order);
        expect(result.name).toBe('Default Zone');
    });
});
