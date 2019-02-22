import path from 'path';

import { SEARCH_PRODUCTS } from '../../admin-ui/src/app/data/definitions/product-definitions';
import { SearchProducts } from '../../shared/generated-types';
import { SimpleGraphQLClient } from '../mock-data/simple-graphql-client';
import { DefaultSearchPlugin } from '../src/plugin';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { TestAdminClient, TestShopClient } from './test-client';
import { TestServer } from './test-server';

describe('Default search plugin', () => {
    const adminClient = new TestAdminClient();
    const shopClient = new TestShopClient();
    const server = new TestServer();

    beforeAll(async () => {
        const token = await server.init(
            {
                productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
                customerCount: 1,
            },
            {
                plugins: [new DefaultSearchPlugin()],
            },
        );
        await adminClient.init();
        await shopClient.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    async function testGroupByProduct(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProducts.Query, SearchProducts.Variables>(SEARCH_PRODUCTS, {
            input: {
                groupByProduct: true,
            },
        });
        expect(result.search.totalItems).toBe(20);
    }

    async function testNoGrouping(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProducts.Query, SearchProducts.Variables>(SEARCH_PRODUCTS, {
            input: {
                groupByProduct: false,
            },
        });
        expect(result.search.totalItems).toBe(34);
    }

    async function testMatchSearchTerm(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProducts.Query, SearchProducts.Variables>(SEARCH_PRODUCTS, {
            input: {
                term: 'camera',
                groupByProduct: true,
            },
        });
        expect(result.search.items.map(i => i.productName)).toEqual([
            'Instant Camera',
            'Camera Lens',
            'SLR Camera',
        ]);
    }

    async function testMatchFacetIds(client: SimpleGraphQLClient) {
        const result = await client.query<SearchProducts.Query, SearchProducts.Variables>(SEARCH_PRODUCTS, {
            input: {
                facetIds: ['T_1', 'T_2'],
                groupByProduct: true,
            },
        });
        expect(result.search.items.map(i => i.productName)).toEqual([
            'Laptop',
            'Curvy Monitor',
            'Gaming PC',
            'Hard Drive',
            'Clacky Keyboard',
            'USB Cable',
        ]);
    }

    describe('admin api', () => {
        it('group by product', () => testGroupByProduct(adminClient));

        it('no grouping', () => testNoGrouping(adminClient));

        it('matches search term', () => testMatchSearchTerm(adminClient));

        it('matches by facetId', () => testMatchFacetIds(adminClient));
    });

    describe('shop api', () => {
        it('group by product', () => testGroupByProduct(shopClient));

        it('no grouping', () => testNoGrouping(shopClient));

        it('matches search term', () => testMatchSearchTerm(shopClient));

        it('matches by facetId', () => testMatchFacetIds(shopClient));
    });
});
