import { KeyValueCache } from '@apollo/utils.keyvaluecache';
import { mergeConfig } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import * as Codegen from './graphql/generated-e2e-admin-types';
import { GET_PRODUCT_LIST, GET_PRODUCT_SIMPLE } from './graphql/shared-definitions';

class MockCache implements KeyValueCache<string> {
    static getCalls: Array<{ key: string; result: string | undefined }> = [];
    static setCalls: Array<{ key: string; value: string; options?: { ttl?: number } }> = [];
    static deleteCalls: Array<{ key: string; result: boolean }> = [];

    private store = new Map<string, string>();

    static reset() {
        this.getCalls = [];
        this.setCalls = [];
        this.deleteCalls = [];
    }

    get(key: string): Promise<string | undefined> {
        // eslint-disable-next-line
        console.log(`MockCache get: ${key}`);
        const result = this.store.get(key);
        MockCache.getCalls.push({ key, result });
        return Promise.resolve(result);
    }

    set(key: string, value: string, options?: { ttl?: number }): Promise<void> {
        // eslint-disable-next-line
        console.log(`MockCache set: ${key}`, value);
        this.store.set(key, value);
        MockCache.setCalls.push({ key, value, options });
        return Promise.resolve();
    }

    delete(key: string): Promise<boolean> {
        const result = this.store.delete(key);
        MockCache.deleteCalls.push({ key, result });
        return Promise.resolve(result);
    }
}

describe('Apollo cache configuration', () => {
    describe('with custom cache implementation', () => {
        const mockCache = new MockCache();
        const { server, adminClient, shopClient } = createTestEnvironment(
            mergeConfig(testConfig(), {
                apiOptions: {
                    cache: mockCache,
                },
            }),
        );

        beforeAll(async () => {
            await server.init({
                initialData,
                productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
                customerCount: 1,
            });
            await adminClient.asSuperAdmin();
        }, TEST_SETUP_TIMEOUT_MS);

        afterAll(async () => {
            await server.destroy();
        });

        it('should configure Apollo Server with custom cache', async () => {
            MockCache.reset();

            // Make a GraphQL query that could potentially be cached
            const result = await shopClient.query<
                Codegen.GetProductListQuery,
                Codegen.GetProductListQueryVariables
            >(GET_PRODUCT_LIST, {
                options: {
                    filter: { id: { eq: 'T_1' } },
                    take: 1,
                },
            });

            expect(result.products.items.length).toBe(1);
            expect(result.products.items[0].id).toBe('T_1');
            expect(result.products.items[0].name).toBe('Laptop');
        });

        it('should handle cache operations without errors', async () => {
            MockCache.reset();

            // Test multiple queries to potentially trigger cache operations
            const shopResponse = await shopClient.query<
                Codegen.GetProductListQuery,
                Codegen.GetProductListQueryVariables
            >(GET_PRODUCT_LIST, {
                options: {
                    take: 1,
                },
            });

            expect(shopResponse.products.items.length).toBe(1);

            const adminResponse = await adminClient.query<
                Codegen.GetProductListQuery,
                Codegen.GetProductListQueryVariables
            >(GET_PRODUCT_LIST, {
                options: { take: 1 },
            });

            expect(adminResponse.products.items.length).toBe(1);
        });

        it('should work with both shop and admin APIs', async () => {
            MockCache.reset();

            const [shopResult, adminResult] = await Promise.all([
                shopClient.query<Codegen.GetProductSimpleQuery, Codegen.GetProductSimpleQueryVariables>(
                    GET_PRODUCT_SIMPLE,
                    {
                        id: 'T_1',
                    },
                ),
                adminClient.query<Codegen.GetProductSimpleQuery, Codegen.GetProductSimpleQueryVariables>(
                    GET_PRODUCT_SIMPLE,
                    {
                        id: 'T_1',
                    },
                ),
            ]);

            expect(shopResult.product).toBeDefined();
            expect(adminResult.product).toBeDefined();
            expect(shopResult.product?.id).toBe(adminResult.product?.id);
        });
    });

    describe('with bounded cache', () => {
        const { server, adminClient, shopClient } = createTestEnvironment(
            mergeConfig(testConfig(), {
                apiOptions: {
                    cache: 'bounded',
                },
            }),
        );

        beforeAll(async () => {
            await server.init({
                initialData,
                productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
                customerCount: 1,
            });
            await adminClient.asSuperAdmin();
        }, TEST_SETUP_TIMEOUT_MS);

        afterAll(async () => {
            await server.destroy();
        });

        it('should configure Apollo Server with bounded cache', async () => {
            const result = await shopClient.query<
                Codegen.GetProductSimpleQuery,
                Codegen.GetProductSimpleQueryVariables
            >(GET_PRODUCT_SIMPLE, {
                id: 'T_1',
            });

            expect(result.product).toBeDefined();
            expect(result.product?.id).toBe('T_1');
        });

        it('should handle concurrent requests with bounded cache', async () => {
            const queries = Array.from({ length: 5 }, (_, i) =>
                shopClient.query<Codegen.GetProductSimpleQuery, Codegen.GetProductSimpleQueryVariables>(
                    GET_PRODUCT_SIMPLE,
                    {
                        id: `T_${i + 1}`,
                    },
                ),
            );

            const results = await Promise.all(queries);

            results.forEach((result, index) => {
                if (result.product) {
                    expect(result.product.id).toBe(`T_${index + 1}`);
                }
            });
        });
    });

    describe('without cache configuration', () => {
        const { server, adminClient, shopClient } = createTestEnvironment(testConfig());

        beforeAll(async () => {
            await server.init({
                initialData,
                productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
                customerCount: 1,
            });
            await adminClient.asSuperAdmin();
        }, TEST_SETUP_TIMEOUT_MS);

        afterAll(async () => {
            await server.destroy();
        });

        it('should work without cache configuration', async () => {
            const result = await shopClient.query<
                Codegen.GetProductSimpleQuery,
                Codegen.GetProductSimpleQueryVariables
            >(GET_PRODUCT_SIMPLE, {
                id: 'T_1',
            });

            expect(result.product).toBeDefined();
            expect(result.product?.id).toBe('T_1');
        });
    });
});
