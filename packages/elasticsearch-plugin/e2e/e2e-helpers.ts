import { Client } from '@elastic/elasticsearch';
import { SortOrder } from '@vendure/common/lib/generated-types';
import { SimpleGraphQLClient } from '@vendure/testing';
import { expect } from 'vitest';

import { SearchGetPricesQuery, SearchInput } from '../../core/e2e/graphql/generated-e2e-admin-types';
import {
    LogicalOperator,
    SearchProductsShopQuery,
    SearchProductsShopQueryVariables,
} from '../../core/e2e/graphql/generated-e2e-shop-types';
import { SEARCH_PRODUCTS_SHOP } from '../../core/e2e/graphql/shop-definitions';
import { deleteIndices } from '../src/indexing/indexing-utils';

import { SEARCH_GET_PRICES, SEARCH_PRODUCTS } from './elasticsearch-plugin.e2e-spec';
import {
    SearchGetPricesQueryVariables,
    SearchProductsAdminQuery,
    SearchProductsAdminQueryVariables,
} from './graphql/generated-e2e-elasticsearch-plugin-types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { elasticsearchHost, elasticsearchPort } = require('./constants');

export function doAdminSearchQuery(client: SimpleGraphQLClient, input: SearchInput) {
    return client.query<SearchProductsAdminQuery, SearchProductsAdminQueryVariables>(SEARCH_PRODUCTS, {
        input,
    });
}

export async function testGroupByProduct(client: SimpleGraphQLClient) {
    const result = await client.query<SearchProductsShopQuery, SearchProductsShopQueryVariables>(
        SEARCH_PRODUCTS_SHOP,
        {
            input: {
                groupByProduct: true,
            },
        },
    );
    expect(result.search.totalItems).toBe(20);
}

export async function testNoGrouping(client: SimpleGraphQLClient) {
    const result = await client.query<SearchProductsShopQuery, SearchProductsShopQueryVariables>(
        SEARCH_PRODUCTS_SHOP,
        {
            input: {
                groupByProduct: false,
            },
        },
    );
    expect(result.search.totalItems).toBe(34);
}

export async function testMatchSearchTerm(client: SimpleGraphQLClient) {
    const result = await client.query<SearchProductsShopQuery, SearchProductsShopQueryVariables>(
        SEARCH_PRODUCTS_SHOP,
        {
            input: {
                term: 'camera',
                groupByProduct: true,
            },
        },
    );
    expect(result.search.items.map(i => i.productName)).toEqual([
        'Instant Camera',
        'Camera Lens',
        'SLR Camera',
    ]);
}

export async function testMatchFacetIdsAnd(client: SimpleGraphQLClient) {
    const result = await client.query<SearchProductsShopQuery, SearchProductsShopQueryVariables>(
        SEARCH_PRODUCTS_SHOP,
        {
            input: {
                facetValueIds: ['T_1', 'T_2'],
                facetValueOperator: LogicalOperator.AND,
                groupByProduct: true,
                sort: {
                    name: SortOrder.ASC,
                },
            },
        },
    );
    expect(result.search.items.map(i => i.productName)).toEqual([
        'Clacky Keyboard',
        'Curvy Monitor',
        'Gaming PC',
        'Hard Drive',
        'Laptop',
        'USB Cable',
    ]);
}

export async function testMatchFacetIdsOr(client: SimpleGraphQLClient) {
    const result = await client.query<SearchProductsShopQuery, SearchProductsShopQueryVariables>(
        SEARCH_PRODUCTS_SHOP,
        {
            input: {
                facetValueIds: ['T_1', 'T_5'],
                facetValueOperator: LogicalOperator.OR,
                groupByProduct: true,
                sort: {
                    name: SortOrder.ASC,
                },
                take: 20,
            },
        },
    );
    expect(result.search.items.map(i => i.productName)).toEqual([
        'Bonsai Tree',
        'Camera Lens',
        'Clacky Keyboard',
        'Curvy Monitor',
        'Gaming PC',
        'Hard Drive',
        'Instant Camera',
        'Laptop',
        'Orchid',
        'SLR Camera',
        'Spiky Cactus',
        'Tripod',
        'USB Cable',
    ]);
}

export async function testMatchFacetValueFiltersAnd(client: SimpleGraphQLClient) {
    const result = await client.query<SearchProductsShopQuery, SearchProductsShopQueryVariables>(
        SEARCH_PRODUCTS_SHOP,
        {
            input: {
                groupByProduct: true,
                facetValueFilters: [{ and: 'T_1' }, { and: 'T_2' }],
            },
        },
    );
    expect(result.search.items.map(i => i.productName).sort()).toEqual(
        ['Laptop', 'Curvy Monitor', 'Gaming PC', 'Hard Drive', 'Clacky Keyboard', 'USB Cable'].sort(),
    );
}

