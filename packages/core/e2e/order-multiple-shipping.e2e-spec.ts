/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { summate } from '@vendure/common/lib/shared-utils';
import {
    mergeConfig,
    RequestContext,
    ShippingLineAssignmentStrategy,
    ShippingLine,
    Order,
    OrderLine,
    manualFulfillmentHandler,
    defaultShippingCalculator,
    defaultShippingEligibilityChecker,
    OrderService,
    RequestContextService,
} from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';
import { hydratingShippingEligibilityChecker } from './fixtures/test-shipping-eligibility-checkers';
import {
    CreateAddressInput,
    CreateShippingMethodDocument,
    LanguageCode,
} from './graphql/generated-e2e-admin-types';

import * as Codegen from './graphql/generated-e2e-admin-types';
import * as CodegenShop from './graphql/generated-e2e-shop-types';
import { GET_COUNTRY_LIST, UPDATE_COUNTRY } from './graphql/shared-definitions';
import {
    ADD_ITEM_TO_ORDER,
    GET_ACTIVE_ORDER,
    GET_AVAILABLE_COUNTRIES,
    GET_ELIGIBLE_SHIPPING_METHODS,
    REMOVE_ITEM_FROM_ORDER,
    SET_SHIPPING_ADDRESS,
    SET_SHIPPING_METHOD,
} from './graphql/shop-definitions';

declare module '@vendure/core/dist/entity/custom-entity-fields' {
    interface CustomShippingMethodFields {
        minPrice: number;
        maxPrice: number;
    }
}

class CustomShippingLineAssignmentStrategy implements ShippingLineAssignmentStrategy {
    assignShippingLineToOrderLines(
        ctx: RequestContext,
        shippingLine: ShippingLine,
        order: Order,
    ): OrderLine[] | Promise<OrderLine[]> {
        const { minPrice, maxPrice } = shippingLine.shippingMethod.customFields;
        return order.lines.filter(l => l.linePriceWithTax >= minPrice && l.linePriceWithTax <= maxPrice);
    }
}

