import { SortOrder } from '@vendure/common/lib/generated-types';
import { DeepRequired } from '@vendure/core';

import { buildElasticBody } from './build-elastic-body';
import { defaultOptions, SearchConfig } from './options';

describe('buildElasticBody()', () => {
    const searchConfig = defaultOptions.searchConfig;

    it('search term', () => {
        const result = buildElasticBody({ term: 'test' }, searchConfig);
        expect(result.query).toEqual({
            bool: {
                must: [
                    {
                        multi_match: {
                            query: 'test',
                            type: 'best_fields',
                            fields: ['productName^1', 'productVariantName^1', 'description^1', 'sku^1'],
                        },
                    },
                ],
            },
        });
    });

    it('facetValueIds', () => {
        const result = buildElasticBody({ facetValueIds: ['1', '2'] }, searchConfig);
        expect(result.query).toEqual({
            bool: {
                filter: [{ term: { facetValueIds: '1' } }, { term: { facetValueIds: '2' } }],
            },
        });
    });

    it('collectionId', () => {
        const result = buildElasticBody({ collectionId: '1' }, searchConfig);
        expect(result.query).toEqual({
            bool: {
                filter: [{ term: { collectionIds: '1' } }],
            },
        });
    });

    it('paging', () => {
        const result = buildElasticBody({ skip: 20, take: 10 }, searchConfig);
        expect(result).toEqual({
            from: 20,
            size: 10,
            query: { bool: {} },
            sort: [],
        });
    });

    describe('sorting', () => {
        it('name', () => {
            const result = buildElasticBody({ sort: { name: SortOrder.DESC } }, searchConfig);
            expect(result.sort).toEqual([{ productName: { order: 'desc' } }]);
        });

        it('price', () => {
            const result = buildElasticBody({ sort: { price: SortOrder.ASC } }, searchConfig);
            expect(result.sort).toEqual([{ price: { order: 'asc' } }]);
        });

        it('grouped price', () => {
            const result = buildElasticBody(
                { sort: { price: SortOrder.ASC }, groupByProduct: true },
                searchConfig,
            );
            expect(result.sort).toEqual([{ priceMin: { order: 'asc' } }]);
        });
    });

    it('enabledOnly true', () => {
        const result = buildElasticBody({}, searchConfig, true);
        expect(result.query).toEqual({
            bool: {
                filter: [{ term: { enabled: true } }],
            },
        });
    });

    it('enabledOnly false', () => {
        const result = buildElasticBody({}, searchConfig, false);
        expect(result.query).toEqual({
            bool: {},
        });
    });

    it('combined inputs', () => {
        const result = buildElasticBody(
            {
                term: 'test',
                take: 25,
                skip: 0,
                sort: {
                    name: SortOrder.DESC,
                },
                groupByProduct: true,
                collectionId: '42',
                facetValueIds: ['6', '7'],
            },
            searchConfig,
            true,
        );

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
                                fields: ['productName^1', 'productVariantName^1', 'description^1', 'sku^1'],
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
            sort: [{ productName: { order: 'desc' } }],
        });
    });

    it('multiMatchType option', () => {
        const result = buildElasticBody({ term: 'test' }, { ...searchConfig, multiMatchType: 'phrase' });
        expect(result.query).toEqual({
            bool: {
                must: [
                    {
                        multi_match: {
                            query: 'test',
                            type: 'phrase',
                            fields: ['productName^1', 'productVariantName^1', 'description^1', 'sku^1'],
                        },
                    },
                ],
            },
        });
    });

    it('boostFields option', () => {
        const config: DeepRequired<SearchConfig> = {
            ...searchConfig,
            ...{
                boostFields: {
                    description: 2,
                    productName: 3,
                    productVariantName: 4,
                    sku: 5,
                },
            },
        };
        const result = buildElasticBody({ term: 'test' }, config);
        expect(result.query).toEqual({
            bool: {
                must: [
                    {
                        multi_match: {
                            query: 'test',
                            type: 'best_fields',
                            fields: ['productName^3', 'productVariantName^4', 'description^2', 'sku^5'],
                        },
                    },
                ],
            },
        });
    });

    describe('price ranges', () => {
        it('not grouped by product', () => {
            const result = buildElasticBody(
                { priceRange: { min: 500, max: 1500 }, groupByProduct: false },
                searchConfig,
            );
            expect(result.query).toEqual({
                bool: {
                    filter: [
                        {
                            range: {
                                price: {
                                    gte: 500,
                                    lte: 1500,
                                },
                            },
                        },
                    ],
                },
            });
        });

        it('not grouped by product, with tax', () => {
            const result = buildElasticBody(
                { priceRangeWithTax: { min: 500, max: 1500 }, groupByProduct: false },
                searchConfig,
            );
            expect(result.query).toEqual({
                bool: {
                    filter: [
                        {
                            range: {
                                priceWithTax: {
                                    gte: 500,
                                    lte: 1500,
                                },
                            },
                        },
                    ],
                },
            });
        });

        it('grouped by product', () => {
            const result = buildElasticBody(
                { priceRange: { min: 500, max: 1500 }, groupByProduct: true },
                searchConfig,
            );
            expect(result.query).toEqual({
                bool: {
                    filter: [
                        {
                            range: {
                                priceMin: {
                                    gte: 500,
                                },
                            },
                        },
                        {
                            range: {
                                priceMax: {
                                    lte: 1500,
                                },
                            },
                        },
                    ],
                },
            });
        });

        it('grouped by product, with tax', () => {
            const result = buildElasticBody(
                { priceRangeWithTax: { min: 500, max: 1500 }, groupByProduct: true },
                searchConfig,
            );
            expect(result.query).toEqual({
                bool: {
                    filter: [
                        {
                            range: {
                                priceWithTaxMin: {
                                    gte: 500,
                                },
                            },
                        },
                        {
                            range: {
                                priceWithTaxMax: {
                                    lte: 1500,
                                },
                            },
                        },
                    ],
                },
            });
        });

        it('combined with collectionId and facetValueIds filters', () => {
            const result = buildElasticBody(
                {
                    priceRangeWithTax: { min: 500, max: 1500 },
                    groupByProduct: true,
                    collectionId: '3',
                    facetValueIds: ['5'],
                },
                searchConfig,
            );
            expect(result.query).toEqual({
                bool: {
                    filter: [
                        { term: { facetValueIds: '5' } },
                        { term: { collectionIds: '3' } },
                        {
                            range: {
                                priceWithTaxMin: {
                                    gte: 500,
                                },
                            },
                        },
                        {
                            range: {
                                priceWithTaxMax: {
                                    lte: 1500,
                                },
                            },
                        },
                    ],
                },
            });
        });
    });
});
