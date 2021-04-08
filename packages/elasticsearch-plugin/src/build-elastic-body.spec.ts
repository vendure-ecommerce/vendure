import { LanguageCode, LogicalOperator, SortOrder } from '@vendure/common/lib/generated-types';
import { DeepRequired } from '@vendure/core';

import { buildElasticBody } from './build-elastic-body';
import { defaultOptions, SearchConfig } from './options';

describe('buildElasticBody()', () => {
    const searchConfig = defaultOptions.searchConfig;
    const CHANNEL_ID = 42;
    const CHANNEL_ID_TERM = { term: { channelId: CHANNEL_ID } };
    const LANGUAGE_CODE_TERM = { term: { languageCode: LanguageCode.en } };

    it('search term', () => {
        const result = buildElasticBody({ term: 'test' }, searchConfig, CHANNEL_ID, LanguageCode.en);
        expect(result.query).toEqual({
            bool: {
                filter: [CHANNEL_ID_TERM, LANGUAGE_CODE_TERM],
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

    it('facetValueIds AND', () => {
        const result = buildElasticBody(
            { facetValueIds: ['1', '2'], facetValueOperator: LogicalOperator.AND },
            searchConfig,
            CHANNEL_ID,
            LanguageCode.en,
        );
        expect(result.query).toEqual({
            bool: {
                filter: [
                    CHANNEL_ID_TERM,
                    LANGUAGE_CODE_TERM,
                    {
                        bool: {
                            must: [{ term: { facetValueIds: '1' } }, { term: { facetValueIds: '2' } }],
                        },
                    },
                ],
            },
        });
    });

    it('facetValueIds OR', () => {
        const result = buildElasticBody(
            { facetValueIds: ['1', '2'], facetValueOperator: LogicalOperator.OR },
            searchConfig,
            CHANNEL_ID,
            LanguageCode.en,
        );
        expect(result.query).toEqual({
            bool: {
                filter: [
                    CHANNEL_ID_TERM,
                    LANGUAGE_CODE_TERM,
                    {
                        bool: {
                            should: [{ term: { facetValueIds: '1' } }, { term: { facetValueIds: '2' } }],
                        },
                    },
                ],
            },
        });
    });

    it('facetValueFilters AND with OR', () => {
        const result = buildElasticBody(
            { facetValueFilters: [{ and: '1' }, { or: ['2', '3'] }] },
            searchConfig,
            CHANNEL_ID,
            LanguageCode.en,
        );
        expect(result.query).toEqual({
            bool: {
                filter: [
                    CHANNEL_ID_TERM,
                    LANGUAGE_CODE_TERM,
                    { term: { facetValueIds: '1' } },
                    {
                        bool: {
                            should: [{ term: { facetValueIds: '2' } }, { term: { facetValueIds: '3' } }],
                        },
                    },
                ],
            },
        });
    });

    it('facetValueFilters AND', () => {
        const result = buildElasticBody(
            { facetValueFilters: [{ and: '1' }, { and: '2' }] },
            searchConfig,
            CHANNEL_ID,
            LanguageCode.en,
        );
        expect(result.query).toEqual({
            bool: {
                filter: [
                    CHANNEL_ID_TERM,
                    LANGUAGE_CODE_TERM,
                    { term: { facetValueIds: '1' } },
                    { term: { facetValueIds: '2' } },
                ],
            },
        });
    });

    it('facetValueFilters OR', () => {
        const result = buildElasticBody(
            { facetValueFilters: [ { or: ['1', '2'] }] },
            searchConfig,
            CHANNEL_ID,
            LanguageCode.en,
        );
        expect(result.query).toEqual({
            bool: {
                filter: [
                    CHANNEL_ID_TERM,
                    LANGUAGE_CODE_TERM,
                    {
                        bool: {
                            should: [{ term: { facetValueIds: '1' } }, { term: { facetValueIds: '2' } }],
                        },
                    },
                ],
            },
        });
    });

    it('facetValueFilters with facetValueIds AND', () => {
        const result = buildElasticBody(
            {
                facetValueFilters: [{ and: '1' }, { or: ['2', '3'] }],
                facetValueIds: ['1', '2'],
                facetValueOperator: LogicalOperator.AND,
            },
            searchConfig,
            CHANNEL_ID,
            LanguageCode.en,
        );
        expect(result.query).toEqual({
            bool: {
                filter: [
                    CHANNEL_ID_TERM,
                    LANGUAGE_CODE_TERM,
                    {
                        bool: {
                            must: [{ term: { facetValueIds: '1' } }, { term: { facetValueIds: '2' } }],
                        },
                    },
                    { term: { facetValueIds: '1' } },
                    {
                        bool: {
                            should: [{ term: { facetValueIds: '2' } }, { term: { facetValueIds: '3' } }],
                        },
                    },
                ],
            },
        });
    });

    it('facetValueFilters with facetValueIds OR', () => {
        const result = buildElasticBody(
            {
                facetValueFilters: [{ and: '1' }, { or: ['2', '3'] }],
                facetValueIds: ['1', '2'],
                facetValueOperator: LogicalOperator.OR,
            },
            searchConfig,
            CHANNEL_ID,
            LanguageCode.en,
        );
        expect(result.query).toEqual({
            bool: {
                filter: [
                    CHANNEL_ID_TERM,
                    LANGUAGE_CODE_TERM,
                    {
                        bool: {
                            should: [{ term: { facetValueIds: '1' } }, { term: { facetValueIds: '2' } }],
                        },
                    },
                    { term: { facetValueIds: '1' } },
                    {
                        bool: {
                            should: [{ term: { facetValueIds: '2' } }, { term: { facetValueIds: '3' } }],
                        },
                    },
                ],
            },
        });
    });

    it('collectionId', () => {
        const result = buildElasticBody({ collectionId: '1' }, searchConfig, CHANNEL_ID, LanguageCode.en);
        expect(result.query).toEqual({
            bool: {
                filter: [CHANNEL_ID_TERM, LANGUAGE_CODE_TERM, { term: { collectionIds: '1' } }],
            },
        });
    });

    it('collectionSlug', () => {
        const result = buildElasticBody(
            { collectionSlug: 'plants' },
            searchConfig,
            CHANNEL_ID,
            LanguageCode.en,
        );
        expect(result.query).toEqual({
            bool: {
                filter: [CHANNEL_ID_TERM, LANGUAGE_CODE_TERM, { term: { collectionSlugs: 'plants' } }],
            },
        });
    });

    it('paging', () => {
        const result = buildElasticBody({ skip: 20, take: 10 }, searchConfig, CHANNEL_ID, LanguageCode.en);
        expect(result).toEqual({
            from: 20,
            size: 10,
            query: { bool: { filter: [CHANNEL_ID_TERM, LANGUAGE_CODE_TERM] } },
            sort: [],
        });
    });

    describe('sorting', () => {
        it('name', () => {
            const result = buildElasticBody(
                { sort: { name: SortOrder.DESC } },
                searchConfig,
                CHANNEL_ID,
                LanguageCode.en,
            );
            expect(result.sort).toEqual([{ 'productName.keyword': { order: 'desc' } }]);
        });

        it('price', () => {
            const result = buildElasticBody(
                { sort: { price: SortOrder.ASC } },
                searchConfig,
                CHANNEL_ID,
                LanguageCode.en,
            );
            expect(result.sort).toEqual([{ price: { order: 'asc' } }]);
        });

        it('grouped price', () => {
            const result = buildElasticBody(
                { sort: { price: SortOrder.ASC }, groupByProduct: true },
                searchConfig,
                CHANNEL_ID,
                LanguageCode.en,
            );
            expect(result.sort).toEqual([{ priceMin: { order: 'asc' } }]);
        });
    });

    it('enabledOnly true', () => {
        const result = buildElasticBody({}, searchConfig, CHANNEL_ID, LanguageCode.en, true);
        expect(result.query).toEqual({
            bool: {
                filter: [CHANNEL_ID_TERM, LANGUAGE_CODE_TERM, { term: { enabled: true } }],
            },
        });
    });

    it('enabledOnly false', () => {
        const result = buildElasticBody({}, searchConfig, CHANNEL_ID, LanguageCode.en, false);
        expect(result.query).toEqual({
            bool: { filter: [CHANNEL_ID_TERM, LANGUAGE_CODE_TERM] },
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
            CHANNEL_ID,
            LanguageCode.en,
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
                        CHANNEL_ID_TERM,

                        LANGUAGE_CODE_TERM,
                        {
                            bool: {
                                should: [{ term: { facetValueIds: '6' } }, { term: { facetValueIds: '7' } }],
                            },
                        },
                        { term: { collectionIds: '42' } },
                        { term: { enabled: true } },
                    ],
                },
            },
            sort: [{ 'productName.keyword': { order: 'desc' } }],
        });
    });

    it('multiMatchType option', () => {
        const result = buildElasticBody(
            { term: 'test' },
            { ...searchConfig, multiMatchType: 'phrase' },
            CHANNEL_ID,
            LanguageCode.en,
        );
        expect(result.query).toEqual({
            bool: {
                filter: [CHANNEL_ID_TERM, LANGUAGE_CODE_TERM],
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
        const result = buildElasticBody({ term: 'test' }, config, CHANNEL_ID, LanguageCode.en);
        expect(result.query).toEqual({
            bool: {
                filter: [CHANNEL_ID_TERM, LANGUAGE_CODE_TERM],
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
                CHANNEL_ID,
                LanguageCode.en,
            );
            expect(result.query).toEqual({
                bool: {
                    filter: [
                        CHANNEL_ID_TERM,
                        LANGUAGE_CODE_TERM,
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
                CHANNEL_ID,
                LanguageCode.en,
            );
            expect(result.query).toEqual({
                bool: {
                    filter: [
                        CHANNEL_ID_TERM,
                        LANGUAGE_CODE_TERM,
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
                CHANNEL_ID,
                LanguageCode.en,
            );
            expect(result.query).toEqual({
                bool: {
                    filter: [
                        CHANNEL_ID_TERM,
                        LANGUAGE_CODE_TERM,
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
                CHANNEL_ID,
                LanguageCode.en,
            );
            expect(result.query).toEqual({
                bool: {
                    filter: [
                        CHANNEL_ID_TERM,
                        LANGUAGE_CODE_TERM,
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
                CHANNEL_ID,
                LanguageCode.en,
            );
            expect(result.query).toEqual({
                bool: {
                    filter: [
                        CHANNEL_ID_TERM,
                        LANGUAGE_CODE_TERM,
                        {
                            bool: {
                                should: [{ term: { facetValueIds: '5' } }],
                            },
                        },
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
