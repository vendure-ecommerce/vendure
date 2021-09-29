import { DefaultJobQueuePlugin, DefaultLogger, LogLevel, mergeConfig, UuidIdStrategy } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';
import { SearchProductsShop } from '../../core/e2e/graphql/generated-e2e-shop-types';
import { SEARCH_PRODUCTS_SHOP } from '../../core/e2e/graphql/shop-definitions';
import { awaitRunningJobs } from '../../core/e2e/utils/await-running-jobs';
import { ElasticsearchPlugin } from '../src/plugin';

import { GetCollectionList } from './graphql/generated-e2e-elasticsearch-plugin-types';
// tslint:disable-next-line:no-var-requires
const { elasticsearchHost, elasticsearchPort } = require('./constants');

/**
 * The Elasticsearch tests sometimes take a long time in CI due to limited resources.
 * We increase the timeout to 30 seconds to prevent failure due to timeouts.
 */
if (process.env.CI) {
    jest.setTimeout(10 * 3000);
}

// https://github.com/vendure-ecommerce/vendure/issues/494
describe('Elasticsearch plugin with UuidIdStrategy', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            apiOptions: {
                port: 4050,
            },
            entityIdStrategy: new UuidIdStrategy(),
            logger: new DefaultLogger({ level: LogLevel.Info }),
            plugins: [
                ElasticsearchPlugin.init({
                    indexPrefix: 'e2e-uuid-tests',
                    port: elasticsearchPort,
                    host: elasticsearchHost,
                }),
                DefaultJobQueuePlugin,
            ],
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
        await adminClient.query(REINDEX);
        await awaitRunningJobs(adminClient);
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('no term or filters', async () => {
        const { search } = await shopClient.query<SearchProductsShop.Query, SearchProductsShop.Variables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    groupByProduct: true,
                },
            },
        );
        expect(search.totalItems).toBe(20);
    });

    it('with search term', async () => {
        const { search } = await shopClient.query<SearchProductsShop.Query, SearchProductsShop.Variables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    groupByProduct: true,
                    term: 'laptop',
                },
            },
        );
        expect(search.totalItems).toBe(1);
    });

    it('with collectionId filter term', async () => {
        const { collections } = await shopClient.query<GetCollectionList.Query>(GET_COLLECTION_LIST);
        const { search } = await shopClient.query<SearchProductsShop.Query, SearchProductsShop.Variables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: {
                    groupByProduct: true,
                    collectionId: collections.items[0].id,
                },
            },
        );
        expect(search.items).not.toEqual([]);
    });
});

const REINDEX = gql`
    mutation Reindex {
        reindex {
            id
            queueName
            state
            progress
            duration
            result
        }
    }
`;

const GET_COLLECTION_LIST = gql`
    query GetCollectionList {
        collections {
            items {
                id
                name
            }
        }
    }
`;
