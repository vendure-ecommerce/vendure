import { RequestContext } from '../api';

import { RequestContextCacheService } from './request-context-cache.service';

describe('Request context cache', () => {
    let cache: RequestContextCacheService;
    beforeEach(() => {
        cache = new RequestContextCacheService();
    });

    it('stores and retrieves a multiple values', async () => {
        const ctx = RequestContext.empty();

        await cache.set(ctx, 'test', 1);
        await cache.set(ctx, 'test2', 2);
        expect(await cache.get(ctx, 'test')).toBe(1);
        expect(await cache.get(ctx, 'test2')).toBe(2);
    });

    it('can use objects as keys', async () => {
        const ctx = RequestContext.empty();

        const x = {};
        await cache.set(ctx, x, 1);
        expect(await cache.get(ctx, x)).toBe(1);
    });

    it('uses separate stores per context', async () => {
        const ctx = RequestContext.empty();
        const ctx2 = RequestContext.empty();

        await cache.set(ctx, 'test', 1);
        await cache.set(ctx2, 'test', 2);

        expect(await cache.get(ctx, 'test')).toBe(1);
        expect(await cache.get(ctx2, 'test')).toBe(2);
    });
});
