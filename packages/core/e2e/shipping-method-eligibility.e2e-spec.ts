import {
    defaultShippingCalculator,
    defaultShippingEligibilityChecker,
    manualFulfillmentHandler,
    ShippingCalculator,
    ShippingEligibilityChecker,
} from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import path from 'path';
import { vi } from 'vitest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import * as Codegen from './graphql/generated-e2e-admin-types';
import * as CodegenShop from './graphql/generated-e2e-shop-types';
import { ErrorCode, LanguageCode } from './graphql/generated-e2e-shop-types';
import { CREATE_SHIPPING_METHOD } from './graphql/shared-definitions';
import {
    ADD_ITEM_TO_ORDER,
    ADJUST_ITEM_QUANTITY,
    GET_ACTIVE_ORDER,
    GET_ELIGIBLE_SHIPPING_METHODS,
    REMOVE_ITEM_FROM_ORDER,
    SET_SHIPPING_ADDRESS,
    SET_SHIPPING_METHOD,
} from './graphql/shop-definitions';

const check1Spy = vi.fn();
const checker1 = new ShippingEligibilityChecker({
    code: 'checker1',
    description: [],
    args: {},
    check: (ctx, order) => {
        check1Spy();
        return order.lines.length === 1;
    },
});

const check2Spy = vi.fn();
const checker2 = new ShippingEligibilityChecker({
    code: 'checker2',
    description: [],
    args: {},
    check: (ctx, order) => {
        check2Spy();
        return order.lines.length > 1;
    },
});

const check3Spy = vi.fn();
const checker3 = new ShippingEligibilityChecker({
    code: 'checker3',
    description: [],
    args: {},
    check: (ctx, order) => {
        check3Spy();
        return order.lines.length === 3;
    },
    shouldRunCheck: (ctx, order) => {
        return order.shippingAddress;
    },
});

const calculator = new ShippingCalculator({
    code: 'calculator',
    description: [],
    args: {},
    calculate: ctx => {
        return {
            price: 10,
            priceIncludesTax: false,
            taxRate: 20,
        };
    },
});

