/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    CustomOrderProcess,
    defaultOrderProcess,
    mergeConfig,
    OrderState,
    TransactionalConnection,
} from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import path from 'path';
import { vi } from 'vitest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { testSuccessfulPaymentMethod } from './fixtures/test-payment-methods';
import * as Codegen from './graphql/generated-e2e-admin-types';
import { OrderFragment } from './graphql/generated-e2e-admin-types';
import {
    AddPaymentToOrderMutation,
    AddPaymentToOrderMutationVariables,
    ErrorCode,
    TestOrderFragmentFragment,
    TransitionToStateMutation,
    TransitionToStateMutationVariables,
} from './graphql/generated-e2e-shop-types';
import * as CodegenShop from './graphql/generated-e2e-shop-types';
import { ADMIN_TRANSITION_TO_STATE, GET_ORDER } from './graphql/shared-definitions';
import {
    ADD_ITEM_TO_ORDER,
    ADD_PAYMENT,
    GET_NEXT_STATES,
    SET_CUSTOMER,
    SET_SHIPPING_ADDRESS,
    SET_SHIPPING_METHOD,
    TRANSITION_TO_STATE,
} from './graphql/shop-definitions';

type TestOrderState = OrderState | 'ValidatingCustomer';

const initSpy = vi.fn();
const transitionStartSpy = vi.fn();
const transitionEndSpy = vi.fn();
const transitionEndSpy2 = vi.fn();
const transitionErrorSpy = vi.fn();

