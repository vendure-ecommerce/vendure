import gql from 'graphql-tag';
import * as path from 'path';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { TestClient } from './test-client';
import { TestServer } from './test-server';

describe('Import resolver', () => {
    const client = new TestClient();
    const server = new TestServer();

    beforeAll(async () => {
        const token = await server.init({
            productCount: 0,
            customerCount: 0,
        });
        await client.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('imports products', async () => {
        const csvFile = path.join(__dirname, 'fixtures', 'product-import.csv');
        const result = await client.importProducts(csvFile);

        expect(result.importProducts.errors).toEqual([]);
        expect(result.importProducts.importedCount).toBe(4);

        const productResult = await client.query(gql`
            query {
                products {
                    totalItems
                    items {
                        id
                        name
                        slug
                        description
                        featuredAsset {
                            id
                            name
                        }
                        assets {
                            id
                            name
                        }
                        optionGroups {
                            id
                            code
                            name
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
                        }
                    }
                }
            }
        `);

        expect(productResult.products.totalItems).toBe(4);
        expect(productResult.products.items).toMatchSnapshot();
    });
});