describe('ShippingMethod eligibility', () => {
    const { server, adminClient, shopClient } = createTestEnvironment({
        ...testConfig(),
        shippingOptions: {
            shippingEligibilityCheckers: [defaultShippingEligibilityChecker, checker1, checker2, checker3],
            shippingCalculators: [defaultShippingCalculator, calculator],
        },
    });

    const orderGuard: ErrorResultGuard<
        CodegenShop.UpdatedOrderFragment | CodegenShop.TestOrderFragmentFragment
    > = createErrorResultGuard(input => !!input.lines);

    let singleLineShippingMethod: Codegen.ShippingMethodFragment;
    let multiLineShippingMethod: Codegen.ShippingMethodFragment;
    let optimizedShippingMethod: Codegen.ShippingMethodFragment;

    beforeAll(async () => {
        await server.init({
            initialData: {
                ...initialData,
                shippingMethods: [],
            },
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();

        const result1 = await adminClient.query<
            Codegen.CreateShippingMethodMutation,
            Codegen.CreateShippingMethodMutationVariables
        >(CREATE_SHIPPING_METHOD, {
            input: {
                code: 'single-line',
                fulfillmentHandler: manualFulfillmentHandler.code,
                checker: {
                    code: checker1.code,
                    arguments: [],
                },
                calculator: {
                    code: calculator.code,
                    arguments: [],
                },
                translations: [
                    { languageCode: LanguageCode.en, name: 'For single-line orders', description: '' },
                ],
            },
        });
        singleLineShippingMethod = result1.createShippingMethod;

        const result2 = await adminClient.query<
            Codegen.CreateShippingMethodMutation,
            Codegen.CreateShippingMethodMutationVariables
        >(CREATE_SHIPPING_METHOD, {
            input: {
                code: 'multi-line',
                fulfillmentHandler: manualFulfillmentHandler.code,
                checker: {
                    code: checker2.code,
                    arguments: [],
                },
                calculator: {
                    code: calculator.code,
                    arguments: [],
                },
                translations: [
                    { languageCode: LanguageCode.en, name: 'For multi-line orders', description: '' },
                ],
            },
        });
        multiLineShippingMethod = result2.createShippingMethod;

        const result3 = await adminClient.query<
            Codegen.CreateShippingMethodMutation,
            Codegen.CreateShippingMethodMutationVariables
        >(CREATE_SHIPPING_METHOD, {
            input: {
                code: 'optimized',
                fulfillmentHandler: manualFulfillmentHandler.code,
                checker: {
                    code: checker3.code,
                    arguments: [],
                },
                calculator: {
                    code: calculator.code,
                    arguments: [],
                },
                translations: [
                    { languageCode: LanguageCode.en, name: 'Optimized with shouldRunCheck', description: '' },
                ],
            },
        });
        optimizedShippingMethod = result3.createShippingMethod;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('default behavior', () => {
        let order: CodegenShop.UpdatedOrderFragment;

        it('Does not run checkers before a ShippingMethod is assigned to Order', async () => {
            check1Spy.mockClear();
            check2Spy.mockClear();

            await shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');

            const { addItemToOrder } = await shopClient.query<
                CodegenShop.AddItemToOrderMutation,
                CodegenShop.AddItemToOrderMutationVariables
            >(ADD_ITEM_TO_ORDER, {
                quantity: 1,
                productVariantId: 'T_1',
            });
            orderGuard.assertSuccess(addItemToOrder);

            expect(check1Spy).not.toHaveBeenCalled();
            expect(check2Spy).not.toHaveBeenCalled();

            await shopClient.query<
                CodegenShop.AdjustItemQuantityMutation,
                CodegenShop.AdjustItemQuantityMutationVariables
            >(ADJUST_ITEM_QUANTITY, {
                quantity: 2,
                orderLineId: addItemToOrder.lines[0].id,
            });

            expect(check1Spy).not.toHaveBeenCalled();
            expect(check2Spy).not.toHaveBeenCalled();

            order = addItemToOrder;
        });

        it('Runs checkers when querying for eligible ShippingMethods', async () => {
            check1Spy.mockClear();
            check2Spy.mockClear();

            const { eligibleShippingMethods } = await shopClient.query<CodegenShop.GetShippingMethodsQuery>(
                GET_ELIGIBLE_SHIPPING_METHODS,
            );

            expect(check1Spy).toHaveBeenCalledTimes(1);
            expect(check2Spy).toHaveBeenCalledTimes(1);
        });

        it('Runs checker of assigned method only', async () => {
            check1Spy.mockClear();
            check2Spy.mockClear();

            await shopClient.query<
                CodegenShop.SetShippingMethodMutation,
                CodegenShop.SetShippingMethodMutationVariables
            >(SET_SHIPPING_METHOD, {
                id: singleLineShippingMethod.id,
            });

            // A check is done when assigning the method to ensure it
            // is eligible, and again when calculating order adjustments
            expect(check1Spy).toHaveBeenCalledTimes(2);
            expect(check2Spy).not.toHaveBeenCalled();

            await shopClient.query<
                CodegenShop.AdjustItemQuantityMutation,
                CodegenShop.AdjustItemQuantityMutationVariables
            >(ADJUST_ITEM_QUANTITY, {
                quantity: 3,
                orderLineId: order.lines[0].id,
            });

            expect(check1Spy).toHaveBeenCalledTimes(3);
            expect(check2Spy).not.toHaveBeenCalled();

            await shopClient.query<
                CodegenShop.AdjustItemQuantityMutation,
                CodegenShop.AdjustItemQuantityMutationVariables
            >(ADJUST_ITEM_QUANTITY, {
                quantity: 4,
                orderLineId: order.lines[0].id,
            });

            expect(check1Spy).toHaveBeenCalledTimes(4);
            expect(check2Spy).not.toHaveBeenCalled();
        });

        it('Prevents ineligible method from being assigned', async () => {
            const { setOrderShippingMethod } = await shopClient.query<
                CodegenShop.SetShippingMethodMutation,
                CodegenShop.SetShippingMethodMutationVariables
            >(SET_SHIPPING_METHOD, {
                id: multiLineShippingMethod.id,
            });

            orderGuard.assertErrorResult(setOrderShippingMethod);

            expect(setOrderShippingMethod.errorCode).toBe(ErrorCode.INELIGIBLE_SHIPPING_METHOD_ERROR);
            expect(setOrderShippingMethod.message).toBe(
                'This Order is not eligible for the selected ShippingMethod',
            );
        });

        it('Runs checks when assigned method becomes ineligible', async () => {
            check1Spy.mockClear();
            check2Spy.mockClear();

            // Adding a second OrderLine will make the singleLineShippingMethod
            // ineligible
            const { addItemToOrder } = await shopClient.query<
                CodegenShop.AddItemToOrderMutation,
                CodegenShop.AddItemToOrderMutationVariables
            >(ADD_ITEM_TO_ORDER, {
                quantity: 1,
                productVariantId: 'T_2',
            });
            orderGuard.assertSuccess(addItemToOrder);

            // Checked once to see if still eligible (no)
            expect(check1Spy).toHaveBeenCalledTimes(1);
            // Checked once when looking for a fallback
            expect(check2Spy).toHaveBeenCalledTimes(1);

            const { activeOrder } = await shopClient.query<CodegenShop.GetActiveOrderQuery>(GET_ACTIVE_ORDER);
            // multiLineShippingMethod assigned as a fallback
            expect(activeOrder?.shippingLines?.[0]?.shippingMethod?.id).toBe(multiLineShippingMethod.id);

            await shopClient.query<
                CodegenShop.AdjustItemQuantityMutation,
                CodegenShop.AdjustItemQuantityMutationVariables
            >(ADJUST_ITEM_QUANTITY, {
                quantity: 2,
                orderLineId: addItemToOrder.lines[1].id,
            });

            // No longer called as singleLineShippingMethod not assigned
            expect(check1Spy).toHaveBeenCalledTimes(1);
            // Called on changes since multiLineShippingMethod is assigned
            expect(check2Spy).toHaveBeenCalledTimes(2);

            // Remove the second OrderLine and make multiLineShippingMethod ineligible
            const { removeOrderLine } = await shopClient.query<
                CodegenShop.RemoveItemFromOrderMutation,
                CodegenShop.RemoveItemFromOrderMutationVariables
            >(REMOVE_ITEM_FROM_ORDER, {
                orderLineId: addItemToOrder.lines[1].id,
            });
            orderGuard.assertSuccess(removeOrderLine);

            // Called when looking for a fallback
            expect(check1Spy).toHaveBeenCalledTimes(2);
            // Called when checking if still eligibile (no)
            expect(check2Spy).toHaveBeenCalledTimes(3);

            // Falls back to the first eligible shipping method
            expect(removeOrderLine.shippingLines[0].shippingMethod?.id).toBe(singleLineShippingMethod.id);
        });
    });

    describe('optimization via shouldRunCheck function', () => {
        let order: CodegenShop.UpdatedOrderFragment;

        beforeAll(async () => {
            await shopClient.asAnonymousUser();
            await shopClient.query<
                CodegenShop.AddItemToOrderMutation,
                CodegenShop.AddItemToOrderMutationVariables
            >(ADD_ITEM_TO_ORDER, {
                quantity: 1,
                productVariantId: 'T_1',
            });
            await shopClient.query<
                CodegenShop.AddItemToOrderMutation,
                CodegenShop.AddItemToOrderMutationVariables
            >(ADD_ITEM_TO_ORDER, {
                quantity: 1,
                productVariantId: 'T_2',
            });
            const { addItemToOrder } = await shopClient.query<
                CodegenShop.AddItemToOrderMutation,
                CodegenShop.AddItemToOrderMutationVariables
            >(ADD_ITEM_TO_ORDER, {
                quantity: 1,
                productVariantId: 'T_3',
            });
            orderGuard.assertSuccess(addItemToOrder);
            order = addItemToOrder;

            await shopClient.query<
                CodegenShop.SetShippingAddressMutation,
                CodegenShop.SetShippingAddressMutationVariables
            >(SET_SHIPPING_ADDRESS, {
                input: {
                    streetLine1: '42 Test Street',
                    city: 'Doncaster',
                    postalCode: 'DN1 4EE',
                    countryCode: 'GB',
                },
            });
        });

        it('runs check on getEligibleShippingMethods', async () => {
            check3Spy.mockClear();
            const { eligibleShippingMethods } = await shopClient.query<CodegenShop.GetShippingMethodsQuery>(
                GET_ELIGIBLE_SHIPPING_METHODS,
            );

            expect(check3Spy).toHaveBeenCalledTimes(1);
        });

        it('does not re-run check on setting shipping method', async () => {
            check3Spy.mockClear();
            await shopClient.query<
                CodegenShop.SetShippingMethodMutation,
                CodegenShop.SetShippingMethodMutationVariables
            >(SET_SHIPPING_METHOD, {
                id: optimizedShippingMethod.id,
            });
            expect(check3Spy).toHaveBeenCalledTimes(0);
        });

        it('does not re-run check when changing cart contents', async () => {
            check3Spy.mockClear();

            await shopClient.query<
                CodegenShop.AdjustItemQuantityMutation,
                CodegenShop.AdjustItemQuantityMutationVariables
            >(ADJUST_ITEM_QUANTITY, {
                quantity: 3,
                orderLineId: order.lines[0].id,
            });

            expect(check3Spy).toHaveBeenCalledTimes(0);
        });

        it('re-runs check when shouldRunCheck fn invalidates last check', async () => {
            check3Spy.mockClear();
            // Update the shipping address, causing the `shouldRunCheck` function
            // to trigger a check
            await shopClient.query<
                CodegenShop.SetShippingAddressMutation,
                CodegenShop.SetShippingAddressMutationVariables
            >(SET_SHIPPING_ADDRESS, {
                input: {
                    streetLine1: '43 Test Street', // This line changed
                    city: 'Doncaster',
                    postalCode: 'DN1 4EE',
                    countryCode: 'GB',
                },
            });

            await shopClient.query<
                CodegenShop.AdjustItemQuantityMutation,
                CodegenShop.AdjustItemQuantityMutationVariables
            >(ADJUST_ITEM_QUANTITY, {
                quantity: 2,
                orderLineId: order.lines[0].id,
            });

            expect(check3Spy).toHaveBeenCalledTimes(1);

            // Does not check a second time though, since the shipping address
            // is now the same as on the last check.
            await shopClient.query<
                CodegenShop.AdjustItemQuantityMutation,
                CodegenShop.AdjustItemQuantityMutationVariables
            >(ADJUST_ITEM_QUANTITY, {
                quantity: 3,
                orderLineId: order.lines[0].id,
            });

            expect(check3Spy).toHaveBeenCalledTimes(1);
        });
    });
});
