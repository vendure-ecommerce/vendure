/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    CustomOrderProcess,
    CustomPaymentProcess,
    DefaultLogger,
    defaultOrderProcess,
    LanguageCode,
    mergeConfig,
    Order,
    OrderPlacedStrategy,
    OrderState,
    PaymentMethodHandler,
    RequestContext,
    TransactionalConnection,
} from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { vi } from 'vitest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { ORDER_WITH_LINES_FRAGMENT } from './graphql/fragments';
import * as Codegen from './graphql/generated-e2e-admin-types';
import { ErrorCode } from './graphql/generated-e2e-admin-types';
import * as CodegenShop from './graphql/generated-e2e-shop-types';
import {
    ADMIN_TRANSITION_TO_STATE,
    GET_ORDER,
    TRANSITION_PAYMENT_TO_STATE,
} from './graphql/shared-definitions';
import { ADD_ITEM_TO_ORDER, ADD_PAYMENT, GET_ACTIVE_ORDER } from './graphql/shop-definitions';
import { proceedToArrangingPayment } from './utils/test-order-utils';

const initSpy = vi.fn();
const transitionStartSpy = vi.fn();
const transitionEndSpy = vi.fn();
const transitionErrorSpy = vi.fn();
const settlePaymentSpy = vi.fn();

