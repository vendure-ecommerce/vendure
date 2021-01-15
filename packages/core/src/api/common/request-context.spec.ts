import { CurrencyCode, LanguageCode } from '@vendure/common/lib/generated-types';

import { CachedSession } from '../../config/session-cache/session-cache-strategy';
import { Channel } from '../../entity/channel/channel.entity';
import { Order } from '../../entity/order/order.entity';
import { User } from '../../entity/user/user.entity';
import { Zone } from '../../entity/zone/zone.entity';

import { RequestContext, SerializedRequestContext } from './request-context';

describe('RequestContext', () => {
    describe('serialize/deserialize', () => {
        let serializedCtx: SerializedRequestContext;
        let original: RequestContext;

        beforeAll(() => {
            original = createRequestContext();
            serializedCtx = original.serialize();
        });

        it('apiType', () => {
            const result = RequestContext.deserialize(serializedCtx);
            expect(result.apiType).toBe(original.apiType);
        });

        it('channelId', () => {
            const result = RequestContext.deserialize(serializedCtx);
            expect(result.channelId).toBe(original.channelId);
        });

        it('languageCode', () => {
            const result = RequestContext.deserialize(serializedCtx);
            expect(result.languageCode).toBe(original.languageCode);
        });

        it('activeUserId', () => {
            const result = RequestContext.deserialize(serializedCtx);
            expect(result.activeUserId).toBe(original.activeUserId);
        });

        it('isAuthorized', () => {
            const result = RequestContext.deserialize(serializedCtx);
            expect(result.isAuthorized).toBe(original.isAuthorized);
        });

        it('authorizedAsOwnerOnly', () => {
            const result = RequestContext.deserialize(serializedCtx);
            expect(result.authorizedAsOwnerOnly).toBe(original.authorizedAsOwnerOnly);
        });

        it('channel', () => {
            const result = RequestContext.deserialize(serializedCtx);
            expect(result.channel).toEqual(original.channel);
        });

        it('session', () => {
            const result = RequestContext.deserialize(serializedCtx);
            expect(result.session).toEqual(original.session);
        });
    });

    describe('copy', () => {
        let original: RequestContext;

        beforeAll(() => {
            original = createRequestContext();
        });

        it('is a RequestContext instance', () => {
            const copy = original.copy();
            expect(copy instanceof RequestContext).toBe(true);
        });

        it('is not identical to original', () => {
            const copy = original.copy();
            expect(copy === original).toBe(false);
        });

        it('getters work', () => {
            const copy = original.copy();

            expect(copy.apiType).toEqual(original.apiType);
            expect(copy.channelId).toEqual(original.channelId);
            expect(copy.languageCode).toEqual(original.languageCode);
            expect(copy.activeUserId).toEqual(original.activeUserId);
            expect(copy.isAuthorized).toEqual(original.isAuthorized);
            expect(copy.authorizedAsOwnerOnly).toEqual(original.authorizedAsOwnerOnly);
            expect(copy.channel).toEqual(original.channel);
            expect(copy.session).toEqual(original.session);
        });

        it('mutating copy leaves original intact', () => {
            const copy = original.copy();
            (copy as any).foo = 'bar';

            expect((copy as any).foo).toBe('bar');
            expect((original as any).foo).toBeUndefined();
        });

        it('mutating deep property affects both', () => {
            const copy = original.copy();
            copy.channel.code = 'changed';

            expect(copy.channel.code).toBe('changed');
            expect(original.channel.code).toBe('changed');
        });
    });

    function createRequestContext() {
        let session: CachedSession;
        let channel: Channel;
        let activeOrder: Order;
        let zone: Zone;
        activeOrder = new Order({
            id: '55555',
            active: true,
            code: 'ADAWDJAWD',
        });
        session = {
            cacheExpiry: Number.MAX_SAFE_INTEGER,
            expires: new Date(),
            id: '1234',
            token: '2d37187e9e8fc47807fe4f58ca',
            activeOrderId: '123',
            user: {
                id: '8833774',
                identifier: 'user',
                verified: true,
                channelPermissions: [],
            },
        };
        zone = new Zone({
            id: '62626',
            name: 'Europe',
        });
        channel = new Channel({
            token: 'oiajwodij09au3r',
            id: '995859',
            code: '__default_channel__',
            currencyCode: CurrencyCode.EUR,
            pricesIncludeTax: true,
            defaultLanguageCode: LanguageCode.en,
            defaultShippingZone: zone,
            defaultTaxZone: zone,
        });
        return new RequestContext({
            apiType: 'admin',
            languageCode: LanguageCode.en,
            channel,
            session,
            isAuthorized: true,
            authorizedAsOwnerOnly: false,
        });
    }
});
