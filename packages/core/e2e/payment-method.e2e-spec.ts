import {
    DefaultLogger,
    dummyPaymentHandler,
    LanguageCode,
    PaymentMethodEligibilityChecker,
} from '@vendure/core';
import {
    createErrorResultGuard,
    createTestEnvironment,
    E2E_DEFAULT_CHANNEL_TOKEN,
    ErrorResultGuard,
} from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import {
    CreateChannel,
    CreatePaymentMethod,
    CurrencyCode,
    GetPaymentMethod,
    GetPaymentMethodCheckers,
    GetPaymentMethodHandlers,
    GetPaymentMethodList,
    UpdatePaymentMethod,
} from './graphql/generated-e2e-admin-types';
import {
    AddItemToOrder,
    AddPaymentToOrder,
    ErrorCode,
    GetEligiblePaymentMethods,
    TestOrderWithPaymentsFragment,
} from './graphql/generated-e2e-shop-types';
import { CREATE_CHANNEL } from './graphql/shared-definitions';
import { ADD_ITEM_TO_ORDER, ADD_PAYMENT, GET_ELIGIBLE_PAYMENT_METHODS } from './graphql/shop-definitions';
import { proceedToArrangingPayment } from './utils/test-order-utils';

const checkerSpy = jest.fn();

const minPriceChecker = new PaymentMethodEligibilityChecker({
    code: 'min-price-checker',
    description: [{ languageCode: LanguageCode.en, value: 'Min price checker' }],
    args: {
        minPrice: {
            type: 'int',
        },
    },
    check(ctx, order, args) {
        checkerSpy();
        if (order.totalWithTax >= args.minPrice) {
            return true;
        } else {
            return `Order total too low`;
        }
    },
});

