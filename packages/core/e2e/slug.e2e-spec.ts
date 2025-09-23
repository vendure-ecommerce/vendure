import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import { CREATE_PRODUCT } from './graphql/shared-definitions';

describe('Slug generation', () => {
    const { server, adminClient } = createTestEnvironment(testConfig());

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('slugForEntity query', () => {
        describe('basic slug generation', () => {
            it('generates a simple slug', async () => {
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Product',
                        fieldName: 'slug',
                        inputValue: 'Test Product',
                    },
                });

                expect(result.slugForEntity).toBe('test-product');
            });

            it('handles multiple spaces', async () => {
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Product',
                        fieldName: 'slug',
                        inputValue: 'Test   Product   Name',
                    },
                });

                expect(result.slugForEntity).toBe('test-product-name');
            });

            it('converts uppercase to lowercase', async () => {
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Product',
                        fieldName: 'slug',
                        inputValue: 'TEST PRODUCT NAME',
                    },
                });

                expect(result.slugForEntity).toBe('test-product-name');
            });

            it('preserves numbers', async () => {
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Product',
                        fieldName: 'slug',
                        inputValue: 'Product 123 Version 2',
                    },
                });

                expect(result.slugForEntity).toBe('product-123-version-2');
            });
        });

        describe('special characters and unicode', () => {
            it('removes special characters', async () => {
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Product',
                        fieldName: 'slug',
                        inputValue: 'Product!@#$%^&*()_+Name',
                    },
                });

                expect(result.slugForEntity).toBe('productname');
            });

            it('handles special characters with spaces', async () => {
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Product',
                        fieldName: 'slug',
                        inputValue: 'Product !@#$ Name',
                    },
                });

                expect(result.slugForEntity).toBe('product-name');
            });

            it('handles diacritical marks (accents)', async () => {
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Product',
                        fieldName: 'slug',
                        inputValue: 'Café Français naïve résumé',
                    },
                });

                expect(result.slugForEntity).toBe('cafe-francais-naive-resume');
            });

            it('handles German umlauts', async () => {
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Product',
                        fieldName: 'slug',
                        inputValue: 'Über größer schön',
                    },
                });

                expect(result.slugForEntity).toBe('uber-groer-schon');
            });

            it('handles Spanish characters', async () => {
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Product',
                        fieldName: 'slug',
                        inputValue: 'Niño Español Añejo',
                    },
                });

                expect(result.slugForEntity).toBe('nino-espanol-anejo');
            });

            it('handles non-Latin scripts (removes them)', async () => {
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Product',
                        fieldName: 'slug',
                        inputValue: 'Product 商品 المنتج उत्पाद',
                    },
                });

                expect(result.slugForEntity).toBe('product');
            });

            it('handles emoji (removes them)', async () => {
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Product',
                        fieldName: 'slug',
                        inputValue: 'Cool Product 😎 🚀 Amazing',
                    },
                });

                expect(result.slugForEntity).toBe('cool-product-amazing');
            });

            it('handles punctuation and symbols', async () => {
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Product',
                        fieldName: 'slug',
                        inputValue: 'Product: The Best! (Version 2.0) - New & Improved',
                    },
                });

                expect(result.slugForEntity).toBe('product-the-best-version-20-new-improved');
            });
        });

        describe('edge cases', () => {
            it('handles leading and trailing spaces', async () => {
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Product',
                        fieldName: 'slug',
                        inputValue: '   Test Product   ',
                    },
                });

                expect(result.slugForEntity).toBe('test-product');
            });

            it('handles hyphens correctly', async () => {
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Product',
                        fieldName: 'slug',
                        inputValue: 'Test--Product---Name',
                    },
                });

                expect(result.slugForEntity).toBe('test-product-name');
            });

            it('handles leading and trailing hyphens', async () => {
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Product',
                        fieldName: 'slug',
                        inputValue: '-Test Product-',
                    },
                });

                expect(result.slugForEntity).toBe('test-product');
            });

            it('handles empty string', async () => {
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Product',
                        fieldName: 'slug',
                        inputValue: '',
                    },
                });

                expect(result.slugForEntity).toBe('');
            });

            it('handles only special characters', async () => {
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Product',
                        fieldName: 'slug',
                        inputValue: '!@#$%^&*()',
                    },
                });

                expect(result.slugForEntity).toBe('');
            });

            it('handles mixed case with numbers and special chars', async () => {
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Product',
                        fieldName: 'slug',
                        inputValue: '100% Natural & Organic Product #1',
                    },
                });

                expect(result.slugForEntity).toBe('100-natural-organic-product-1');
            });
        });

        describe('uniqueness handling', () => {
            it('appends number for duplicate slugs', async () => {
                // First, create a product with slug 'laptop'
                const createProduct = await adminClient.query(CREATE_PRODUCT, {
                    input: {
                        translations: [
                            {
                                languageCode: 'en',
                                name: 'Laptop',
                                slug: 'laptop',
                                description: 'A laptop computer',
                            },
                        ],
                    },
                });

                // Now try to generate slug for another product with the same base slug
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Product',
                        fieldName: 'slug',
                        inputValue: 'Laptop',
                    },
                });

                expect(result.slugForEntity).toBe('laptop-1');
            });

            it('increments counter for multiple duplicates', async () => {
                // Create products with slugs 'phone' and 'phone-1'
                await adminClient.query(CREATE_PRODUCT, {
                    input: {
                        translations: [
                            {
                                languageCode: 'en',
                                name: 'Phone',
                                slug: 'phone',
                                description: 'A smartphone',
                            },
                        ],
                    },
                });

                await adminClient.query(CREATE_PRODUCT, {
                    input: {
                        translations: [
                            {
                                languageCode: 'en',
                                name: 'Phone 2',
                                slug: 'phone-1',
                                description: 'Another smartphone',
                            },
                        ],
                    },
                });

                // Now generate slug for another phone
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Product',
                        fieldName: 'slug',
                        inputValue: 'Phone',
                    },
                });

                expect(result.slugForEntity).toBe('phone-2');
            });

            it('excludes own ID when checking uniqueness', async () => {
                // Create a product
                const createResult = await adminClient.query(CREATE_PRODUCT, {
                    input: {
                        translations: [
                            {
                                languageCode: 'en',
                                name: 'Tablet',
                                slug: 'tablet',
                                description: 'A tablet device',
                            },
                        ],
                    },
                });

                const productId = createResult.createProduct.id;

                // Generate slug for the same product (updating scenario)
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Product',
                        fieldName: 'slug',
                        inputValue: 'Tablet',
                        entityId: productId,
                    },
                });

                // Should return the same slug without appending number
                expect(result.slugForEntity).toBe('tablet');
            });

            it('works with different entity types', async () => {
                // Test with Collection entity (slug field is in CollectionTranslation)
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Collection',
                        fieldName: 'slug',
                        inputValue: 'Summer Collection 2024',
                    },
                });

                expect(result.slugForEntity).toBe('summer-collection-2024');
            });
        });

        describe('auto-detection functionality', () => {
            it('auto-detects translation entity for slug field', async () => {
                // Using base entity name, should automatically detect ProductTranslation
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Product',
                        fieldName: 'slug',
                        inputValue: 'Auto Detection Test',
                    },
                });

                expect(result.slugForEntity).toBe('auto-detection-test');
            });

            it('works with explicit translation entity names', async () => {
                // Still works when explicitly using translation entity name
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'ProductTranslation',
                        fieldName: 'slug',
                        inputValue: 'Explicit Translation Test',
                    },
                });

                expect(result.slugForEntity).toBe('explicit-translation-test');
            });

            it('works with Collection entity auto-detection', async () => {
                // Using base entity name, should automatically detect CollectionTranslation
                const result = await adminClient.query(SLUG_FOR_ENTITY, {
                    input: {
                        entityName: 'Collection',
                        fieldName: 'slug',
                        inputValue: 'Collection Auto Detection',
                    },
                });

                expect(result.slugForEntity).toBe('collection-auto-detection');
            });
        });

        describe('error handling', () => {
            it('throws error for non-existent entity', async () => {
                try {
                    await adminClient.query(SLUG_FOR_ENTITY, {
                        input: {
                            entityName: 'NonExistentEntity',
                            fieldName: 'slug',
                            inputValue: 'Test',
                        },
                    });
                    expect.fail('Should have thrown an error');
                } catch (error: any) {
                    expect(error.message).toContain('error.entity-not-found');
                }
            });

            it('throws error for non-existent field', async () => {
                try {
                    await adminClient.query(SLUG_FOR_ENTITY, {
                        input: {
                            entityName: 'Product',
                            fieldName: 'nonExistentField',
                            inputValue: 'Test',
                        },
                    });
                    expect.fail('Should have thrown an error');
                } catch (error: any) {
                    expect(error.message).toContain('error.entity-has-no-field');
                }
            });
        });
    });
});

const SLUG_FOR_ENTITY = gql`
    query SlugForEntity($input: SlugForEntityInput!) {
        slugForEntity(input: $input)
    }
`;
