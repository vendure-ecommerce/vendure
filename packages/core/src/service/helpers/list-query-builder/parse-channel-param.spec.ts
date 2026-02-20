import { fail } from 'assert';
import 'reflect-metadata';
import { describe, expect, it } from 'vitest';

import { VendureEntity } from '../../../entity/base/base.entity';

import { parseChannelParam } from './parse-channel-param';
import { MockConnection } from './parse-sort-params.spec';

class Channel extends VendureEntity {}
class Customer extends VendureEntity {}
class Product extends VendureEntity {}

describe('parseChannelParam()', () => {
    it('works with a channel-aware entity', () => {
        const connection = new MockConnection();
        connection.setRelations(Product, [{ propertyName: 'channels', type: Channel }]);
        const result = parseChannelParam(connection as any, Product, 123);
        if (!result) {
            fail('Result should be defined');
            return;
        }
        expect(result.clause).toEqual('product__channels.id = :channelId');
        expect(result.parameters).toEqual({ channelId: 123 });
    });

    it('returns undefined for a non-channel-aware entity', () => {
        const connection = new MockConnection();
        const result = parseChannelParam(connection as any, Customer, 123);
        expect(result).toBeUndefined();
    });
});
