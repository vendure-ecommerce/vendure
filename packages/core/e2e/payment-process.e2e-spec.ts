/* tslint:disable:no-non-null-assertion */
import {
    CustomOrderProcess,
    CustomPaymentProcess,
    DefaultLogger,
    LanguageCode,
    mergeConfig,
    Order,
    OrderPlacedStrategy,
    OrderState,
    PaymentMethodHandler,
    RequestContext,
} from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { ORDER_WITH_LINES_FRAGMENT, PAYMENT_FRAGMENT } from './graphql/fragments';
import {
    AddManualPayment2,
    AdminTransition,
    ErrorCode,
    GetOrder,
    OrderFragment,
    PaymentFragment,
    TransitionPaymentToState,
} from './graphql/generated-e2e-admin-types';
import {
    AddItemToOrder,
    AddPaymentToOrder,
    GetActiveOrder,
    TestOrderFragmentFragment,
} from './graphql/generated-e2e-shop-types';
import { ADMIN_TRANSITION_TO_STATE, GET_ORDER } from './graphql/shared-definitions';
import { ADD_ITEM_TO_ORDER, ADD_PAYMENT, GET_ACTIVE_ORDER } from './graphql/shop-definitions';
import { proceedToArrangingPayment } from './utils/test-order-utils';

const initSpy = jest.fn();
const transitionStartSpy = jest.fn();
const transitionEndSpy = jest.fn();
const transitionErrorSpy = jest.fn();
const settlePaymentSpy = jest.fn();

