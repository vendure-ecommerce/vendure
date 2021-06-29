import {
    Asset,
    Collection,
    Country,
    CustomFields,
    defaultShippingCalculator,
    defaultShippingEligibilityChecker,
    Facet,
    FacetValue,
    manualFulfillmentHandler,
    mergeConfig,
    Product,
    ProductOption,
    ProductOptionGroup,
    ProductVariant,
    ShippingMethod,
} from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { AddItemToOrder } from './graphql/generated-e2e-shop-types';
import { ADD_ITEM_TO_ORDER } from './graphql/shop-definitions';
import { sortById } from './utils/test-order-utils';

// From https://github.com/microsoft/TypeScript/issues/13298#issuecomment-654906323
// to ensure that we _always_ test all entities which support custom fields
type ValueOf<T> = T[keyof T];
type NonEmptyArray<T> = [T, ...T[]];
type MustInclude<T, U extends T[]> = [T] extends [ValueOf<U>] ? U : never;
const enumerate = <T>() => <U extends NonEmptyArray<T>>(...elements: MustInclude<T, U>) => elements;

const entitiesWithCustomFields = enumerate<keyof CustomFields>()(
    'Address',
    'Administrator',
    'Asset',
    'Channel',
    'Collection',
    'Customer',
    'Facet',
    'FacetValue',
    'Fulfillment',
    'GlobalSettings',
    'Order',
    'OrderLine',
    'Product',
    'ProductOption',
    'ProductOptionGroup',
    'ProductVariant',
    'User',
    'ShippingMethod',
);

const customFieldConfig: CustomFields = {};
for (const entity of entitiesWithCustomFields) {
    customFieldConfig[entity] = [
        { name: 'single', type: 'relation', entity: Asset, graphQLType: 'Asset', list: false },
        { name: 'multi', type: 'relation', entity: Asset, graphQLType: 'Asset', list: true },
    ];
}
customFieldConfig.Product?.push(
    { name: 'cfCollection', type: 'relation', entity: Collection, list: false },
    { name: 'cfCountry', type: 'relation', entity: Country, list: false },
    { name: 'cfFacetValue', type: 'relation', entity: FacetValue, list: false },
    { name: 'cfFacet', type: 'relation', entity: Facet, list: false },
    { name: 'cfProductOptionGroup', type: 'relation', entity: ProductOptionGroup, list: false },
    { name: 'cfProductOption', type: 'relation', entity: ProductOption, list: false },
    { name: 'cfProductVariant', type: 'relation', entity: ProductVariant, list: false },
    { name: 'cfProduct', type: 'relation', entity: Product, list: false },
    { name: 'cfShippingMethod', type: 'relation', entity: ShippingMethod, list: false },
);

const customConfig = mergeConfig(testConfig, {
    dbConnectionOptions: {
        timezone: 'Z',
    },
    customFields: customFieldConfig,
});

