import { beforeEach, describe, expect, it } from 'vitest';

import { RequestContext } from '../../api/common/request-context';
import { RequestContextCacheService } from '../../cache/request-context-cache.service';
import { Channel } from '../../entity/channel/channel.entity';
import { FacetValue } from '../../entity/facet-value/facet-value.entity';

import { FacetValueService } from './facet-value.service';

/**
 * Rows of the Product to FacetValue join table. Product 3 has no FacetValues. FacetValue 12 is
 * shared by products 1 and 2. The rows are not in facetValueId order on purpose, so a test
 * asserting that order is asserting that the query asked for it.
 */
const links = [
    { productId: 1, facetValueId: 12 },
    { productId: 2, facetValueId: 13 },
    { productId: 1, facetValueId: 11 },
    { productId: 2, facetValueId: 12 },
    { productId: 4, facetValueId: 14 },
];

/** FacetValue 14 is only in channel 42, the others are only in channel 1. */
const facetValueChannels: Record<number, number[]> = { 11: [1], 12: [1], 13: [1], 14: [42] };

/** The productIds of each link read, and the ids of each channel-filtered FacetValue read. */
let linkReads: Array<Array<string | number>>;
let facetValueReads: Array<Array<string | number>>;

function createQueryBuilder() {
    let productIds: Array<string | number> = [];
    let orderBy: string | undefined;
    const queryBuilder: any = {
        innerJoin: () => queryBuilder,
        select: () => queryBuilder,
        addSelect: () => queryBuilder,
        where: (clause: string, params: { productIds: Array<string | number> }) => {
            productIds = params.productIds;
            return queryBuilder;
        },
        orderBy: (field: string) => {
            orderBy = field;
            return queryBuilder;
        },
        getRawMany: () => {
            linkReads.push(productIds);
            const rows = links.filter(link => productIds.map(String).includes(String(link.productId)));
            if (orderBy === 'facetValue.id') {
                rows.sort((a, b) => a.facetValueId - b.facetValueId);
            }
            return Promise.resolve(rows);
        },
    };
    return queryBuilder;
}

const mockConnection = {
    getRepository: () => ({ createQueryBuilder }),
    findByIdsInChannel: (
        ctx: RequestContext,
        entity: any,
        ids: Array<string | number>,
        channelId: number,
    ) => {
        facetValueReads.push(ids);
        // Returned in descending id order, as an IN (...) read may return them in any order.
        const values = [...new Set(ids.map(Number))]
            .filter(id => facetValueChannels[id].includes(channelId))
            .sort((a, b) => b - a)
            .map(id => new FacetValue({ id }));
        return Promise.resolve(values);
    },
} as any;

const mockTranslator = { translate: (entity: any) => entity } as any;

function newCtx(channelId = 1): RequestContext {
    return new RequestContext({
        apiType: 'admin',
        channel: new Channel({ id: channelId }),
        authorizedAsOwnerOnly: false,
        isAuthorized: true,
        session: {} as any,
    });
}

describe('FacetValueService', () => {
    let service: FacetValueService;
    let ctx: RequestContext;

    beforeEach(() => {
        linkReads = [];
        facetValueReads = [];
        ctx = newCtx();
        service = new FacetValueService(
            mockConnection,
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            mockTranslator,
            {} as any,
            new RequestContextCacheService(),
        );
    });

    // #5537 — the `Product.facetValues` field resolver ran several queries per product
    describe('findByProductId', () => {
        it('batches concurrent lookups into one link read and one FacetValue read', async () => {
            const results = await Promise.all([1, 2, 3].map(id => service.findByProductId(ctx, id)));

            expect(linkReads).toEqual([[1, 2, 3]]);
            expect(facetValueReads.length).toBe(1);
            expect(results.map(values => values.map(fv => fv.id))).toEqual([[11, 12], [12, 13], []]);
        });

        it("orders each product's FacetValues by id, whatever order the reads return", async () => {
            const [product1] = await Promise.all([1, 2].map(id => service.findByProductId(ctx, id)));

            expect(product1.map(fv => fv.id)).toEqual([11, 12]);
        });

        it('reads each product and FacetValue id once per batch', async () => {
            const results = await Promise.all([1, 2, 1].map(id => service.findByProductId(ctx, id)));

            expect(linkReads).toEqual([[1, 2]]);
            expect(facetValueReads).toEqual([[11, 12, 13]]);
            expect(results.map(values => values.map(fv => fv.id))).toEqual([
                [11, 12],
                [12, 13],
                [11, 12],
            ]);
        });

        it('returns only the FacetValues in the Channel of the RequestContext', async () => {
            const otherChannelCtx = newCtx(42);
            const [product1, product4] = await Promise.all([
                service.findByProductId(otherChannelCtx, 1),
                service.findByProductId(otherChannelCtx, 4),
            ]);

            expect(product1).toEqual([]);
            expect(product4.map(fv => fv.id)).toEqual([14]);
        });

        it('re-reads on a later tick, so changes within a request are not stale', async () => {
            await service.findByProductId(ctx, 1);
            await service.findByProductId(ctx, 1);

            expect(linkReads.length).toBe(2);
        });

        it('does not share a batch across RequestContexts', async () => {
            await Promise.all([service.findByProductId(ctx, 1), service.findByProductId(newCtx(42), 4)]);

            expect(linkReads.length).toBe(2);
        });
    });
});