export async function testMatchFacetValueFiltersOr(client: SimpleGraphQLClient) {
    const result = await client.query<SearchProductsShopQuery, SearchProductsShopQueryVariables>(
        SEARCH_PRODUCTS_SHOP,
        {
            input: {
                groupByProduct: true,
                facetValueFilters: [{ or: ['T_1', 'T_5'] }],
                sort: {
                    name: SortOrder.ASC,
                },
                take: 20,
            },
        },
    );
    expect(result.search.items.map(i => i.productName).sort()).toEqual(
        [
            'Bonsai Tree',
            'Camera Lens',
            'Clacky Keyboard',
            'Curvy Monitor',
            'Gaming PC',
            'Hard Drive',
            'Instant Camera',
            'Laptop',
            'Orchid',
            'SLR Camera',
            'Spiky Cactus',
            'Tripod',
            'USB Cable',
        ].sort(),
    );
}

export async function testMatchFacetValueFiltersOrWithAnd(client: SimpleGraphQLClient) {
    const result = await client.query<SearchProductsShopQuery, SearchProductsShopQueryVariables>(
        SEARCH_PRODUCTS_SHOP,
        {
            input: {
                groupByProduct: true,
                facetValueFilters: [{ and: 'T_1' }, { or: ['T_2', 'T_3'] }],
            },
        },
    );
    expect(result.search.items.map(i => i.productName).sort()).toEqual(
        [
            'Laptop',
            'Curvy Monitor',
            'Gaming PC',
            'Hard Drive',
            'Clacky Keyboard',
            'USB Cable',
            'Instant Camera',
            'Camera Lens',
            'Tripod',
            'SLR Camera',
        ].sort(),
    );
}

export async function testMatchFacetValueFiltersWithFacetIdsOr(client: SimpleGraphQLClient) {
    const result = await client.query<SearchProductsShopQuery, SearchProductsShopQueryVariables>(
        SEARCH_PRODUCTS_SHOP,
        {
            input: {
                facetValueIds: ['T_2', 'T_3'],
                facetValueOperator: LogicalOperator.OR,
                facetValueFilters: [{ and: 'T_1' }],
                groupByProduct: true,
            },
        },
    );
    expect(result.search.items.map(i => i.productName).sort()).toEqual(
        [
            'Laptop',
            'Curvy Monitor',
            'Gaming PC',
            'Hard Drive',
            'Clacky Keyboard',
            'USB Cable',
            'Instant Camera',
            'Camera Lens',
            'Tripod',
            'SLR Camera',
        ].sort(),
    );
}

export async function testMatchFacetValueFiltersWithFacetIdsAnd(client: SimpleGraphQLClient) {
    const result = await client.query<SearchProductsShopQuery, SearchProductsShopQueryVariables>(
        SEARCH_PRODUCTS_SHOP,
        {
            input: {
                facetValueIds: ['T_1'],
                facetValueFilters: [{ and: 'T_3' }],
                facetValueOperator: LogicalOperator.AND,
                groupByProduct: true,
            },
        },
    );
    expect(result.search.items.map(i => i.productName).sort()).toEqual(
        ['Instant Camera', 'Camera Lens', 'Tripod', 'SLR Camera'].sort(),
    );
}

export async function testMatchCollectionId(client: SimpleGraphQLClient) {
    const result = await client.query<SearchProductsShopQuery, SearchProductsShopQueryVariables>(
        SEARCH_PRODUCTS_SHOP,
        {
            input: {
                collectionId: 'T_2',
                groupByProduct: true,
            },
        },
    );
    expect(result.search.items.map(i => i.productName).sort()).toEqual([
        'Bonsai Tree',
        'Orchid',
        'Spiky Cactus',
    ]);
}

export async function testMatchCollectionSlug(client: SimpleGraphQLClient) {
    const result = await client.query<SearchProductsShopQuery, SearchProductsShopQueryVariables>(
        SEARCH_PRODUCTS_SHOP,
        {
            input: {
                collectionSlug: 'plants',
                groupByProduct: true,
            },
        },
    );
    expect(result.search.items.map(i => i.productName).sort()).toEqual([
        'Bonsai Tree',
        'Orchid',
        'Spiky Cactus',
    ]);
}

export async function testSinglePrices(client: SimpleGraphQLClient) {
    const result = await client.query<SearchGetPricesQuery, SearchGetPricesQueryVariables>(
        SEARCH_GET_PRICES,
        {
            input: {
                groupByProduct: false,
                take: 3,
                sort: {
                    price: SortOrder.ASC,
                },
            },
        },
    );
    expect(result.search.items).toEqual([
        {
            price: { value: 799 },
            priceWithTax: { value: 959 },
        },
        {
            price: { value: 1498 },
            priceWithTax: { value: 1798 },
        },
        {
            price: { value: 1550 },
            priceWithTax: { value: 1860 },
        },
    ]);
}

export async function testPriceRanges(client: SimpleGraphQLClient) {
    const result = await client.query<SearchGetPricesQuery, SearchGetPricesQueryVariables>(
        SEARCH_GET_PRICES,
        {
            input: {
                groupByProduct: true,
                take: 3,
                term: 'laptop',
            },
        },
    );
    expect(result.search.items).toEqual([
        {
            price: { min: 129900, max: 229900 },
            priceWithTax: { min: 155880, max: 275880 },
        },
    ]);
}

export async function dropElasticIndices(indexPrefix: string) {
    const esClient = new Client({
        node: `${elasticsearchHost as string}:${elasticsearchPort as string}`,
    });
    return deleteIndices(esClient, indexPrefix);
}