describe('Payment process', () => {
    let orderId: string;
    let payment1Id: string;

    const PAYMENT_ERROR_MESSAGE = 'Payment is not valid';
    const customPaymentProcess: CustomPaymentProcess<'Validating'> = {
        init(injector) {
            initSpy(injector.get(TransactionalConnection).rawConnection.name);
        },
        transitions: {
            Created: {
                to: ['Validating'],
                mergeStrategy: 'merge',
            },
            Validating: {
                to: ['Settled', 'Declined', 'Cancelled'],
            },
        },
        onTransitionStart(fromState, toState, data) {
            transitionStartSpy(fromState, toState, data);
            if (fromState === 'Validating' && toState === 'Settled') {
                if (!data.payment.metadata.valid) {
                    return PAYMENT_ERROR_MESSAGE;
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

    const customOrderProcess: CustomOrderProcess<'ValidatingPayment'> = {
        transitions: {
            ArrangingPayment: {
                to: ['ValidatingPayment'],
                mergeStrategy: 'replace',
            },
            ValidatingPayment: {
                to: ['PaymentAuthorized', 'PaymentSettled', 'ArrangingAdditionalPayment'],
            },
        },
    };

    const testPaymentHandler = new PaymentMethodHandler({
        code: 'test-handler',
        description: [{ languageCode: LanguageCode.en, value: 'Test handler' }],
        args: {},
        createPayment: (ctx, order, amount, args, metadata) => {
            return {
                state: 'Validating' as any,
                amount,
                metadata,
            };
        },
        settlePayment: (ctx, order, payment) => {
            settlePaymentSpy();
            return {
                success: true,
            };
        },
    });

    class TestOrderPlacedStrategy implements OrderPlacedStrategy {
        shouldSetAsPlaced(
            ctx: RequestContext,
            fromState: OrderState,
            toState: OrderState,
            order: Order,
        ): boolean | Promise<boolean> {
            return fromState === 'ArrangingPayment' && toState === ('ValidatingPayment' as any);
        }
    }

    const orderGuard: ErrorResultGuard<CodegenShop.TestOrderFragmentFragment | Codegen.OrderFragment> =
        createErrorResultGuard(input => !!input.total);

    const paymentGuard: ErrorResultGuard<Codegen.PaymentFragment> = createErrorResultGuard(
        input => !!input.id,
    );

    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            // logger: new DefaultLogger(),
            orderOptions: {
                process: [defaultOrderProcess, customOrderProcess] as any,
                orderPlacedStrategy: new TestOrderPlacedStrategy(),
            },
            paymentOptions: {
                paymentMethodHandlers: [testPaymentHandler],
                customPaymentProcess: [customPaymentProcess as any],
            },
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData: {
                ...initialData,
                paymentMethods: [
                    {
                        name: testPaymentHandler.code,
                        handler: { code: testPaymentHandler.code, arguments: [] },
                    },
                ],
            },
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();

        await shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');
        await shopClient.query<
            CodegenShop.AddItemToOrderMutation,
            CodegenShop.AddItemToOrderMutationVariables
        >(ADD_ITEM_TO_ORDER, {
            productVariantId: 'T_1',
            quantity: 1,
        });
        orderId = (await proceedToArrangingPayment(shopClient)) as string;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('CustomPaymentProcess is injectable', () => {
        expect(initSpy).toHaveBeenCalled();
        expect(initSpy.mock.calls[0][0]).toBe('default');
    });

    it('creates Payment in custom state', async () => {
        const { addPaymentToOrder } = await shopClient.query<
            CodegenShop.AddPaymentToOrderMutation,
            CodegenShop.AddPaymentToOrderMutationVariables
        >(ADD_PAYMENT, {
            input: {
                method: testPaymentHandler.code,
                metadata: {
                    valid: true,
                },
            },
        });

        orderGuard.assertSuccess(addPaymentToOrder);

        const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
            GET_ORDER,
            {
                id: orderId,
            },
        );

        expect(order?.state).toBe('ArrangingPayment');
        expect(order?.payments?.length).toBe(1);
        expect(order?.payments?.[0].state).toBe('Validating');
        payment1Id = addPaymentToOrder.payments![0].id;
    });

    it('calls transition hooks', async () => {
        expect(transitionStartSpy.mock.calls[0].slice(0, 2)).toEqual(['Created', 'Validating']);
        expect(transitionEndSpy.mock.calls[0].slice(0, 2)).toEqual(['Created', 'Validating']);
        expect(transitionErrorSpy).not.toHaveBeenCalled();
    });

    it('Payment next states', async () => {
        const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
            GET_ORDER,
            {
                id: orderId,
            },
        );
        expect(order?.payments?.[0].nextStates).toEqual(['Settled', 'Declined', 'Cancelled']);
    });

    it('transition Order to custom state, custom OrderPlacedStrategy sets as placed', async () => {
        const { activeOrder: activeOrderPre } = await shopClient.query<CodegenShop.GetActiveOrderQuery>(
            GET_ACTIVE_ORDER,
        );
        expect(activeOrderPre).not.toBeNull();

        const { transitionOrderToState } = await adminClient.query<
            Codegen.AdminTransitionMutation,
            Codegen.AdminTransitionMutationVariables
        >(ADMIN_TRANSITION_TO_STATE, {
            id: orderId,
            state: 'ValidatingPayment',
        });

        orderGuard.assertSuccess(transitionOrderToState);

        expect(transitionOrderToState.state).toBe('ValidatingPayment');
        expect(transitionOrderToState?.active).toBe(false);

        const { activeOrder: activeOrderPost } = await shopClient.query<CodegenShop.GetActiveOrderQuery>(
            GET_ACTIVE_ORDER,
        );
        expect(activeOrderPost).toBeNull();
    });

    it('transitionPaymentToState succeeds', async () => {
        const { transitionPaymentToState } = await adminClient.query<
            Codegen.TransitionPaymentToStateMutation,
            Codegen.TransitionPaymentToStateMutationVariables
        >(TRANSITION_PAYMENT_TO_STATE, {
            id: payment1Id,
            state: 'Settled',
        });

        paymentGuard.assertSuccess(transitionPaymentToState);
        expect(transitionPaymentToState.state).toBe('Settled');

        const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
            GET_ORDER,
            {
                id: orderId,
            },
        );
        expect(order?.state).toBe('PaymentSettled');
        expect(settlePaymentSpy).toHaveBeenCalled();
    });

    describe('failing, cancelling, and manually adding a Payment', () => {
        let order2Id: string;
        let payment2Id: string;

        beforeAll(async () => {
            await shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');
            await shopClient.query<
                CodegenShop.AddItemToOrderMutation,
                CodegenShop.AddItemToOrderMutationVariables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 1,
            });
            order2Id = (await proceedToArrangingPayment(shopClient)) as string;
            const { addPaymentToOrder } = await shopClient.query<
                CodegenShop.AddPaymentToOrderMutation,
                CodegenShop.AddPaymentToOrderMutationVariables
            >(ADD_PAYMENT, {
                input: {
                    method: testPaymentHandler.code,
                    metadata: {
                        valid: false,
                    },
                },
            });

            orderGuard.assertSuccess(addPaymentToOrder);
            payment2Id = addPaymentToOrder.payments![0].id;

            await adminClient.query<
                Codegen.AdminTransitionMutation,
                Codegen.AdminTransitionMutationVariables
            >(ADMIN_TRANSITION_TO_STATE, {
                id: order2Id,
                state: 'ValidatingPayment',
            });
        });

        it('attempting to transition payment to settled fails', async () => {
            const { transitionPaymentToState } = await adminClient.query<
                Codegen.TransitionPaymentToStateMutation,
                Codegen.TransitionPaymentToStateMutationVariables
            >(TRANSITION_PAYMENT_TO_STATE, {
                id: payment2Id,
                state: 'Settled',
            });

            paymentGuard.assertErrorResult(transitionPaymentToState);
            expect(transitionPaymentToState.errorCode).toBe(ErrorCode.PAYMENT_STATE_TRANSITION_ERROR);
            expect((transitionPaymentToState as any).transitionError).toBe(PAYMENT_ERROR_MESSAGE);

            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: order2Id,
                },
            );
            expect(order?.state).toBe('ValidatingPayment');
        });

        it('cancel failed payment', async () => {
            const { transitionPaymentToState } = await adminClient.query<
                Codegen.TransitionPaymentToStateMutation,
                Codegen.TransitionPaymentToStateMutationVariables
            >(TRANSITION_PAYMENT_TO_STATE, {
                id: payment2Id,
                state: 'Cancelled',
            });

            paymentGuard.assertSuccess(transitionPaymentToState);
            expect(transitionPaymentToState.state).toBe('Cancelled');

            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: order2Id,
                },
            );
            expect(order?.state).toBe('ValidatingPayment');
        });

        it('manually adds payment', async () => {
            const { transitionOrderToState } = await adminClient.query<
                Codegen.AdminTransitionMutation,
                Codegen.AdminTransitionMutationVariables
            >(ADMIN_TRANSITION_TO_STATE, {
                id: order2Id,
                state: 'ArrangingAdditionalPayment',
            });

            orderGuard.assertSuccess(transitionOrderToState);

            const { addManualPaymentToOrder } = await adminClient.query<
                Codegen.AddManualPayment2Mutation,
                Codegen.AddManualPayment2MutationVariables
            >(ADD_MANUAL_PAYMENT, {
                input: {
                    orderId: order2Id,
                    metadata: {},
                    method: 'manual payment',
                    transactionId: '12345',
                },
            });

            orderGuard.assertSuccess(addManualPaymentToOrder);
            expect(addManualPaymentToOrder.state).toBe('ArrangingAdditionalPayment');
            expect(addManualPaymentToOrder.payments![1].state).toBe('Settled');
            expect(addManualPaymentToOrder.payments![1].amount).toBe(addManualPaymentToOrder.totalWithTax);
        });

        it('transitions Order to PaymentSettled', async () => {
            const { transitionOrderToState } = await adminClient.query<
                Codegen.AdminTransitionMutation,
                Codegen.AdminTransitionMutationVariables
            >(ADMIN_TRANSITION_TO_STATE, {
                id: order2Id,
                state: 'PaymentSettled',
            });

            orderGuard.assertSuccess(transitionOrderToState);
            expect(transitionOrderToState.state).toBe('PaymentSettled');

            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: order2Id,
                },
            );
            const settledPaymentAmount = order?.payments
                ?.filter(p => p.state === 'Settled')
                .reduce((sum, p) => sum + p.amount, 0);

            expect(settledPaymentAmount).toBe(order?.totalWithTax);
        });
    });
});

export const ADD_MANUAL_PAYMENT = gql`
    mutation AddManualPayment2($input: ManualPaymentInput!) {
        addManualPaymentToOrder(input: $input) {
            ...OrderWithLines
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${ORDER_WITH_LINES_FRAGMENT}
`;
