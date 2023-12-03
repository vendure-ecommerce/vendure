/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DefaultJobQueuePlugin, DefaultSearchPlugin, mergeConfig } from '@vendure/core';
import { createTestEnvironment, registerInitializer, SqljsInitializer } from '@vendure/testing';
import path from 'path';
import { afterAll, beforeAll, bench, describe, expect } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import {
    SearchProductsShopQuery,
    SearchProductsShopQueryVariables,
} from './graphql/generated-e2e-shop-types';
import { SEARCH_PRODUCTS_SHOP } from './graphql/shop-definitions';
import { awaitRunningJobs } from './utils/await-running-jobs';

registerInitializer('sqljs', new SqljsInitializer(path.join(__dirname, '__data__'), 1000));

interface SearchProductsShopQueryVariablesExt extends SearchProductsShopQueryVariables {
    input: SearchProductsShopQueryVariables['input'] & {
        // This input field is dynamically added only when the `indexStockStatus` init option
        // is set to `true`, and therefore not included in the generated type. Therefore
        // we need to manually patch it here.
        inStock?: boolean;
    };
}

const { server, adminClient, shopClient } = createTestEnvironment(
    mergeConfig(testConfig(), {
        plugins: [DefaultSearchPlugin.init({ indexStockStatus: true }), DefaultJobQueuePlugin],
    }),
);

beforeAll(async () => {
    await server.init({
        initialData,
        productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-default-search.csv'),
        customerCount: 1,
    });
    await adminClient.asSuperAdmin();
    await awaitRunningJobs(adminClient);
}, TEST_SETUP_TIMEOUT_MS);

afterAll(async () => {
    await server.destroy();
});

const isDevelopment = process.env.NODE_ENV === 'development';
describe.skipIf(isDevelopment)('Default search plugin - benchmark', () => {
    bench(
        'group by product',
        async () => {
            await shopClient.query<SearchProductsShopQuery, SearchProductsShopQueryVariablesExt>(
                SEARCH_PRODUCTS_SHOP,
                {
                    input: {
                        groupByProduct: true,
                    },
                },
            );
        },
        {
            warmupTime: 0,
            warmupIterations: 1,
            time: 0,
            iterations: 1000,
            setup: (task, mode) => {
                if (mode === 'run') {
                    task.addEventListener('complete', e => {
                        const taskResult = e.task.result;
                        expect(taskResult?.mean).toBeLessThan(15);
                    });
                }
            },
        },
    );
});
