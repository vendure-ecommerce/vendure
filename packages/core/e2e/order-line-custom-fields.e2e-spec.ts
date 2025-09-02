import { mergeConfig, Product } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import { fixPostgresTimezone } from './utils/fix-pg-timezone';

// Since the predefined mutations don't support custom fields, we'll create our own
// but still follow the typing pattern from the existing tests
const ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS = gql`
    mutation AddItemToOrderWithCustomFields(
        $productVariantId: ID!
        $quantity: Int!
        $customFields: OrderLineCustomFieldsInput
    ) {
        addItemToOrder(
            productVariantId: $productVariantId
            quantity: $quantity
            customFields: $customFields
        ) {
            ... on Order {
                id
                lines {
                    id
                    quantity
                    customFields {
                        stringField
                        intField
                        booleanField
                        nullableField
                        relationField {
                            id
                            name
                        }
                    }
                }
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
`;

const ADJUST_ORDER_LINE_WITH_CUSTOM_FIELDS = gql`
    mutation AdjustOrderLineWithCustomFields(
        $orderLineId: ID!
        $quantity: Int!
        $customFields: OrderLineCustomFieldsInput
    ) {
        adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity, customFields: $customFields) {
            ... on Order {
                id
                lines {
                    id
                    quantity
                    customFields {
                        stringField
                        intField
                        booleanField
                        nullableField
                        relationField {
                            id
                            name
                        }
                    }
                }
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
`;

const REMOVE_ALL_ORDER_LINES = gql`
    mutation RemoveAllOrderLines {
        removeAllOrderLines {
            ... on Order {
                id
                lines {
                    id
                    quantity
                }
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
`;

fixPostgresTimezone();

const customConfig = mergeConfig(testConfig(), {
    customFields: {
        OrderLine: [
            { name: 'stringField', type: 'string' },
            { name: 'intField', type: 'int' },
            { name: 'booleanField', type: 'boolean' },
            { name: 'nullableField', type: 'string', nullable: true },
            { name: 'relationField', type: 'relation', entity: Product },
        ],
    },
});

