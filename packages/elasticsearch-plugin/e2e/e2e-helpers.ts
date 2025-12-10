import { Client } from '@elastic/elasticsearch';
import { LogicalOperator, SortOrder } from '@vendure/common/lib/generated-types';
import { SimpleGraphQLClient } from '@vendure/testing';
import { expect } from 'vitest';

import { searchProductsShopDocument } from '../../core/e2e/graphql/shop-definitions';
import { deleteIndices } from '../src/indexing/indexing-utils';

import { searchGetPricesDocument, searchProductsAdminDocument } from './elasticsearch-plugin.e2e-spec';
import { VariablesOf } from './graphql/graphql-admin';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { elasticsearchHost, elasticsearchPort } = require('./constants');

type SearchInput = VariablesOf<typeof searchProductsAdminDocument>['input'];

export function doAdminSearchQuery(client: SimpleGraphQLClient, input: SearchInput) {
    return client.query(searchProductsAdminDocument, { input });
}

export async function testGroupByProduct(client: SimpleGraphQLClient) {
    const result = await client.query(searchProductsShopDocument, {
        input: {
            groupByProduct: true,
        },
    });
    expect(result.search.totalItems).toBe(21);
}

export async function testGroupBySKU(client: SimpleGraphQLClient) {
    const result = await client.query(searchProductsShopDocument, {
        input: {
            term: 'bonsai',
            groupBySKU: true,
        },
    });
    expect(result.search.totalItems).toBe(1);
}

export async function testNoGrouping(client: SimpleGraphQLClient) {
    const result = await client.query(searchProductsShopDocument, {
        input: {
            groupByProduct: false,
            groupBySKU: false,
        },
    });
    expect(result.search.totalItems).toBe(35);
}

export async function testMatchSearchTerm(client: SimpleGraphQLClient) {
    const result = await client.query(searchProductsShopDocument, {
        input: {
            term: 'camera',
            groupByProduct: true,
        },
    });
    expect(result.search.items.map(i => i.productName).sort()).toEqual([
        'Camera Lens',
        'Instant Camera',
        'SLR Camera',
    ]);
}

export async function testMatchFacetIdsAnd(client: SimpleGraphQLClient) {
    const result = await client.query(searchProductsShopDocument, {
        input: {
            facetValueIds: ['T_1', 'T_2'],
            facetValueOperator: LogicalOperator.AND,
            groupByProduct: true,
            sort: {
                name: SortOrder.ASC,
            },
        },
    });
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
    const result = await client.query(searchProductsShopDocument, {
        input: {
            facetValueIds: ['T_1', 'T_5'],
            facetValueOperator: LogicalOperator.OR,
            groupByProduct: true,
            sort: {
                name: SortOrder.ASC,
            },
            take: 20,
        },
    });
    expect(result.search.items.map(i => i.productName)).toEqual([
        'Bonsai Tree',
        'Bonsai Tree (Ch2)',
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
    const result = await client.query(searchProductsShopDocument, {
        input: {
            groupByProduct: true,
            facetValueFilters: [{ and: 'T_1' }, { and: 'T_2' }],
        },
    });
    expect(result.search.items.map(i => i.productName).sort((a, b) => a.localeCompare(b))).toEqual(
        ['Laptop', 'Curvy Monitor', 'Gaming PC', 'Hard Drive', 'Clacky Keyboard', 'USB Cable'].sort((a, b) =>
            a.localeCompare(b),
        ),
    );
}

export async function testMatchFacetValueFiltersOr(client: SimpleGraphQLClient) {
    const result = await client.query(searchProductsShopDocument, {
        input: {
            groupByProduct: true,
            facetValueFilters: [{ or: ['T_1', 'T_5'] }],
            sort: {
                name: SortOrder.ASC,
            },
            take: 20,
        },
    });
    expect(result.search.items.map(i => i.productName).sort((a, b) => a.localeCompare(b))).toEqual(
        [
            'Bonsai Tree',
            'Bonsai Tree (Ch2)',
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
        ].sort((a, b) => a.localeCompare(b)),
    );
}

export async function testMatchFacetValueFiltersOrWithAnd(client: SimpleGraphQLClient) {
    const result = await client.query(searchProductsShopDocument, {
        input: {
            groupByProduct: true,
            facetValueFilters: [{ and: 'T_1' }, { or: ['T_2', 'T_3'] }],
        },
    });
    expect(result.search.items.map(i => i.productName).sort((a, b) => a.localeCompare(b))).toEqual(
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
        ].sort((a, b) => a.localeCompare(b)),
    );
}

export async function testMatchFacetValueFiltersWithFacetIdsOr(client: SimpleGraphQLClient) {
    const result = await client.query(searchProductsShopDocument, {
        input: {
            facetValueIds: ['T_2', 'T_3'],
            facetValueOperator: LogicalOperator.OR,
            facetValueFilters: [{ and: 'T_1' }],
            groupByProduct: true,
        },
    });
    expect(result.search.items.map(i => i.productName).sort((a, b) => a.localeCompare(b))).toEqual(
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
        ].sort((a, b) => a.localeCompare(b)),
    );
}

