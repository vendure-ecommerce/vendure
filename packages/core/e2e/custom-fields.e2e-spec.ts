import gql from 'graphql-tag';
import path from 'path';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { TestAdminClient, TestShopClient } from './test-client';
import { TestServer } from './test-server';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

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
                    { name: 'nullable', type: 'string' },
                    { name: 'notNullable', type: 'string', nullable: false, defaultValue: '' },
                    { name: 'stringWithDefault', type: 'string', defaultValue: 'hello' },
                    { name: 'localeStringWithDefault', type: 'localeString', defaultValue: 'hola' },
                    { name: 'intWithDefault', type: 'int', defaultValue: 5 },
                    { name: 'floatWithDefault', type: 'float', defaultValue: 5.5 },
                    { name: 'booleanWithDefault', type: 'boolean', defaultValue: true },
                    { name: 'dateTimeWithDefault', type: 'datetime', defaultValue: new Date('2019-04-30T12:59:16.4158386+02:00') },
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
                { name: 'nullable', type: 'string' },
                { name: 'notNullable', type: 'string' },
                { name: 'stringWithDefault', type: 'string' },
                { name: 'localeStringWithDefault', type: 'localeString' },
                { name: 'intWithDefault', type: 'int' },
                { name: 'floatWithDefault', type: 'float' },
                { name: 'booleanWithDefault', type: 'boolean' },
                { name: 'dateTimeWithDefault', type: 'datetime' },
            ],
        });
    });

    it('get nullable with no default', async () => {
        const { product } = await adminClient.query(gql`
            query {
                product(id: "T_1") {
                    id
                    name
                    customFields {
                        nullable
                    }
                }
            }`,
        );

        expect(product).toEqual({
            id: 'T_1',
            name: 'Laptop',
            customFields: {
                nullable: null,
            },
        });
    });

    it('get fields with default values', async () => {
        const { product } = await adminClient.query(gql`
            query {
                product(id: "T_1") {
                    id
                    name
                    customFields {
                        stringWithDefault
                        localeStringWithDefault
                        intWithDefault
                        floatWithDefault
                        booleanWithDefault
                        dateTimeWithDefault
                    }
                }
            }`,
        );

        expect(product).toEqual({
            id: 'T_1',
            name: 'Laptop',
            customFields: {
                stringWithDefault: 'hello',
                localeStringWithDefault: 'hola',
                intWithDefault: 5,
                floatWithDefault: 5.5,
                booleanWithDefault: true,
                dateTimeWithDefault: '2019-04-30T12:59:16.415Z',
            },
        });
    });

    it('update non-nullable field', assertThrowsWithMessage(async () => {
            await adminClient.query(gql`
                mutation {
                    updateProduct(input: {
                        id: "T_1"
                        customFields: {
                            notNullable: null
                        }
                    }) { id }
                }
            `);
        },
        'NOT NULL constraint failed: product.customFieldsNotnullable',
        ),
    );
});
