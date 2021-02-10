import {
    defaultShippingCalculator,
    defaultShippingEligibilityChecker,
    FulfillmentHandler,
    LanguageCode,
    manualFulfillmentHandler,
    mergeConfig,
} from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { testSuccessfulPaymentMethod } from './fixtures/test-payment-methods';
import {
    CreateFulfillment,
    CreateFulfillmentError,
    CreateShippingMethod,
    ErrorCode,
    FulfillmentFragment,
    GetFulfillmentHandlers,
    TransitFulfillment,
} from './graphql/generated-e2e-admin-types';
import { AddItemToOrder, TestOrderWithPaymentsFragment } from './graphql/generated-e2e-shop-types';
import {
    CREATE_FULFILLMENT,
    CREATE_SHIPPING_METHOD,
    TRANSIT_FULFILLMENT,
} from './graphql/shared-definitions';
import { ADD_ITEM_TO_ORDER } from './graphql/shop-definitions';
import { addPaymentToOrder, proceedToArrangingPayment } from './utils/test-order-utils';

const badTrackingCode = 'bad-code';
const transitionErrorMessage = 'Some error message';
const transitionSpy = jest.fn();
const testFulfillmentHandler = new FulfillmentHandler({
    code: 'test-fulfillment-handler',
    description: [{ languageCode: LanguageCode.en, value: 'Test fulfillment handler' }],
    args: {
        trackingCode: {
            type: 'string',
        },
    },
    createFulfillment: (ctx, orders, items, args) => {
        if (args.trackingCode === badTrackingCode) {
            throw new Error('The code was bad!');
        }
        return {
            trackingCode: args.trackingCode,
        };
    },
    onFulfillmentTransition: (fromState, toState, { fulfillment }) => {
        transitionSpy(fromState, toState);
        if (toState === 'Shipped') {
            return transitionErrorMessage;
        }
    },
});

describe('Order fulfillments', () => {
    const orderGuard: ErrorResultGuard<TestOrderWithPaymentsFragment> = createErrorResultGuard(
        input => !!input.lines,
    );
    const fulfillmentGuard: ErrorResultGuard<FulfillmentFragment> = createErrorResultGuard(
        input => !!input.id,
    );

    let order: TestOrderWithPaymentsFragment;
    let f1Id: string;

    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            paymentOptions: {
                paymentMethodHandlers: [testSuccessfulPaymentMethod],
            },
            shippingOptions: {
                fulfillmentHandlers: [manualFulfillmentHandler, testFulfillmentHandler],
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
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 2,
        });
        await adminClient.asSuperAdmin();
        await adminClient.query<CreateShippingMethod.Mutation, CreateShippingMethod.Variables>(
            CREATE_SHIPPING_METHOD,
            {
                input: {
                    code: 'test-method',
                    fulfillmentHandler: manualFulfillmentHandler.code,
                    checker: {
                        code: defaultShippingEligibilityChecker.code,
                        arguments: [
                            {
                                name: 'orderMinimum',
                                value: '0',
                            },
                        ],
                    },
                    calculator: {
                        code: defaultShippingCalculator.code,
                        arguments: [
                            {
                                name: 'rate',
                                value: '500',
                            },
                            {
                                name: 'taxRate',
                                value: '0',
                            },
                        ],
                    },
                    translations: [{ languageCode: LanguageCode.en, name: 'test method', description: '' }],
                },
            },
        );
        await shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');
        await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
            productVariantId: 'T_1',
            quantity: 1,
        });
        await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
            productVariantId: 'T_2',
            quantity: 1,
        });
        await proceedToArrangingPayment(shopClient);
        const result = await addPaymentToOrder(shopClient, testSuccessfulPaymentMethod);
        orderGuard.assertSuccess(result);
        order = result;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('fulfillmentHandlers query', async () => {
        const { fulfillmentHandlers } = await adminClient.query<GetFulfillmentHandlers.Query>(
            GET_FULFILLMENT_HANDLERS,
        );

        expect(fulfillmentHandlers.map(h => h.code)).toEqual([
            'manual-fulfillment',
            'test-fulfillment-handler',
        ]);
    });

    it('creates fulfillment based on args', async () => {
        const { addFulfillmentToOrder } = await adminClient.query<
            CreateFulfillment.Mutation,
            CreateFulfillment.Variables
        >(CREATE_FULFILLMENT, {
            input: {
                lines: order.lines.slice(0, 1).map(l => ({ orderLineId: l.id, quantity: l.quantity })),
                handler: {
                    code: testFulfillmentHandler.code,
                    arguments: [
                        {
                            name: 'trackingCode',
                            value: 'abc123',
                        },
                    ],
                },
            },
        });
        fulfillmentGuard.assertSuccess(addFulfillmentToOrder);

        expect(addFulfillmentToOrder.trackingCode).toBe('abc123');
        f1Id = addFulfillmentToOrder.id;
    });

    it('onFulfillmentTransition is called', async () => {
        expect(transitionSpy).toHaveBeenCalledTimes(1);
        expect(transitionSpy).toHaveBeenCalledWith('Created', 'Pending');
    });

    it('onFulfillmentTransition can prevent state transition', async () => {
        const { transitionFulfillmentToState } = await adminClient.query<
            TransitFulfillment.Mutation,
            TransitFulfillment.Variables
        >(TRANSIT_FULFILLMENT, {
            id: f1Id,
            state: 'Shipped',
        });

        fulfillmentGuard.assertErrorResult(transitionFulfillmentToState);
        expect(transitionFulfillmentToState.errorCode).toBe(ErrorCode.FULFILLMENT_STATE_TRANSITION_ERROR);
        expect(transitionFulfillmentToState.transitionError).toBe(transitionErrorMessage);
    });

    it('throwing from createFulfillment returns CreateFulfillmentError result', async () => {
        const { addFulfillmentToOrder } = await adminClient.query<
            CreateFulfillment.Mutation,
            CreateFulfillment.Variables
        >(CREATE_FULFILLMENT, {
            input: {
                lines: order.lines.slice(1, 2).map(l => ({ orderLineId: l.id, quantity: l.quantity })),
                handler: {
                    code: testFulfillmentHandler.code,
                    arguments: [
                        {
                            name: 'trackingCode',
                            value: badTrackingCode,
                        },
                    ],
                },
            },
        });
        fulfillmentGuard.assertErrorResult(addFulfillmentToOrder);

        expect(addFulfillmentToOrder.errorCode).toBe(ErrorCode.CREATE_FULFILLMENT_ERROR);
        expect((addFulfillmentToOrder as CreateFulfillmentError).fulfillmentHandlerError).toBe(
            'The code was bad!',
        );
    });
});

const GET_FULFILLMENT_HANDLERS = gql`
    query GetFulfillmentHandlers {
        fulfillmentHandlers {
            code
            description
            args {
                name
                type
                description
                label
                ui
            }
        }
    }
`;
