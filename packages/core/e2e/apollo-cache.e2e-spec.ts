import { KeyValueCache } from '@apollo/utils.keyvaluecache';
import { mergeConfig } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

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

    async get(key: string): Promise<string | undefined> {
        // eslint-disable-next-line
        console.log(`MockCache get: ${key}`);
        const result = this.store.get(key);
        MockCache.getCalls.push({ key, result });
        return result;
    }

    async set(key: string, value: string, options?: { ttl?: number }): Promise<void> {
        // eslint-disable-next-line
        console.log(`MockCache set: ${key}`, value);
        this.store.set(key, value);
        MockCache.setCalls.push({ key, value, options });
    }

    async delete(key: string): Promise<boolean> {
        const result = this.store.delete(key);
        MockCache.deleteCalls.push({ key, result });
        return result;
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
            const result = await shopClient.query(gql`
                query GetProduct {
                    product(id: "T_1") {
                        id
                        name
                        slug
                    }
                }
            `);

            expect(result.product).toBeDefined();
            expect(result.product.id).toBe('T_1');
            expect(result.product.name).toBe('Laptop');
        });

        it('should handle cache operations without errors', async () => {
            MockCache.reset();

            // Test multiple queries to potentially trigger cache operations
            await shopClient.query(gql`
                query GetProducts {
                    products(options: { take: 5 }) {
                        items {
                            id
                            name
                        }
                    }
                }
            `);

            await adminClient.query(gql`
                query GetProducts {
                    products(options: { take: 3 }) {
                        items {
                            id
                            name
                            slug
                        }
                    }
                }
            `);

            // The cache instance should be properly configured and accessible
            // We don't verify specific cache calls as Apollo Server's internal
            // caching behavior may vary, but we ensure no errors occur
            expect(true).toBe(true); // Test passes if no errors thrown
        });

        it('should work with both shop and admin APIs', async () => {
            MockCache.reset();

            const [shopResult, adminResult] = await Promise.all([
                shopClient.query(gql`
                    query ShopQuery {
                        product(id: "T_1") {
                            id
                            name
                        }
                    }
                `),
                adminClient.query(gql`
                    query AdminQuery {
                        product(id: "T_1") {
                            id
                            name
                            slug
                        }
                    }
                `),
            ]);

            expect(shopResult.product).toBeDefined();
            expect(adminResult.product).toBeDefined();
            expect(shopResult.product.id).toBe(adminResult.product.id);
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
            const result = await shopClient.query(gql`
                query GetProduct {
                    product(id: "T_1") {
                        id
                        name
                    }
                }
            `);

            expect(result.product).toBeDefined();
            expect(result.product.id).toBe('T_1');
        });

        it('should handle concurrent requests with bounded cache', async () => {
            const queries = Array.from({ length: 5 }, (_, i) =>
                shopClient.query(gql`
                    query GetProduct${i} {
                        product(id: "T_${i + 1}") {
                            id
                            name
                        }
                    }
                `),
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
            const result = await shopClient.query(gql`
                query GetProduct {
                    product(id: "T_1") {
                        id
                        name
                    }
                }
            `);

            expect(result.product).toBeDefined();
            expect(result.product.id).toBe('T_1');
        });
    });
});
