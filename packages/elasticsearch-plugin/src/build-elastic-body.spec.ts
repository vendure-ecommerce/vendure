import { SortOrder } from '@vendure/common/lib/generated-types';

import { buildElasticBody } from './build-elastic-body';

describe('buildElasticBody()', () => {

    it('search term', () => {
        const result = buildElasticBody({ term: 'test' });
        expect(result.query).toEqual({
            bool: {
                must: [
                    {
                        multi_match: {
                            query: 'test',
                            type: 'best_fields',
                            fields: [
                                'productName',
                                'productVariantName',
                                'description',
                                'sku',
                            ],
                        },
                    },
                ],
            },
        });
    });

    it('facetValueIds', () => {
        const result = buildElasticBody({ facetValueIds: ['1', '2'] });
        expect(result.query).toEqual({
            bool: {
                filter:  [
                    { term: { facetValueIds: '1' } },
                    { term: { facetValueIds: '2' } },
                ],
            },
        });
    });

    it('collectionId', () => {
        const result = buildElasticBody({ collectionId: '1' });
        expect(result.query).toEqual({
            bool: {
                filter:  [
                    { term: { collectionIds: '1' } },
                ],
            },
        });
    });

    it('paging', () => {
        const result = buildElasticBody({ skip: 20, take: 10 });
        expect(result).toEqual({
            from: 20,
            size: 10,
            query: { bool: {} },
            sort: [],
        });
    });

    describe('sorting', () => {
        it('name', () => {
            const result = buildElasticBody({ sort: { name: SortOrder.DESC } });
            expect(result.sort).toEqual([
                { productName: { order: 'desc' } },
            ]);
        });

        it('price', () => {
            const result = buildElasticBody({ sort: { price: SortOrder.ASC } });
            expect(result.sort).toEqual([
                { price: { order: 'asc' } },
            ]);
        });

        it('grouped price', () => {
            const result = buildElasticBody({ sort: { price: SortOrder.ASC }, groupByProduct: true });
            expect(result.sort).toEqual([
                { priceMin: { order: 'asc' } },
            ]);
        });
    });

    it('enabledOnly true', () => {
        const result = buildElasticBody({}, true);
        expect(result.query).toEqual({
            bool: {
                filter: [
                    { term: { enabled: true } },
                ],
            },
        });
    });

    it('enabledOnly false', () => {
        const result = buildElasticBody({}, false);
        expect(result.query).toEqual({
            bool: {},
        });
    });

    it('combined inputs', () => {
        const result = buildElasticBody({
            term: 'test',
            take: 25,
            skip: 0,
            sort: {
                name: SortOrder.DESC,
            },
            groupByProduct: true,
            collectionId: '42',
            facetValueIds: ['6', '7'],
        }, true);

        expect(result).toEqual({
            from: 0,
            size: 25,
            query: {
                bool: {
                    must: [
                        {
                            multi_match: {
                                query: 'test',
                                type: 'best_fields',
                                fields: [
                                    'productName',
                                    'productVariantName',
                                    'description',
                                    'sku',
                                ],
                            },
                        },
                    ],
                    filter: [
                        { term: { facetValueIds: '6' } },
                        { term: { facetValueIds: '7' } },
                        { term: { collectionIds: '42' } },
                        { term: { enabled: true } },
                    ],
                },
            },
            sort: [
                { productName: { order: 'desc' } },
            ],
        });
    });
});