describe('Shop orders', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            customFields: {
                ShippingMethod: [
                    { name: 'minPrice', type: 'int' },
                    { name: 'maxPrice', type: 'int' },
                ],
            },
            shippingOptions: {
                shippingLineAssignmentStrategy: new CustomShippingLineAssignmentStrategy(),
            },
        }),
    );

    type OrderSuccessResult =
        | CodegenShop.UpdatedOrderFragment
        | CodegenShop.TestOrderFragmentFragment
        | CodegenShop.TestOrderWithPaymentsFragment
        | CodegenShop.ActiveOrderCustomerFragment;
    const orderResultGuard: ErrorResultGuard<OrderSuccessResult> = createErrorResultGuard(
        input => !!input.lines,
    );

    let lessThan100MethodId: string;
    let greaterThan100MethodId: string;
    let orderService: OrderService;

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 3,
        });
        await adminClient.asSuperAdmin();
        orderService = server.app.get(OrderService);
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('setup shipping methods', async () => {
        const result1 = await adminClient.query(CreateShippingMethodDocument, {
            input: {
                code: 'less-than-100',
                translations: [{ languageCode: LanguageCode.en, name: 'Less than 100', description: '' }],
                fulfillmentHandler: manualFulfillmentHandler.code,
                checker: {
                    code: defaultShippingEligibilityChecker.code,
                    arguments: [{ name: 'orderMinimum', value: '0' }],
                },
                calculator: {
                    code: defaultShippingCalculator.code,
                    arguments: [
                        { name: 'rate', value: '1000' },
                        { name: 'taxRate', value: '0' },
                        { name: 'includesTax', value: 'auto' },
                    ],
                },
                customFields: {
                    minPrice: 0,
                    maxPrice: 100_00,
                },
            },
        });

        const result2 = await adminClient.query(CreateShippingMethodDocument, {
            input: {
                code: 'greater-than-100',
                translations: [{ languageCode: LanguageCode.en, name: 'Greater than 200', description: '' }],
                fulfillmentHandler: manualFulfillmentHandler.code,
                checker: {
                    code: defaultShippingEligibilityChecker.code,
                    arguments: [{ name: 'orderMinimum', value: '0' }],
                },
                calculator: {
                    code: defaultShippingCalculator.code,
                    arguments: [
                        { name: 'rate', value: '2000' },
                        { name: 'taxRate', value: '0' },
                        { name: 'includesTax', value: 'auto' },
                    ],
                },
                customFields: {
                    minPrice: 100_00,
                    maxPrice: 500000_00,
                },
            },
        });

        expect(result1.createShippingMethod.id).toBe('T_3');
        expect(result2.createShippingMethod.id).toBe('T_4');
        lessThan100MethodId = result1.createShippingMethod.id;
        greaterThan100MethodId = result2.createShippingMethod.id;
    });

    it('assigns shipping methods to correct order lines', async () => {
        await shopClient.query<
            CodegenShop.AddItemToOrderMutation,
            CodegenShop.AddItemToOrderMutationVariables
        >(ADD_ITEM_TO_ORDER, {
            productVariantId: 'T_1',
            quantity: 1,
        });
        await shopClient.query<
            CodegenShop.AddItemToOrderMutation,
            CodegenShop.AddItemToOrderMutationVariables
        >(ADD_ITEM_TO_ORDER, {
            productVariantId: 'T_11',
            quantity: 1,
        });

        await shopClient.query<
            CodegenShop.SetShippingAddressMutation,
            CodegenShop.SetShippingAddressMutationVariables
        >(SET_SHIPPING_ADDRESS, {
            input: {
                streetLine1: '12 the street',
                postalCode: '123456',
                countryCode: 'US',
            },
        });

        const { eligibleShippingMethods } = await shopClient.query<CodegenShop.GetShippingMethodsQuery>(
            GET_ELIGIBLE_SHIPPING_METHODS,
        );

        expect(eligibleShippingMethods.map(m => m.id).includes(lessThan100MethodId)).toBe(true);
        expect(eligibleShippingMethods.map(m => m.id).includes(greaterThan100MethodId)).toBe(true);

        const { setOrderShippingMethod } = await shopClient.query<
            CodegenShop.SetShippingMethodMutation,
            CodegenShop.SetShippingMethodMutationVariables
        >(SET_SHIPPING_METHOD, {
            id: [lessThan100MethodId, greaterThan100MethodId],
        });

        orderResultGuard.assertSuccess(setOrderShippingMethod);

        const order = await getInternalOrder(setOrderShippingMethod.id);
        expect(order?.lines[0].shippingLine?.shippingMethod.code).toBe('greater-than-100');
        expect(order?.lines[1].shippingLine?.shippingMethod.code).toBe('less-than-100');

        expect(order?.shippingLines.length).toBe(2);
    });

    it('removes shipping methods that are no longer applicable', async () => {
        const { activeOrder } = await shopClient.query<CodegenShop.GetActiveOrderQuery>(GET_ACTIVE_ORDER);

        const { removeOrderLine } = await shopClient.query<
            CodegenShop.RemoveItemFromOrderMutation,
            CodegenShop.RemoveItemFromOrderMutationVariables
        >(REMOVE_ITEM_FROM_ORDER, {
            orderLineId: activeOrder!.lines[0].id,
        });
        orderResultGuard.assertSuccess(removeOrderLine);

        const order = await getInternalOrder(activeOrder!.id);
        expect(order?.lines.length).toBe(1);
        expect(order?.shippingLines.length).toBe(1);
        expect(order?.shippingLines[0].shippingMethod.code).toBe('less-than-100');

        const { activeOrder: activeOrder2 } = await shopClient.query<CodegenShop.GetActiveOrderQuery>(
            GET_ACTIVE_ORDER,
        );

        expect(activeOrder2?.shippingWithTax).toBe(summate(activeOrder2!.shippingLines, 'priceWithTax'));
    });

    it('removes remaining shipping method when removing all items', async () => {
        const { activeOrder } = await shopClient.query<CodegenShop.GetActiveOrderQuery>(GET_ACTIVE_ORDER);

        const { removeOrderLine } = await shopClient.query<
            CodegenShop.RemoveItemFromOrderMutation,
            CodegenShop.RemoveItemFromOrderMutationVariables
        >(REMOVE_ITEM_FROM_ORDER, {
            orderLineId: activeOrder!.lines[0].id,
        });
        orderResultGuard.assertSuccess(removeOrderLine);

        const order = await getInternalOrder(activeOrder!.id);
        expect(order?.lines.length).toBe(0);

        const { activeOrder: activeOrder2 } = await shopClient.query<CodegenShop.GetActiveOrderQuery>(
            GET_ACTIVE_ORDER,
        );

        expect(activeOrder2?.shippingWithTax).toBe(0);
    });

    async function getInternalOrder(externalOrderId: string): Promise<Order> {
        const ctx = await server.app.get(RequestContextService).create({ apiType: 'admin' });
        const internalOrderId = +externalOrderId.replace('T_', '');
        const order = await orderService.findOne(ctx, internalOrderId, [
            'lines',
            'lines.shippingLine',
            'lines.shippingLine.shippingMethod',
            'shippingLines',
            'shippingLines.shippingMethod',
        ]);
        return order!;
    }
});