describe('Payment process', () => {
    let orderId: string;
    let payment1Id: string;

    const PAYMENT_ERROR_MESSAGE = 'Payment is not valid';
    const customPaymentProcess: CustomPaymentProcess<'Validating'> = {
        init(injector) {
            initSpy(injector.getConnection().name);
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

    const orderGuard: ErrorResultGuard<TestOrderFragmentFragment | OrderFragment> = createErrorResultGuard(
        input => !!input.total,
    );

    const paymentGuard: ErrorResultGuard<PaymentFragment> = createErrorResultGuard(input => !!input.id);

    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            logger: new DefaultLogger(),
            orderOptions: {
                process: [customOrderProcess as any],
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
        await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
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
            AddPaymentToOrder.Mutation,
            AddPaymentToOrder.Variables
        >(ADD_PAYMENT, {
            input: {
                method: testPaymentHandler.code,
                metadata: {
                    valid: true,
                },
            },
        });

        orderGuard.assertSuccess(addPaymentToOrder);

        const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
            id: orderId,
        });

        expect(order?.state).toBe('ArrangingPayment');
        expect(order?.payments?.length).toBe(1);
        expect(order?.payments?.[0].state).toBe('Validating');
        payment1Id = addPaymentToOrder?.payments?.[0].id!;
    });

    it('calls transition hooks', async () => {
        expect(transitionStartSpy.mock.calls[0].slice(0, 2)).toEqual(['Created', 'Validating']);
        expect(transitionEndSpy.mock.calls[0].slice(0, 2)).toEqual(['Created', 'Validating']);
        expect(transitionErrorSpy).not.toHaveBeenCalled();
    });

    it('Payment next states', async () => {
        const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
            id: orderId,
        });
        expect(order?.payments?.[0].nextStates).toEqual(['Settled', 'Declined', 'Cancelled']);
    });

    it('transition Order to custom state, custom OrderPlacedStrategy sets as placed', async () => {
        const { activeOrder: activeOrderPre } = await shopClient.query<GetActiveOrder.Query>(
            GET_ACTIVE_ORDER,
        );
        expect(activeOrderPre).not.toBeNull();

        const { transitionOrderToState } = await adminClient.query<
            AdminTransition.Mutation,
            AdminTransition.Variables
        >(ADMIN_TRANSITION_TO_STATE, {
            id: orderId,
            state: 'ValidatingPayment',
        });

        orderGuard.assertSuccess(transitionOrderToState);

        expect(transitionOrderToState.state).toBe('ValidatingPayment');
        expect(transitionOrderToState?.active).toBe(false);

        const { activeOrder: activeOrderPost } = await shopClient.query<GetActiveOrder.Query>(
            GET_ACTIVE_ORDER,
        );
        expect(activeOrderPost).toBeNull();
    });

    it('transitionPaymentToState succeeds', async () => {
        const { transitionPaymentToState } = await adminClient.query<
            TransitionPaymentToState.Mutation,
            TransitionPaymentToState.Variables
        >(TRANSITION_PAYMENT_TO_STATE, {
            id: payment1Id,
            state: 'Settled',
        });

        paymentGuard.assertSuccess(transitionPaymentToState);
        expect(transitionPaymentToState.state).toBe('Settled');

        const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
            id: orderId,
        });
        expect(order?.state).toBe('PaymentSettled');
        expect(settlePaymentSpy).toHaveBeenCalled();
    });

    describe('failing, cancelling, and manually adding a Payment', () => {
        let order2Id: string;
        let payment2Id: string;

        beforeAll(async () => {
            await shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');
            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 1,
            });
            order2Id = (await proceedToArrangingPayment(shopClient)) as string;
            const { addPaymentToOrder } = await shopClient.query<
                AddPaymentToOrder.Mutation,
                AddPaymentToOrder.Variables
            >(ADD_PAYMENT, {
                input: {
                    method: testPaymentHandler.code,
                    metadata: {
                        valid: false,
                    },
                },
            });

            orderGuard.assertSuccess(addPaymentToOrder);
            payment2Id = addPaymentToOrder!.payments![0].id;

            await adminClient.query<AdminTransition.Mutation, AdminTransition.Variables>(
                ADMIN_TRANSITION_TO_STATE,
                {
                    id: order2Id,
                    state: 'ValidatingPayment',
                },
            );
        });

        it('attempting to transition payment to settled fails', async () => {
            const { transitionPaymentToState } = await adminClient.query<
                TransitionPaymentToState.Mutation,
                TransitionPaymentToState.Variables
            >(TRANSITION_PAYMENT_TO_STATE, {
                id: payment2Id,
                state: 'Settled',
            });

            paymentGuard.assertErrorResult(transitionPaymentToState);
            expect(transitionPaymentToState.errorCode).toBe(ErrorCode.PAYMENT_STATE_TRANSITION_ERROR);
            expect((transitionPaymentToState as any).transitionError).toBe(PAYMENT_ERROR_MESSAGE);

            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: order2Id,
            });
            expect(order?.state).toBe('ValidatingPayment');
        });

        it('cancel failed payment', async () => {
            const { transitionPaymentToState } = await adminClient.query<
                TransitionPaymentToState.Mutation,
                TransitionPaymentToState.Variables
            >(TRANSITION_PAYMENT_TO_STATE, {
                id: payment2Id,
                state: 'Cancelled',
            });

            paymentGuard.assertSuccess(transitionPaymentToState);
            expect(transitionPaymentToState.state).toBe('Cancelled');

            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: order2Id,
            });
            expect(order?.state).toBe('ValidatingPayment');
        });

        it('manually adds payment', async () => {
            const { transitionOrderToState } = await adminClient.query<
                AdminTransition.Mutation,
                AdminTransition.Variables
            >(ADMIN_TRANSITION_TO_STATE, {
                id: order2Id,
                state: 'ArrangingAdditionalPayment',
            });

            orderGuard.assertSuccess(transitionOrderToState);

            const { addManualPaymentToOrder } = await adminClient.query<
                AddManualPayment2.Mutation,
                AddManualPayment2.Variables
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
                AdminTransition.Mutation,
                AdminTransition.Variables
            >(ADMIN_TRANSITION_TO_STATE, {
                id: order2Id,
                state: 'PaymentSettled',
            });

            orderGuard.assertSuccess(transitionOrderToState);
            expect(transitionOrderToState.state).toBe('PaymentSettled');

            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: order2Id,
            });
            const settledPaymentAmount = order?.payments
                ?.filter(p => p.state === 'Settled')
                .reduce((sum, p) => sum + p.amount, 0);

            expect(settledPaymentAmount).toBe(order?.totalWithTax);
        });
    });
});

const TRANSITION_PAYMENT_TO_STATE = gql`
    mutation TransitionPaymentToState($id: ID!, $state: String!) {
        transitionPaymentToState(id: $id, state: $state) {
            ...Payment
            ... on ErrorResult {
                errorCode
                message
            }
            ... on PaymentStateTransitionError {
                transitionError
            }
        }
    }
    ${PAYMENT_FRAGMENT}
`;

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