describe('Custom field relations', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(customConfig);

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 3,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('customFieldConfig query returns entity and scalar fields', async () => {
        const { globalSettings } = await adminClient.query(gql`
            query {
                globalSettings {
                    serverConfig {
                        customFieldConfig {
                            Customer {
                                ... on RelationCustomFieldConfig {
                                    name
                                    entity
                                    scalarFields
                                }
                            }
                        }
                    }
                }
            }
        `);

        const single = globalSettings.serverConfig.customFieldConfig.Customer[0];
        expect(single.entity).toBe('Asset');
        expect(single.scalarFields).toEqual([
            'id',
            'createdAt',
            'updatedAt',
            'name',
            'type',
            'fileSize',
            'mimeType',
            'width',
            'height',
            'source',
            'preview',
        ]);
    });

    describe('special data resolution', () => {
        let productId: string;

        it('translatable entities get translated', async () => {
            const { createProduct } = await adminClient.query(gql`
                mutation {
                    createProduct(
                        input: {
                            translations: [
                                {
                                    languageCode: en
                                    name: "Test product"
                                    description: ""
                                    slug: "test-product"
                                }
                            ]
                            customFields: {
                                cfCollectionId: "T_1"
                                cfCountryId: "T_1"
                                cfFacetValueId: "T_1"
                                cfFacetId: "T_1"
                                cfProductOptionGroupId: "T_1"
                                cfProductOptionId: "T_1"
                                cfProductVariantId: "T_1"
                                cfProductId: "T_1"
                                cfShippingMethodId: "T_1"
                            }
                        }
                    ) {
                        id
                        customFields {
                            cfCollection {
                                languageCode
                                name
                            }
                            cfCountry {
                                languageCode
                                name
                            }
                            cfFacetValue {
                                languageCode
                                name
                            }
                            cfFacet {
                                languageCode
                                name
                            }
                            cfProductOptionGroup {
                                languageCode
                                name
                            }
                            cfProductOption {
                                languageCode
                                name
                            }
                            cfProductVariant {
                                languageCode
                                name
                            }
                            cfProduct {
                                languageCode
                                name
                            }
                            cfShippingMethod {
                                name
                            }
                        }
                    }
                }
            `);

            productId = createProduct.id;

            expect(createProduct.customFields.cfCollection).toEqual({
                languageCode: 'en',
                name: '__root_collection__',
            });
            expect(createProduct.customFields.cfCountry).toEqual({ languageCode: 'en', name: 'Australia' });
            expect(createProduct.customFields.cfFacetValue).toEqual({
                languageCode: 'en',
                name: 'electronics',
            });
            expect(createProduct.customFields.cfFacet).toEqual({ languageCode: 'en', name: 'category' });
            expect(createProduct.customFields.cfProductOptionGroup).toEqual({
                languageCode: 'en',
                name: 'screen size',
            });
            expect(createProduct.customFields.cfProductOption).toEqual({
                languageCode: 'en',
                name: '13 inch',
            });
            expect(createProduct.customFields.cfProductVariant).toEqual({
                languageCode: 'en',
                name: 'Laptop 13 inch 8GB',
            });
            expect(createProduct.customFields.cfProduct).toEqual({ languageCode: 'en', name: 'Laptop' });
            expect(createProduct.customFields.cfShippingMethod).toEqual({ name: 'Standard Shipping' });
        });

        it('ProductVariant prices get resolved', async () => {
            const { product } = await adminClient.query(gql`
                query {
                    product(id: "${productId}") {
                        id
                        customFields {
                            cfProductVariant {
                                price
                                currencyCode
                                priceWithTax
                            }
                        }
                    }
            }`);

            expect(product.customFields.cfProductVariant).toEqual({
                price: 129900,
                currencyCode: 'USD',
                priceWithTax: 155880,
            });
        });
    });

    describe('entity-specific implementation', () => {
        function assertCustomFieldIds(customFields: any, single: string, multi: string[]) {
            expect(customFields.single).toEqual({ id: single });
            expect(customFields.multi.sort(sortById)).toEqual(multi.map(id => ({ id })));
        }
        const customFieldsSelection = `
            customFields {
                single {
                    id
                }
                multi {
                    id
                }
            }`;

        describe('Address entity', () => {
            it('admin createCustomerAddress', async () => {
                const { createCustomerAddress } = await adminClient.query(gql`
                        mutation {
                            createCustomerAddress(
                                customerId: "T_1"
                                input: {
                                    countryCode: "GB"
                                    streetLine1: "Test Street"
                                    customFields: { singleId: "T_1", multiIds: ["T_1", "T_2"] }
                                }
                            ) {
                                id
                                ${customFieldsSelection}
                            }
                        }
                    `);

                assertCustomFieldIds(createCustomerAddress.customFields, 'T_1', ['T_1', 'T_2']);
            });

            it('shop createCustomerAddress', async () => {
                await shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');
                const { createCustomerAddress } = await shopClient.query(gql`
                        mutation {
                            createCustomerAddress(
                                input: {
                                    countryCode: "GB"
                                    streetLine1: "Test Street"
                                    customFields: { singleId: "T_1", multiIds: ["T_1", "T_2"] }
                                }
                            ) {
                                id
                                ${customFieldsSelection}
                            }
                        }
                    `);

                assertCustomFieldIds(createCustomerAddress.customFields, 'T_1', ['T_1', 'T_2']);
            });

            it('admin updateCustomerAddress', async () => {
                const { updateCustomerAddress } = await adminClient.query(gql`
                        mutation {
                            updateCustomerAddress(
                                input: { id: "T_1", customFields: { singleId: "T_2", multiIds: ["T_3", "T_4"] } }
                            ) {
                                id
                                ${customFieldsSelection}
                            }
                        }
                    `);

                assertCustomFieldIds(updateCustomerAddress.customFields, 'T_2', ['T_3', 'T_4']);
            });

            it('shop updateCustomerAddress', async () => {
                const { updateCustomerAddress } = await shopClient.query(gql`
                        mutation {
                            updateCustomerAddress(
                                input: { id: "T_1", customFields: { singleId: "T_3", multiIds: ["T_4", "T_2"] } }
                            ) {
                                id
                                ${customFieldsSelection}
                            }
                        }
                    `);

                assertCustomFieldIds(updateCustomerAddress.customFields, 'T_3', ['T_2', 'T_4']);
            });
        });

        describe('Collection entity', () => {
            let collectionId: string;
            it('admin createCollection', async () => {
                const { createCollection } = await adminClient.query(gql`
                        mutation {
                            createCollection(
                                input: {
                                    translations: [
                                        { languageCode: en, name: "Test", description: "test", slug: "test" }
                                    ]
                                    filters: []
                                    customFields: { singleId: "T_1", multiIds: ["T_1", "T_2"] }
                                }
                            ) {
                                id
                                ${customFieldsSelection}
                            }
                        }
                    `);
                assertCustomFieldIds(createCollection.customFields, 'T_1', ['T_1', 'T_2']);
                collectionId = createCollection.id;
            });

            it('admin updateCollection', async () => {
                const { updateCollection } = await adminClient.query(gql`
                        mutation {
                            updateCollection(
                                input: {
                                    id: "${collectionId}"
                                    customFields: { singleId: "T_2", multiIds: ["T_3", "T_4"] }
                                }
                            ) {
                                id
                                ${customFieldsSelection}
                            }
                        }
                    `);

                assertCustomFieldIds(updateCollection.customFields, 'T_2', ['T_3', 'T_4']);
            });
        });

        describe('Customer entity', () => {
            let customerId: string;
            it('admin createCustomer', async () => {
                const { createCustomer } = await adminClient.query(gql`
                        mutation {
                            createCustomer(
                                input: {
                                    emailAddress: "test@test.com"
                                    firstName: "Test"
                                    lastName: "Person"
                                    customFields: { singleId: "T_1", multiIds: ["T_1", "T_2"] }
                                }
                            ) {
                                ... on Customer {
                                    id
                                    ${customFieldsSelection}
                                }
                            }
                        }
                    `);

                assertCustomFieldIds(createCustomer.customFields, 'T_1', ['T_1', 'T_2']);
                customerId = createCustomer.id;
            });

            it('admin updateCustomer', async () => {
                const { updateCustomer } = await adminClient.query(gql`
                        mutation {
                            updateCustomer(
                                input: {
                                    id: "${customerId}"
                                    customFields: { singleId: "T_2", multiIds: ["T_3", "T_4"] }
                                }
                            ) {
                                ...on Customer {
                                    id
                                    ${customFieldsSelection}
                                }
                            }
                        }
                    `);
                assertCustomFieldIds(updateCustomer.customFields, 'T_2', ['T_3', 'T_4']);
            });

            it('shop updateCustomer', async () => {
                const { updateCustomer } = await shopClient.query(gql`
                        mutation {
                            updateCustomer(input: { customFields: { singleId: "T_4", multiIds: ["T_2", "T_4"] } }) {
                                id
                                ${customFieldsSelection}
                            }
                        }
                    `);
                assertCustomFieldIds(updateCustomer.customFields, 'T_4', ['T_2', 'T_4']);
            });
        });

        describe('Facet entity', () => {
            let facetId: string;
            it('admin createFacet', async () => {
                const { createFacet } = await adminClient.query(gql`
                        mutation {
                            createFacet(
                                input: {
                                    code: "test"
                                    isPrivate: false
                                    translations: [{ languageCode: en, name: "test" }]
                                    customFields: { singleId: "T_1", multiIds: ["T_1", "T_2"] }
                                }
                            ) {
                                id
                                ${customFieldsSelection}
                            }
                        }
                    `);

                assertCustomFieldIds(createFacet.customFields, 'T_1', ['T_1', 'T_2']);
                facetId = createFacet.id;
            });

            it('admin updateFacet', async () => {
                const { updateFacet } = await adminClient.query(gql`
                        mutation {
                            updateFacet(
                                input: {
                                    id: "${facetId}"
                                    customFields: { singleId: "T_2", multiIds: ["T_3", "T_4"] }
                                }
                            ) {
                                id
                                ${customFieldsSelection}
                            }
                        }
                    `);
                assertCustomFieldIds(updateFacet.customFields, 'T_2', ['T_3', 'T_4']);
            });
        });

        describe('FacetValue entity', () => {
            let facetValueId: string;
            it('admin createFacetValues', async () => {
                const { createFacetValues } = await adminClient.query(gql`
                        mutation {
                            createFacetValues(
                                input: {
                                    code: "test"
                                    facetId: "T_1"
                                    translations: [{ languageCode: en, name: "test" }]
                                    customFields: { singleId: "T_1", multiIds: ["T_1", "T_2"] }
                                }
                            ) {
                                id
                                ${customFieldsSelection}
                            }
                        }
                    `);

                assertCustomFieldIds(createFacetValues[0].customFields, 'T_1', ['T_1', 'T_2']);
                facetValueId = createFacetValues[0].id;
            });

            it('admin updateFacetValues', async () => {
                const { updateFacetValues } = await adminClient.query(gql`
                        mutation {
                            updateFacetValues(
                                input: {
                                    id: "${facetValueId}"
                                    customFields: { singleId: "T_2", multiIds: ["T_3", "T_4"] }
                                }
                            ) {
                                id
                                ${customFieldsSelection}
                            }
                        }
                    `);
                assertCustomFieldIds(updateFacetValues[0].customFields, 'T_2', ['T_3', 'T_4']);
            });
        });

        describe('Fulfillment entity', () => {
            // Currently no GraphQL API to set customFields on fulfillments
        });

        describe('GlobalSettings entity', () => {
            it('admin updateGlobalSettings', async () => {
                const { updateGlobalSettings } = await adminClient.query(gql`
                        mutation {
                            updateGlobalSettings(
                                input: {
                                    customFields: { singleId: "T_2", multiIds: ["T_3", "T_4"] }
                                }
                            ) {
                                ... on GlobalSettings {
                                    id
                                    ${customFieldsSelection}
                                }
                            }
                        }
                    `);
                assertCustomFieldIds(updateGlobalSettings.customFields, 'T_2', ['T_3', 'T_4']);
            });
        });

        describe('Order entity', () => {
            let orderId: string;

            beforeAll(async () => {
                const { addItemToOrder } = await shopClient.query<any, AddItemToOrder.Variables>(
                    ADD_ITEM_TO_ORDER,
                    {
                        productVariantId: 'T_1',
                        quantity: 1,
                    },
                );

                orderId = addItemToOrder.id;
            });

            it('shop setOrderCustomFields', async () => {
                const { setOrderCustomFields } = await shopClient.query(gql`
                        mutation {
                            setOrderCustomFields(
                                input: {
                                    customFields: { singleId: "T_2", multiIds: ["T_3", "T_4"] }
                                }
                            ) {
                                ... on Order {
                                    id
                                    ${customFieldsSelection}
                                }
                            }
                        }
                    `);

                assertCustomFieldIds(setOrderCustomFields.customFields, 'T_2', ['T_3', 'T_4']);
            });

            it('admin setOrderCustomFields', async () => {
                const { setOrderCustomFields } = await adminClient.query(gql`
                        mutation {
                            setOrderCustomFields(
                                input: {
                                    id: "${orderId}"
                                    customFields: { singleId: "T_1", multiIds: ["T_1", "T_2"] }
                                }
                            ) {
                                ... on Order {
                                    id
                                    ${customFieldsSelection}
                                }
                            }
                        }
                    `);

                assertCustomFieldIds(setOrderCustomFields.customFields, 'T_1', ['T_1', 'T_2']);
            });
        });

        describe('OrderLine entity', () => {
            it('shop addItemToOrder', async () => {
                const { addItemToOrder } = await shopClient.query(
                    gql`mutation {
                            addItemToOrder(productVariantId: "T_1", quantity: 1, customFields: { singleId: "T_1", multiIds: ["T_1", "T_2"] }) {
                                ... on Order {
                                    id
                                    ${customFieldsSelection}
                                }
                            }
                        }`,
                );

                assertCustomFieldIds(addItemToOrder.customFields, 'T_1', ['T_1', 'T_2']);
            });
        });

        describe('Product, ProductVariant entity', () => {
            let productId: string;
            it('admin createProduct', async () => {
                const { createProduct } = await adminClient.query(gql`
                        mutation {
                            createProduct(
                                input: {
                                    translations: [{ languageCode: en, name: "test" slug: "test" description: "test" }]
                                    customFields: { singleId: "T_1", multiIds: ["T_1", "T_2"] }
                                }
                            ) {
                                id
                                ${customFieldsSelection}
                            }
                        }
                    `);

                assertCustomFieldIds(createProduct.customFields, 'T_1', ['T_1', 'T_2']);
                productId = createProduct.id;
            });

            it('admin updateProduct', async () => {
                const { updateProduct } = await adminClient.query(gql`
                        mutation {
                            updateProduct(
                                input: {
                                    id: "${productId}"
                                    customFields: { singleId: "T_2", multiIds: ["T_3", "T_4"] }
                                }
                            ) {
                                id
                                ${customFieldsSelection}
                            }
                        }
                    `);
                assertCustomFieldIds(updateProduct.customFields, 'T_2', ['T_3', 'T_4']);
            });

            let productVariantId: string;
            it('admin createProductVariant', async () => {
                const { createProductVariants } = await adminClient.query(gql`
                        mutation {
                            createProductVariants(
                                input: [{
                                    sku: "TEST01"
                                    productId: "${productId}"
                                    translations: [{ languageCode: en, name: "test" }]
                                    customFields: { singleId: "T_1", multiIds: ["T_1", "T_2"] }
                                }]
                            ) {
                                id
                                ${customFieldsSelection}
                            }
                        }
                    `);

                assertCustomFieldIds(createProductVariants[0].customFields, 'T_1', ['T_1', 'T_2']);
                productVariantId = createProductVariants[0].id;
            });

            it('admin updateProductVariant', async () => {
                const { updateProductVariants } = await adminClient.query(gql`
                        mutation {
                            updateProductVariants(
                                input: [{
                                    id: "${productVariantId}"
                                    customFields: { singleId: "T_2", multiIds: ["T_3", "T_4"] }
                                }]
                            ) {
                                id
                                ${customFieldsSelection}
                            }
                        }
                    `);
                assertCustomFieldIds(updateProductVariants[0].customFields, 'T_2', ['T_3', 'T_4']);
            });
        });

        describe('ProductOptionGroup, ProductOption entity', () => {
            let productOptionGroupId: string;
            it('admin createProductOptionGroup', async () => {
                const { createProductOptionGroup } = await adminClient.query(gql`
                        mutation {
                            createProductOptionGroup(
                                input: {
                                    code: "test"
                                    options: []
                                    translations: [{ languageCode: en, name: "test" }]
                                    customFields: { singleId: "T_1", multiIds: ["T_1", "T_2"] }
                                }
                            ) {
                                id
                                ${customFieldsSelection}
                            }
                        }
                    `);

                assertCustomFieldIds(createProductOptionGroup.customFields, 'T_1', ['T_1', 'T_2']);
                productOptionGroupId = createProductOptionGroup.id;
            });

            it('admin updateProductOptionGroup', async () => {
                const { updateProductOptionGroup } = await adminClient.query(gql`
                        mutation {
                            updateProductOptionGroup(
                                input: {
                                    id: "${productOptionGroupId}"
                                    customFields: { singleId: "T_2", multiIds: ["T_3", "T_4"] }
                                }
                            ) {
                                id
                                ${customFieldsSelection}
                            }
                        }
                    `);
                assertCustomFieldIds(updateProductOptionGroup.customFields, 'T_2', ['T_3', 'T_4']);
            });

            let productOptionId: string;
            it('admin createProductOption', async () => {
                const { createProductOption } = await adminClient.query(gql`
                        mutation {
                            createProductOption(
                                input: {
                                    productOptionGroupId: "${productOptionGroupId}"
                                    code: "test-option"
                                    translations: [{ languageCode: en, name: "test-option" }]
                                    customFields: { singleId: "T_1", multiIds: ["T_1", "T_2"] }
                                }
                            ) {
                                id
                                ${customFieldsSelection}
                            }
                        }
                    `);

                assertCustomFieldIds(createProductOption.customFields, 'T_1', ['T_1', 'T_2']);
                productOptionId = createProductOption.id;
            });

            it('admin updateProductOption', async () => {
                const { updateProductOption } = await adminClient.query(gql`
                        mutation {
                            updateProductOption(
                                input: {
                                    id: "${productOptionId}"
                                    customFields: { singleId: "T_2", multiIds: ["T_3", "T_4"] }
                                }
                            ) {
                                id
                                ${customFieldsSelection}
                            }
                        }
                    `);
                assertCustomFieldIds(updateProductOption.customFields, 'T_2', ['T_3', 'T_4']);
            });
        });

        describe('User entity', () => {
            // Currently no GraphQL API to set User custom fields
        });

        describe('ShippingMethod entity', () => {
            let shippingMethodId: string;
            it('admin createShippingMethod', async () => {
                const { createShippingMethod } = await adminClient.query(gql`
                        mutation {
                            createShippingMethod(
                                input: {
                                    code: "test"
                                    calculator: {
                                        code: "${defaultShippingCalculator.code}"
                                        arguments: [
                                            { name: "rate" value: "10"},
                                            { name: "includesTax" value: "true"},
                                            { name: "taxRate" value: "10"},
                                        ]
                                    }
                                    checker: {
                                        code: "${defaultShippingEligibilityChecker.code}"
                                        arguments: [
                                            { name: "orderMinimum" value: "0"},
                                        ]
                                    }
                                    fulfillmentHandler: "${manualFulfillmentHandler.code}"
                                    translations: [{ languageCode: en, name: "test" description: "test" }]
                                    customFields: { singleId: "T_1", multiIds: ["T_1", "T_2"] }
                                }
                            ) {
                                id
                                ${customFieldsSelection}
                            }
                        }
                    `);

                assertCustomFieldIds(createShippingMethod.customFields, 'T_1', ['T_1', 'T_2']);
                shippingMethodId = createShippingMethod.id;
            });

            it('admin updateShippingMethod', async () => {
                const { updateShippingMethod } = await adminClient.query(gql`
                        mutation {
                            updateShippingMethod(
                                input: {
                                    id: "${shippingMethodId}"
                                    translations: []
                                    customFields: { singleId: "T_2", multiIds: ["T_3", "T_4"] }
                                }
                            ) {
                                id
                                ${customFieldsSelection}
                            }
                        }
                    `);
                assertCustomFieldIds(updateShippingMethod.customFields, 'T_2', ['T_3', 'T_4']);
            });
        });
    });

    it('null values', async () => {
        const { updateCustomerAddress } = await adminClient.query(gql`
            mutation {
                updateCustomerAddress(
                    input: { id: "T_1", customFields: { singleId: null, multiIds: ["T_1", "null"] } }
                ) {
                    id
                    customFields {
                        single {
                            id
                        }
                        multi {
                            id
                        }
                    }
                }
            }
        `);

        expect(updateCustomerAddress.customFields.single).toEqual(null);
        expect(updateCustomerAddress.customFields.multi).toEqual([{ id: 'T_1' }]);
    });
});