describe('Order process', () => {
    const VALIDATION_ERROR_MESSAGE = 'Customer must have a company email address';
    const customOrderProcess: CustomOrderProcess<'ValidatingCustomer' | 'PaymentProcessing'> = {
        init(injector) {
            initSpy(injector.get(TransactionalConnection).rawConnection.name);
        },
        transitions: {
            AddingItems: {
                to: ['ValidatingCustomer'],
                mergeStrategy: 'replace',
            },
            ValidatingCustomer: {
                to: ['ArrangingPayment', 'AddingItems'],
            },
            ArrangingPayment: {
                to: ['PaymentProcessing'],
            },
            PaymentProcessing: {
                to: ['PaymentAuthorized', 'PaymentSettled'],
            },
        },
        onTransitionStart(fromState, toState, data) {
            transitionStartSpy(fromState, toState, data);
            if (toState === 'ValidatingCustomer') {
                if (!data.order.customer) {
                    return false;
                }
                if (!data.order.customer.emailAddress.includes('@company.com')) {
                    return VALIDATION_ERROR_MESSAGE;
                }
            }
        },
        onTransitionEnd(fromState, toState, data) {
            transitionEndSpy(fromState, toState, data);
        },
        onTransitionError(fromState, toState, message) {
            transitionErrorSpy(fromState, toState, message);
        },
    };

    const customOrderProcess2: CustomOrderProcess<'ValidatingCustomer'> = {
        transitions: {
            ValidatingCustomer: {
                to: ['Cancelled'],
            },
        },
        onTransitionEnd(fromState, toState, data) {
            transitionEndSpy2(fromState, toState, data);
        },
    };

    const orderErrorGuard: ErrorResultGuard<TestOrderFragmentFragment | OrderFragment> =
        createErrorResultGuard(input => !!input.total);

    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            orderOptions: { process: [defaultOrderProcess, customOrderProcess, customOrderProcess2] as any },
            paymentOptions: {
                paymentMethodHandlers: [testSuccessfulPaymentMethod],
            },
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData: {
                ...initialData,
                paymentMethods: [
                    {
                        name: testSuccessfulPaymentMethod.code,
                        handler: { code: testSuccessfulPaymentMethod.code, arguments: [] },
                    },
                ],
            },
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('Initial transition', () => {
        it('transitions from Created to AddingItems on creation', async () => {
            transitionStartSpy.mockClear();
            transitionEndSpy.mockClear();
            await shopClient.asAnonymousUser();

            await shopClient.query<
                CodegenShop.AddItemToOrderMutation,
                CodegenShop.AddItemToOrderMutationVariables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 1,
            });

            expect(transitionStartSpy).toHaveBeenCalledTimes(1);
            expect(transitionEndSpy).toHaveBeenCalledTimes(1);
            expect(transitionStartSpy.mock.calls[0].slice(0, 2)).toEqual(['Created', 'AddingItems']);
            expect(transitionEndSpy.mock.calls[0].slice(0, 2)).toEqual(['Created', 'AddingItems']);
        });
    });

    describe('CustomOrderProcess', () => {
        it('CustomOrderProcess is injectable', () => {
            expect(initSpy).toHaveBeenCalled();
            expect(initSpy.mock.calls[0][0]).toBe('default');
        });

        it('replaced transition target', async () => {
            await shopClient.query<
                CodegenShop.AddItemToOrderMutation,
                CodegenShop.AddItemToOrderMutationVariables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 1,
            });

            const { nextOrderStates } = await shopClient.query<CodegenShop.GetNextOrderStatesQuery>(
                GET_NEXT_STATES,
            );

            expect(nextOrderStates).toEqual(['ValidatingCustomer']);
        });

        it('custom onTransitionStart handler returning false', async () => {
            transitionStartSpy.mockClear();
            transitionEndSpy.mockClear();

            const { transitionOrderToState } = await shopClient.query<
                CodegenShop.TransitionToStateMutation,
                CodegenShop.TransitionToStateMutationVariables
            >(TRANSITION_TO_STATE, {
                state: 'ValidatingCustomer',
            });
            orderErrorGuard.assertSuccess(transitionOrderToState);

            expect(transitionStartSpy).toHaveBeenCalledTimes(1);
            expect(transitionEndSpy).not.toHaveBeenCalled();
            expect(transitionStartSpy.mock.calls[0].slice(0, 2)).toEqual([
                'AddingItems',
                'ValidatingCustomer',
            ]);
            expect(transitionOrderToState?.state).toBe('AddingItems');
        });

        it('custom onTransitionStart handler returning error message', async () => {
            transitionStartSpy.mockClear();
            transitionErrorSpy.mockClear();

            await shopClient.query<
                CodegenShop.SetCustomerForOrderMutation,
                CodegenShop.SetCustomerForOrderMutationVariables
            >(SET_CUSTOMER, {
                input: {
                    firstName: 'Joe',
                    lastName: 'Test',
                    emailAddress: 'joetest@gmail.com',
                },
            });

            const { transitionOrderToState } = await shopClient.query<
                CodegenShop.TransitionToStateMutation,
                CodegenShop.TransitionToStateMutationVariables
            >(TRANSITION_TO_STATE, {
                state: 'ValidatingCustomer',
            });
            orderErrorGuard.assertErrorResult(transitionOrderToState);

            expect(transitionOrderToState!.message).toBe(
                'Cannot transition Order from "AddingItems" to "ValidatingCustomer"',
            );
            expect(transitionOrderToState!.errorCode).toBe(ErrorCode.ORDER_STATE_TRANSITION_ERROR);
            expect(transitionOrderToState!.transitionError).toBe(VALIDATION_ERROR_MESSAGE);
            expect(transitionOrderToState!.fromState).toBe('AddingItems');
            expect(transitionOrderToState!.toState).toBe('ValidatingCustomer');

            expect(transitionStartSpy).toHaveBeenCalledTimes(1);
            expect(transitionErrorSpy).toHaveBeenCalledTimes(1);
            expect(transitionEndSpy).not.toHaveBeenCalled();
            expect(transitionErrorSpy.mock.calls[0]).toEqual([
                'AddingItems',
                'ValidatingCustomer',
                VALIDATION_ERROR_MESSAGE,
            ]);
        });

        it('custom onTransitionStart handler allows transition', async () => {
            transitionEndSpy.mockClear();

            await shopClient.query<
                CodegenShop.SetCustomerForOrderMutation,
                CodegenShop.SetCustomerForOrderMutationVariables
            >(SET_CUSTOMER, {
                input: {
                    firstName: 'Joe',
                    lastName: 'Test',
                    emailAddress: 'joetest@company.com',
                },
            });

            const { transitionOrderToState } = await shopClient.query<
                CodegenShop.TransitionToStateMutation,
                CodegenShop.TransitionToStateMutationVariables
            >(TRANSITION_TO_STATE, {
                state: 'ValidatingCustomer',
            });
            orderErrorGuard.assertSuccess(transitionOrderToState);

            expect(transitionEndSpy).toHaveBeenCalledTimes(1);
            expect(transitionEndSpy.mock.calls[0].slice(0, 2)).toEqual(['AddingItems', 'ValidatingCustomer']);
            expect(transitionOrderToState?.state).toBe('ValidatingCustomer');
        });

        it('composes multiple CustomOrderProcesses', async () => {
            transitionEndSpy.mockClear();
            transitionEndSpy2.mockClear();

            const { nextOrderStates } = await shopClient.query<CodegenShop.GetNextOrderStatesQuery>(
                GET_NEXT_STATES,
            );

            expect(nextOrderStates).toEqual(['ArrangingPayment', 'AddingItems', 'Cancelled']);

            await shopClient.query<
                CodegenShop.TransitionToStateMutation,
                CodegenShop.TransitionToStateMutationVariables
            >(TRANSITION_TO_STATE, {
                state: 'AddingItems',
            });

            expect(transitionEndSpy.mock.calls[0].slice(0, 2)).toEqual(['ValidatingCustomer', 'AddingItems']);
            expect(transitionEndSpy2.mock.calls[0].slice(0, 2)).toEqual([
                'ValidatingCustomer',
                'AddingItems',
            ]);
        });

        // https://github.com/vendure-ecommerce/vendure/issues/963
        it('allows addPaymentToOrder from a custom state', async () => {
            await shopClient.query<
                CodegenShop.SetShippingMethodMutation,
                CodegenShop.SetShippingMethodMutationVariables
            >(SET_SHIPPING_METHOD, { id: 'T_1' });
            const result0 = await shopClient.query<
                TransitionToStateMutation,
                TransitionToStateMutationVariables
            >(TRANSITION_TO_STATE, {
                state: 'ValidatingCustomer',
            });
            orderErrorGuard.assertSuccess(result0.transitionOrderToState);
            const result1 = await shopClient.query<
                TransitionToStateMutation,
                TransitionToStateMutationVariables
            >(TRANSITION_TO_STATE, {
                state: 'ArrangingPayment',
            });
            orderErrorGuard.assertSuccess(result1.transitionOrderToState);
            const result2 = await shopClient.query<
                TransitionToStateMutation,
                TransitionToStateMutationVariables
            >(TRANSITION_TO_STATE, {
                state: 'PaymentProcessing',
            });
            orderErrorGuard.assertSuccess(result2.transitionOrderToState);
            expect(result2.transitionOrderToState.state).toBe('PaymentProcessing');
            const { addPaymentToOrder } = await shopClient.query<
                AddPaymentToOrderMutation,
                AddPaymentToOrderMutationVariables
            >(ADD_PAYMENT, {
                input: {
                    method: testSuccessfulPaymentMethod.code,
                    metadata: {},
                },
            });
            orderErrorGuard.assertSuccess(addPaymentToOrder);
            expect(addPaymentToOrder.state).toBe('PaymentSettled');
        });
    });

    describe('Admin API transition constraints', () => {
        let order: NonNullable<TestOrderFragmentFragment>;

        beforeAll(async () => {
            await shopClient.asAnonymousUser();
            await shopClient.query<
                CodegenShop.AddItemToOrderMutation,
                CodegenShop.AddItemToOrderMutationVariables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 1,
            });
            await shopClient.query<
                CodegenShop.SetCustomerForOrderMutation,
                CodegenShop.SetCustomerForOrderMutationVariables
            >(SET_CUSTOMER, {
                input: {
                    firstName: 'Su',
                    lastName: 'Test',
                    emailAddress: 'sutest@company.com',
                },
            });
            await shopClient.query<
                CodegenShop.SetShippingAddressMutation,
                CodegenShop.SetShippingAddressMutationVariables
            >(SET_SHIPPING_ADDRESS, {
                input: {
                    fullName: 'name',
                    streetLine1: '12 the street',
                    city: 'foo',
                    postalCode: '123456',
                    countryCode: 'US',
                    phoneNumber: '4444444',
                },
            });
            await shopClient.query<
                CodegenShop.SetShippingMethodMutation,
                CodegenShop.SetShippingMethodMutationVariables
            >(SET_SHIPPING_METHOD, { id: 'T_1' });
            await shopClient.query<
                CodegenShop.TransitionToStateMutation,
                CodegenShop.TransitionToStateMutationVariables
            >(TRANSITION_TO_STATE, {
                state: 'ValidatingCustomer',
            });
            const { transitionOrderToState } = await shopClient.query<
                CodegenShop.TransitionToStateMutation,
                CodegenShop.TransitionToStateMutationVariables
            >(TRANSITION_TO_STATE, {
                state: 'ArrangingPayment',
            });
            orderErrorGuard.assertSuccess(transitionOrderToState);

            order = transitionOrderToState!;
        });

        it('cannot manually transition to PaymentAuthorized', async () => {
            expect(order.state).toBe('ArrangingPayment');

            const { transitionOrderToState } = await adminClient.query<
                Codegen.AdminTransitionMutation,
                Codegen.AdminTransitionMutationVariables
            >(ADMIN_TRANSITION_TO_STATE, {
                id: order.id,
                state: 'PaymentAuthorized',
            });
            orderErrorGuard.assertErrorResult(transitionOrderToState);

            expect(transitionOrderToState!.message).toBe(
                'Cannot transition Order from "ArrangingPayment" to "PaymentAuthorized"',
            );
            expect(transitionOrderToState!.transitionError).toBe(
                'Cannot transition Order to the "PaymentAuthorized" state when the total is not covered by authorized Payments',
            );

            const result = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: order.id,
                },
            );
            expect(result.order?.state).toBe('ArrangingPayment');
        });

        it('cannot manually transition to PaymentSettled', async () => {
            const { transitionOrderToState } = await adminClient.query<
                Codegen.AdminTransitionMutation,
                Codegen.AdminTransitionMutationVariables
            >(ADMIN_TRANSITION_TO_STATE, {
                id: order.id,
                state: 'PaymentSettled',
            });
            orderErrorGuard.assertErrorResult(transitionOrderToState);

            expect(transitionOrderToState!.message).toBe(
                'Cannot transition Order from "ArrangingPayment" to "PaymentSettled"',
            );
            expect(transitionOrderToState!.transitionError).toContain(
                'Cannot transition Order to the "PaymentSettled" state when the total is not covered by settled Payments',
            );

            const result = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: order.id,
                },
            );
            expect(result.order?.state).toBe('ArrangingPayment');
        });

        it('cannot manually transition to Cancelled', async () => {
            const { addPaymentToOrder } = await shopClient.query<
                CodegenShop.AddPaymentToOrderMutation,
                CodegenShop.AddPaymentToOrderMutationVariables
            >(ADD_PAYMENT, {
                input: {
                    method: testSuccessfulPaymentMethod.code,
                    metadata: {},
                },
            });
            orderErrorGuard.assertSuccess(addPaymentToOrder);

            expect(addPaymentToOrder?.state).toBe('PaymentSettled');

            const { transitionOrderToState } = await adminClient.query<
                Codegen.AdminTransitionMutation,
                Codegen.AdminTransitionMutationVariables
            >(ADMIN_TRANSITION_TO_STATE, {
                id: order.id,
                state: 'Cancelled',
            });
            orderErrorGuard.assertErrorResult(transitionOrderToState);

            expect(transitionOrderToState!.message).toBe(
                'Cannot transition Order from "PaymentSettled" to "Cancelled"',
            );
            expect(transitionOrderToState!.transitionError).toContain(
                'Cannot transition Order to the "Cancelled" state unless all OrderItems are cancelled',
            );

            const result = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: order.id,
                },
            );
            expect(result.order?.state).toBe('PaymentSettled');
        });

        it('cannot manually transition to PartiallyDelivered', async () => {
            const { transitionOrderToState } = await adminClient.query<
                Codegen.AdminTransitionMutation,
                Codegen.AdminTransitionMutationVariables
            >(ADMIN_TRANSITION_TO_STATE, {
                id: order.id,
                state: 'PartiallyDelivered',
            });
            orderErrorGuard.assertErrorResult(transitionOrderToState);

            expect(transitionOrderToState!.message).toBe(
                'Cannot transition Order from "PaymentSettled" to "PartiallyDelivered"',
            );
            expect(transitionOrderToState!.transitionError).toContain(
                'Cannot transition Order to the "PartiallyDelivered" state unless some OrderItems are delivered',
            );

            const result = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: order.id,
                },
            );
            expect(result.order?.state).toBe('PaymentSettled');
        });

        it('cannot manually transition to PartiallyDelivered', async () => {
            const { transitionOrderToState } = await adminClient.query<
                Codegen.AdminTransitionMutation,
                Codegen.AdminTransitionMutationVariables
            >(ADMIN_TRANSITION_TO_STATE, {
                id: order.id,
                state: 'Delivered',
            });
            orderErrorGuard.assertErrorResult(transitionOrderToState);

            expect(transitionOrderToState!.message).toBe(
                'Cannot transition Order from "PaymentSettled" to "Delivered"',
            );
            expect(transitionOrderToState!.transitionError).toContain(
                'Cannot transition Order to the "Delivered" state unless all OrderItems are delivered',
            );

            const result = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: order.id,
                },
            );
            expect(result.order?.state).toBe('PaymentSettled');
        });
    });
});