describe('OrderLine Custom Fields', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(customConfig);

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

    beforeEach(async () => {
        // Clear the shopping cart before each test to ensure test isolation
        await shopClient.query(REMOVE_ALL_ORDER_LINES);
    });

    describe('addItemToOrder', () => {
        it('can add order line with custom fields', async () => {
            const { addItemToOrder } = await shopClient.query(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS, {
                productVariantId: 'T_1',
                quantity: 1,
                customFields: { stringField: 'test value', intField: 42, booleanField: true },
            });

            expect(addItemToOrder.lines[0].customFields).toEqual({
                stringField: 'test value',
                intField: 42,
                booleanField: true,
                nullableField: null,
                relationField: null,
            });
        });

        it('can add order line with relation custom field', async () => {
            const { addItemToOrder } = await shopClient.query(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS, {
                productVariantId: 'T_2',
                quantity: 1,
                customFields: { relationFieldId: 'T_1' },
            });

            expect(addItemToOrder.lines[0].customFields.relationField.id).toBe('T_1');
        });
    });

    describe('adjustOrderLine - merging behavior', () => {
        it('should merge custom fields when updating partial fields', async () => {
            // Create a fresh order line for this test
            const { addItemToOrder } = await shopClient.query(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS, {
                productVariantId: 'T_3',
                quantity: 1,
                customFields: {
                    stringField: 'initial value',
                    intField: 100,
                    booleanField: false,
                    nullableField: 'not null',
                },
            });
            const orderLineId = addItemToOrder.lines[0].id;

            const { adjustOrderLine } = await shopClient.query(ADJUST_ORDER_LINE_WITH_CUSTOM_FIELDS, {
                orderLineId,
                quantity: 2,
                customFields: {
                    stringField: 'updated value',
                },
            });

            const updatedLine = adjustOrderLine.lines.find(line => line.id === orderLineId);
            expect(updatedLine.customFields).toEqual({
                stringField: 'updated value', // updated
                intField: 100, // preserved
                booleanField: false, // preserved
                nullableField: 'not null', // preserved
                relationField: null, // preserved
            });
        });

        it('should allow updating multiple fields while preserving others', async () => {
            // Create a fresh order line for this test
            const { addItemToOrder } = await shopClient.query(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS, {
                productVariantId: 'T_4',
                quantity: 1,
                customFields: {
                    stringField: 'initial value',
                    intField: 100,
                    booleanField: false,
                    nullableField: 'not null',
                },
            });
            const orderLineId = addItemToOrder.lines[0].id;

            const { adjustOrderLine } = await shopClient.query(ADJUST_ORDER_LINE_WITH_CUSTOM_FIELDS, {
                orderLineId,
                quantity: 2,
                customFields: {
                    intField: 200,
                    booleanField: true,
                },
            });

            const updatedLine = adjustOrderLine.lines.find(line => line.id === orderLineId);
            expect(updatedLine.customFields).toEqual({
                stringField: 'initial value', // preserved
                intField: 200, // updated
                booleanField: true, // updated
                nullableField: 'not null', // preserved
                relationField: null, // preserved
            });
        });

        it('should allow unsetting fields using null', async () => {
            // Create a fresh order line for this test
            const { addItemToOrder } = await shopClient.query(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS, {
                productVariantId: 'T_1',
                quantity: 1,
                customFields: {
                    stringField: 'initial value',
                    intField: 100,
                    booleanField: false,
                    nullableField: 'not null',
                },
            });
            const orderLineId = addItemToOrder.lines[0].id;

            const { adjustOrderLine } = await shopClient.query(ADJUST_ORDER_LINE_WITH_CUSTOM_FIELDS, {
                orderLineId,
                quantity: 2,
                customFields: {
                    nullableField: null,
                },
            });

            const updatedLine = adjustOrderLine.lines.find(line => line.id === orderLineId);
            expect(updatedLine.customFields).toEqual({
                stringField: 'initial value', // preserved
                intField: 100, // preserved
                booleanField: false, // preserved
                nullableField: null, // unset using null
                relationField: null, // preserved
            });
        });

        it('should handle relation field updates with merging', async () => {
            // Create a fresh order line for this test
            const { addItemToOrder } = await shopClient.query(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS, {
                productVariantId: 'T_2',
                quantity: 1,
                customFields: {
                    stringField: 'initial value',
                    intField: 100,
                    booleanField: false,
                    nullableField: 'not null',
                },
            });
            const orderLineId = addItemToOrder.lines[0].id;

            const { adjustOrderLine } = await shopClient.query(ADJUST_ORDER_LINE_WITH_CUSTOM_FIELDS, {
                orderLineId,
                quantity: 2,
                customFields: {
                    relationFieldId: 'T_1',
                },
            });

            const updatedLine = adjustOrderLine.lines.find(line => line.id === orderLineId);
            expect(updatedLine.customFields).toEqual({
                stringField: 'initial value', // preserved
                intField: 100, // preserved
                booleanField: false, // preserved
                nullableField: 'not null', // preserved
                relationField: {
                    id: 'T_1',
                    name: 'Laptop',
                },
            });
        });

        it('should allow unsetting relation field using null', async () => {
            // Create a fresh order line for this test
            const { addItemToOrder } = await shopClient.query(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS, {
                productVariantId: 'T_3',
                quantity: 1,
                customFields: {
                    stringField: 'initial value',
                    intField: 100,
                    booleanField: false,
                    nullableField: 'not null',
                    relationFieldId: 'T_1',
                },
            });
            const orderLineId = addItemToOrder.lines[0].id;

            const { adjustOrderLine } = await shopClient.query(ADJUST_ORDER_LINE_WITH_CUSTOM_FIELDS, {
                orderLineId,
                quantity: 2,
                customFields: {
                    relationFieldId: null,
                },
            });

            const updatedLine = adjustOrderLine.lines.find(line => line.id === orderLineId);
            expect(updatedLine.customFields).toEqual({
                stringField: 'initial value', // preserved
                intField: 100, // preserved
                booleanField: false, // preserved
                nullableField: 'not null', // preserved
                relationField: null, // unset using null
            });
        });
    });

    describe('edge cases', () => {
        it('should handle empty custom fields object', async () => {
            const { addItemToOrder } = await shopClient.query(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS, {
                productVariantId: 'T_4',
                quantity: 1,
                customFields: {},
            });

            const newLine = addItemToOrder.lines[0];
            expect(newLine.customFields).toEqual({
                stringField: null,
                intField: null,
                booleanField: null,
                nullableField: null,
                relationField: null,
            });
        });

        it('should handle adjustOrderLine with empty custom fields', async () => {
            const { addItemToOrder } = await shopClient.query(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS, {
                productVariantId: 'T_1',
                quantity: 1,
                customFields: { stringField: 'will be preserved', intField: 999 },
            });

            const lineId = addItemToOrder.lines[0].id;

            const { adjustOrderLine } = await shopClient.query(ADJUST_ORDER_LINE_WITH_CUSTOM_FIELDS, {
                orderLineId: lineId,
                quantity: 2,
                customFields: {},
            });

            const updatedLine = adjustOrderLine.lines.find(line => line.id === lineId);
            expect(updatedLine.customFields).toEqual({
                stringField: 'will be preserved', // preserved when empty object passed
                intField: 999, // preserved when empty object passed
                booleanField: null, // default value for unset fields
                nullableField: null, // default value for unset fields
                relationField: null, // default value for unset fields
            });
        });
    });
});
