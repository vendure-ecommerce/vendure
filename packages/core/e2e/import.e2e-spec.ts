import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { dataDir, TEST_SETUP_TIMEOUT_MS, testConfig } from './config/test-config';
import { initialData } from './fixtures/e2e-initial-data';

describe('Import resolver', () => {
    const { server, adminClient } = createTestEnvironment({
        ...testConfig,
        customFields: {
            Product: [{ type: 'string', name: 'pageType' }],
            ProductVariant: [{ type: 'int', name: 'weight' }],
        },
    });

    beforeAll(async () => {
        const token = await server.init({
            dataDir,
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-empty.csv'),
            customerCount: 0,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('imports products', async () => {
        // TODO: waste a few more hours actually fixing this for real
        // Forgive me this abomination of a work-around.
        // On the inital run (as in CI), when the sqlite db has just been populated,
        // this test will fail due to an "out of memory" exception originating from
        // SqljsQueryRunner.ts:79:22, which is part of the findOne() operation on the
        // Session repository called from the AuthService.validateSession() method.
        // After several hours of fruitless hunting, I did what any desperate JavaScript
        // developer would do, and threw in a setTimeout. Which of course "works"...
        const timeout = process.env.CI ? 2000 : 1000;
        await new Promise(resolve => {
            setTimeout(resolve, timeout);
        });

        const csvFile = path.join(__dirname, 'fixtures', 'product-import.csv');
        const result = await adminClient.fileUploadMutation({
            mutation: gql`
                mutation ImportProducts($csvFile: Upload!) {
                    importProducts(csvFile: $csvFile) {
                        imported
                        processed
                        errors
                    }
                }
            `,
            filePaths: [csvFile],
            mapVariables: () => ({ csvFile: null }),
        });

        expect(result.importProducts.errors).toEqual([
            'Invalid Record Length: header length is 16, got 1 on line 8',
        ]);
        expect(result.importProducts.imported).toBe(4);
        expect(result.importProducts.processed).toBe(4);

        const productResult = await adminClient.query(
            gql`
                query GetProducts($options: ProductListOptions) {
                    products(options: $options) {
                        totalItems
                        items {
                            id
                            name
                            slug
                            description
                            featuredAsset {
                                id
                                name
                                preview
                                source
                            }
                            assets {
                                id
                                name
                                preview
                                source
                            }
                            optionGroups {
                                id
                                code
                                name
                            }
                            facetValues {
                                id
                                name
                                facet {
                                    id
                                    name
                                }
                            }
                            customFields {
                                pageType
                            }
                            variants {
                                id
                                name
                                sku
                                price
                                taxCategory {
                                    id
                                    name
                                }
                                options {
                                    id
                                    code
                                }
                                assets {
                                    id
                                    name
                                    preview
                                    source
                                }
                                featuredAsset {
                                    id
                                    name
                                    preview
                                    source
                                }
                                facetValues {
                                    id
                                    code
                                    name
                                    facet {
                                        id
                                        name
                                    }
                                }
                                stockOnHand
                                trackInventory
                                stockMovements {
                                    items {
                                        ... on StockMovement {
                                            id
                                            type
                                            quantity
                                        }
                                    }
                                }
                                customFields {
                                    weight
                                }
                            }
                        }
                    }
                }
            `,
            {
                options: {},
            },
        );

        expect(productResult.products.totalItems).toBe(4);
        expect(productResult.products.items).toMatchSnapshot();
    }, 20000);
});