describe('PaymentMethod resolver', () => {
    const orderGuard: ErrorResultGuard<TestOrderWithPaymentsFragment> = createErrorResultGuard(
        input => !!input.lines,
    );

    const { server, adminClient, shopClient } = createTestEnvironment({
        ...testConfig,
        logger: new DefaultLogger(),
        paymentOptions: {
            paymentMethodEligibilityCheckers: [minPriceChecker],
            paymentMethodHandlers: [dummyPaymentHandler],
        },
    });

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 2,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('create', async () => {
        const { createPaymentMethod } = await adminClient.query<
            CreatePaymentMethod.Mutation,
            CreatePaymentMethod.Variables
        >(CREATE_PAYMENT_METHOD, {
            input: {
                code: 'no-checks',
                name: 'No Checker',
                description: 'This is a test payment method',
                enabled: true,
                handler: {
                    code: dummyPaymentHandler.code,
                    arguments: [{ name: 'automaticSettle', value: 'true' }],
                },
            },
        });

        expect(createPaymentMethod).toEqual({
            id: 'T_1',
            name: 'No Checker',
            code: 'no-checks',
            description: 'This is a test payment method',
            enabled: true,
            checker: null,
            handler: {
                args: [
                    {
                        name: 'automaticSettle',
                        value: 'true',
                    },
                ],
                code: 'dummy-payment-handler',
            },
        });
    });

    it('update', async () => {
        const { updatePaymentMethod } = await adminClient.query<
            UpdatePaymentMethod.Mutation,
            UpdatePaymentMethod.Variables
        >(UPDATE_PAYMENT_METHOD, {
            input: {
                id: 'T_1',
                description: 'modified',
                checker: {
                    code: minPriceChecker.code,
                    arguments: [{ name: 'minPrice', value: '0' }],
                },
                handler: {
                    code: dummyPaymentHandler.code,
                    arguments: [{ name: 'automaticSettle', value: 'false' }],
                },
            },
        });

        expect(updatePaymentMethod).toEqual({
            id: 'T_1',
            name: 'No Checker',
            code: 'no-checks',
            description: 'modified',
            enabled: true,
            checker: {
                args: [{ name: 'minPrice', value: '0' }],
                code: minPriceChecker.code,
            },
            handler: {
                args: [
                    {
                        name: 'automaticSettle',
                        value: 'false',
                    },
                ],
                code: dummyPaymentHandler.code,
            },
        });
    });

    it('unset checker', async () => {
        const { updatePaymentMethod } = await adminClient.query<
            UpdatePaymentMethod.Mutation,
            UpdatePaymentMethod.Variables
        >(UPDATE_PAYMENT_METHOD, {
            input: {
                id: 'T_1',
                checker: null,
            },
        });

        expect(updatePaymentMethod.checker).toEqual(null);

        const { paymentMethod } = await adminClient.query<GetPaymentMethod.Query, GetPaymentMethod.Variables>(
            GET_PAYMENT_METHOD,
            { id: 'T_1' },
        );
        expect(paymentMethod.checker).toEqual(null);
    });

    it('paymentMethodEligibilityCheckers', async () => {
        const { paymentMethodEligibilityCheckers } = await adminClient.query<GetPaymentMethodCheckers.Query>(
            GET_PAYMENT_METHOD_CHECKERS,
        );
        expect(paymentMethodEligibilityCheckers).toEqual([
            {
                code: minPriceChecker.code,
                args: [{ name: 'minPrice', type: 'int' }],
            },
        ]);
    });

    it('paymentMethodHandlers', async () => {
        const { paymentMethodHandlers } = await adminClient.query<GetPaymentMethodHandlers.Query>(
            GET_PAYMENT_METHOD_HANDLERS,
        );
        expect(paymentMethodHandlers).toEqual([
            {
                code: dummyPaymentHandler.code,
                args: [{ name: 'automaticSettle', type: 'boolean' }],
            },
        ]);
    });

    describe('eligibility checks', () => {
        beforeAll(async () => {
            await adminClient.query<CreatePaymentMethod.Mutation, CreatePaymentMethod.Variables>(
                CREATE_PAYMENT_METHOD,
                {
                    input: {
                        code: 'price-check',
                        name: 'With Min Price Checker',
                        description: 'Order total must be more than 2k',
                        enabled: true,
                        checker: {
                            code: minPriceChecker.code,
                            arguments: [{ name: 'minPrice', value: '200000' }],
                        },
                        handler: {
                            code: dummyPaymentHandler.code,
                            arguments: [{ name: 'automaticSettle', value: 'true' }],
                        },
                    },
                },
            );
            await adminClient.query<CreatePaymentMethod.Mutation, CreatePaymentMethod.Variables>(
                CREATE_PAYMENT_METHOD,
                {
                    input: {
                        code: 'disabled-method',
                        name: 'Disabled ones',
                        description: 'This method is disabled',
                        enabled: false,
                        handler: {
                            code: dummyPaymentHandler.code,
                            arguments: [{ name: 'automaticSettle', value: 'true' }],
                        },
                    },
                },
            );

            await shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');
            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_1',
                quantity: 1,
            });

            await proceedToArrangingPayment(shopClient);
        });

        it('eligiblePaymentMethods', async () => {
            const { eligiblePaymentMethods } = await shopClient.query<GetEligiblePaymentMethods.Query>(
                GET_ELIGIBLE_PAYMENT_METHODS,
            );
            expect(eligiblePaymentMethods).toEqual([
                {
                    id: 'T_1',
                    code: 'no-checks',
                    isEligible: true,
                    eligibilityMessage: null,
                },
                {
                    id: 'T_2',
                    code: 'price-check',
                    isEligible: false,
                    eligibilityMessage: 'Order total too low',
                },
            ]);
        });

        it('addPaymentToOrder does not allow ineligible method', async () => {
            checkerSpy.mockClear();
            const { addPaymentToOrder } = await shopClient.query<
                AddPaymentToOrder.Mutation,
                AddPaymentToOrder.Variables
            >(ADD_PAYMENT, {
                input: {
                    method: 'price-check',
                    metadata: {},
                },
            });

            orderGuard.assertErrorResult(addPaymentToOrder);

            expect(addPaymentToOrder.errorCode).toBe(ErrorCode.INELIGIBLE_PAYMENT_METHOD_ERROR);
            expect(addPaymentToOrder.eligibilityCheckerMessage).toBe('Order total too low');
            expect(checkerSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('channels', () => {
        const SECOND_CHANNEL_TOKEN = 'SECOND_CHANNEL_TOKEN';
        const THIRD_CHANNEL_TOKEN = 'THIRD_CHANNEL_TOKEN';

        beforeAll(async () => {
            await adminClient.query<CreateChannel.Mutation, CreateChannel.Variables>(CREATE_CHANNEL, {
                input: {
                    code: 'second-channel',
                    token: SECOND_CHANNEL_TOKEN,
                    defaultLanguageCode: LanguageCode.en,
                    currencyCode: CurrencyCode.GBP,
                    pricesIncludeTax: true,
                    defaultShippingZoneId: 'T_1',
                    defaultTaxZoneId: 'T_1',
                },
            });
            await adminClient.query<CreateChannel.Mutation, CreateChannel.Variables>(CREATE_CHANNEL, {
                input: {
                    code: 'third-channel',
                    token: THIRD_CHANNEL_TOKEN,
                    defaultLanguageCode: LanguageCode.en,
                    currencyCode: CurrencyCode.GBP,
                    pricesIncludeTax: true,
                    defaultShippingZoneId: 'T_1',
                    defaultTaxZoneId: 'T_1',
                },
            });
        });

        it('creates a PaymentMethod in channel2', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { createPaymentMethod } = await adminClient.query<
                CreatePaymentMethod.Mutation,
                CreatePaymentMethod.Variables
            >(CREATE_PAYMENT_METHOD, {
                input: {
                    code: 'channel-2-method',
                    name: 'Channel 2 method',
                    description: 'This is a test payment method',
                    enabled: true,
                    handler: {
                        code: dummyPaymentHandler.code,
                        arguments: [{ name: 'automaticSettle', value: 'true' }],
                    },
                },
            });

            expect(createPaymentMethod.code).toBe('channel-2-method');
        });

        it('method is listed in channel2', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { paymentMethods } = await adminClient.query<GetPaymentMethodList.Query>(
                GET_PAYMENT_METHOD_LIST,
            );

            expect(paymentMethods.totalItems).toBe(1);
            expect(paymentMethods.items[0].code).toBe('channel-2-method');
        });

        it('method is not listed in channel3', async () => {
            adminClient.setChannelToken(THIRD_CHANNEL_TOKEN);
            const { paymentMethods } = await adminClient.query<GetPaymentMethodList.Query>(
                GET_PAYMENT_METHOD_LIST,
            );

            expect(paymentMethods.totalItems).toBe(0);
        });

        it('method is listed in default channel', async () => {
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { paymentMethods } = await adminClient.query<GetPaymentMethodList.Query>(
                GET_PAYMENT_METHOD_LIST,
            );

            expect(paymentMethods.totalItems).toBe(4);
            expect(paymentMethods.items.map(i => i.code).sort()).toEqual([
                'channel-2-method',
                'disabled-method',
                'no-checks',
                'price-check',
            ]);
        });
    });
});

export const PAYMENT_METHOD_FRAGMENT = gql`
    fragment PaymentMethod on PaymentMethod {
        id
        code
        name
        description
        enabled
        checker {
            code
            args {
                name
                value
            }
        }
        handler {
            code
            args {
                name
                value
            }
        }
    }
`;

export const CREATE_PAYMENT_METHOD = gql`
    mutation CreatePaymentMethod($input: CreatePaymentMethodInput!) {
        createPaymentMethod(input: $input) {
            ...PaymentMethod
        }
    }
    ${PAYMENT_METHOD_FRAGMENT}
`;

export const UPDATE_PAYMENT_METHOD = gql`
    mutation UpdatePaymentMethod($input: UpdatePaymentMethodInput!) {
        updatePaymentMethod(input: $input) {
            ...PaymentMethod
        }
    }
    ${PAYMENT_METHOD_FRAGMENT}
`;

export const GET_PAYMENT_METHOD_HANDLERS = gql`
    query GetPaymentMethodHandlers {
        paymentMethodHandlers {
            code
            args {
                name
                type
            }
        }
    }
`;

export const GET_PAYMENT_METHOD_CHECKERS = gql`
    query GetPaymentMethodCheckers {
        paymentMethodEligibilityCheckers {
            code
            args {
                name
                type
            }
        }
    }
`;

export const GET_PAYMENT_METHOD = gql`
    query GetPaymentMethod($id: ID!) {
        paymentMethod(id: $id) {
            ...PaymentMethod
        }
    }
    ${PAYMENT_METHOD_FRAGMENT}
`;

export const GET_PAYMENT_METHOD_LIST = gql`
    query GetPaymentMethodList($options: PaymentMethodListOptions) {
        paymentMethods(options: $options) {
            items {
                ...PaymentMethod
            }
            totalItems
        }
    }
    ${PAYMENT_METHOD_FRAGMENT}
`;