export async function testMatchFacetValueFiltersWithFacetIdsAnd(client: SimpleGraphQLClient) {
    const result = await client.query(searchProductsShopDocument, {
        input: {
            facetValueIds: ['T_1'],
            facetValueFilters: [{ and: 'T_3' }],
            facetValueOperator: LogicalOperator.AND,
            groupByProduct: true,
        },
    });
    expect(result.search.items.map(i => i.productName).sort((a, b) => a.localeCompare(b))).toEqual(
        ['Instant Camera', 'Camera Lens', 'Tripod', 'SLR Camera'].sort((a, b) => a.localeCompare(b)),
    );
}

export async function testMatchCollectionId(client: SimpleGraphQLClient) {
    const result = await client.query(searchProductsShopDocument, {
        input: {
            collectionId: 'T_2',
            groupByProduct: true,
        },
    });
    expect(result.search.items.map(i => i.productName).sort((a, b) => a.localeCompare(b))).toEqual([
        'Bonsai Tree',
        'Bonsai Tree (Ch2)',
        'Orchid',
        'Spiky Cactus',
    ]);
}

export async function testMatchCollectionSlug(client: SimpleGraphQLClient) {
    const result = await client.query(searchProductsShopDocument, {
        input: {
            collectionSlug: 'plants',
            groupByProduct: true,
        },
    });
    expect(result.search.items.map(i => i.productName).sort((a, b) => a.localeCompare(b))).toEqual([
        'Bonsai Tree',
        'Bonsai Tree (Ch2)',
        'Orchid',
        'Spiky Cactus',
    ]);
}

async function testMatchCollections(client: SimpleGraphQLClient, searchInput: Partial<SearchInput>) {
    const result = await client.query(searchProductsShopDocument, {
        input: {
            groupByProduct: true,
            ...searchInput,
            sort: { name: SortOrder.ASC },
        },
    });
    // Should return products from both Plants (T_2) and Electronics (T_3) collections
    expect(result.search.items.length).toBeGreaterThan(4);
    expect(result.search.totalItems).toBeGreaterThan(4);

    // Verify that products from both collections are included by checking collectionIds
    const allCollectionIds = result.search.items.flatMap(i => i.collectionIds);

    // Should contain products from Plants collection (T_2)
    expect(allCollectionIds.filter(id => id === 'T_2').length).toBeGreaterThan(0);

    // Should contain products from Electronics collection (T_3)
    expect(allCollectionIds.filter(id => id === 'T_3').length).toBeGreaterThan(0);
}

export async function testMatchCollectionIds(client: SimpleGraphQLClient) {
    return testMatchCollections(client, { collectionIds: ['T_2', 'T_3'] });
}

export async function testMatchCollectionSlugs(client: SimpleGraphQLClient) {
    return testMatchCollections(client, { collectionSlugs: ['plants', 'electronics'] });
}

async function testCollectionEdgeCases(
    client: SimpleGraphQLClient,
    duplicateInput: Partial<SearchInput>,
    nonExistentInput: Partial<SearchInput>,
) {
    // Test with duplicates - should handle gracefully
    const resultWithDuplicates = await client.query(searchProductsShopDocument, {
        input: {
            groupByProduct: true,
            ...duplicateInput,
        },
    });
    // Should still return Plants collection products, de-duplicated
    expect(
        resultWithDuplicates.search.items.map(i => i.productName).sort((a, b) => a.localeCompare(b)),
    ).toEqual(['Bonsai Tree', 'Bonsai Tree (Ch2)', 'Orchid', 'Spiky Cactus']);

    // Test with non-existent collection - should return no results
    const resultNonExistent = await client.query(searchProductsShopDocument, {
        input: {
            groupByProduct: true,
            ...nonExistentInput,
        },
    });
    expect(resultNonExistent.search.items).toEqual([]);
    expect(resultNonExistent.search.totalItems).toBe(0);
}

export async function testCollectionIdsEdgeCases(client: SimpleGraphQLClient) {
    return testCollectionEdgeCases(
        client,
        { collectionIds: ['T_2', 'T_2', 'T_2'] },
        { collectionIds: ['T_999'] },
    );
}

export async function testCollectionSlugsEdgeCases(client: SimpleGraphQLClient) {
    return testCollectionEdgeCases(
        client,
        { collectionSlugs: ['plants', 'plants', 'plants'] },
        { collectionSlugs: ['non-existent-collection'] },
    );
}

export async function testSinglePrices(client: SimpleGraphQLClient) {
    const result = await client.query(searchGetPricesDocument, {
        input: {
            groupByProduct: false,
            take: 3,
            sort: {
                price: SortOrder.ASC,
            },
        },
    });
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
    const result = await client.query(searchGetPricesDocument, {
        input: {
            groupByProduct: true,
            take: 3,
            term: 'laptop',
        },
    });
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
