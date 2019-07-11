import gql from 'graphql-tag';
import path from 'path';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { GetProductList } from './graphql/generated-e2e-admin-types';
import { GET_PRODUCT_LIST } from './graphql/shared-definitions';
import { TestAdminClient, TestShopClient } from './test-client';
import { TestServer } from './test-server';

// tslint:disable:no-non-null-assertion

describe('Custom fields', () => {
    const adminClient = new TestAdminClient();
    const shopClient = new TestShopClient();
    const server = new TestServer();

    beforeAll(async () => {
        await server.init({
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        }, {
            customFields: {
                Product: [
                    { name: 'foo', type: 'string' },
                ],
            },
        });
        await adminClient.init();
        await shopClient.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('globalSettings.serverConfig.customFieldConfig', async () => {
        const { globalSettings } = await adminClient.query(gql`
            query {
                globalSettings {
                    serverConfig {
                        customFieldConfig {
                            Product {
                                name
                                type
                            }
                        }
                    }
                }
            }
        `);

        expect(globalSettings.serverConfig.customFieldConfig).toEqual({
            Product: [
                { name: 'foo', type: 'string' },
            ],
        });
    });

    it('works', async () => {
        const { products } = await adminClient.query(gql`
            query GetProductsCustomFields {
                products {
                    items {
                        id
                        name
                        customFields {
                            foo
                        }
                    }
                }
            }`, {
            options: {},
        });

        expect(products.items).toEqual([
            {
                id: 'T_1',
                name: 'Laptop',
                customFields: {
                    foo: null,
                },
            },
        ]);
    });
});
