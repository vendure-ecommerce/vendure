/* tslint:disable:no-non-null-assertion */
import { mergeConfig } from '@vendure/core';
import { CreateProduct, CreateProductVariants } from '@vendure/core/e2e/graphql/generated-e2e-admin-types';
import { CREATE_PRODUCT, CREATE_PRODUCT_VARIANTS } from '@vendure/core/e2e/graphql/shared-definitions';
import { createTestEnvironment, E2E_DEFAULT_CHANNEL_TOKEN } from '@vendure/testing';
import gql from 'graphql-tag';
import nock from 'nock';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';
import { StripePlugin } from '../src/stripe';
import { stripePaymentMethodHandler } from '../src/stripe/stripe.handler';

import { CREATE_CHANNEL, CREATE_PAYMENT_METHOD, GET_CUSTOMER_LIST } from './graphql/admin-queries';
import {
    CreateChannelMutation,
    CreateChannelMutationVariables,
    CreatePaymentMethod,
    CurrencyCode,
    GetCustomerList,
    GetCustomerListQuery,
    LanguageCode,
} from './graphql/generated-admin-types';
import {
    AddItemToOrder,
    GetActiveOrderQuery,
    TestOrderFragmentFragment,
} from './graphql/generated-shop-types';
import { ADD_ITEM_TO_ORDER, GET_ACTIVE_ORDER } from './graphql/shop-queries';
import { setShipping } from './payment-helpers';

export const CREATE_STRIPE_PAYMENT_INTENT = gql`
    mutation createStripePaymentIntent {
        createStripePaymentIntent
    }
`;

describe('Stripe payments', () => {
    const devConfig = mergeConfig(testConfig(), {
        plugins: [
            StripePlugin.init({
                apiKey: 'test-api-key',
                webhookSigningSecret: 'test-signing-secret',
                storeCustomersInStripe: true,
            }),
        ],
    });
    const { shopClient, adminClient, server } = createTestEnvironment(devConfig);
    let started = false;
    let customers: GetCustomerListQuery['customers']['items'];
    let order: TestOrderFragmentFragment;
    let serverPort: number;
    beforeAll(async () => {
        serverPort = devConfig.apiOptions.port;
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 2,
        });
        started = true;
        await adminClient.asSuperAdmin();
        ({
            customers: { items: customers },
        } = await adminClient.query<GetCustomerList.Query, GetCustomerList.Variables>(GET_CUSTOMER_LIST, {
            options: {
                take: 2,
            },
        }));
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('Should start successfully', async () => {
        expect(started).toEqual(true);
        expect(customers).toHaveLength(2);
    });

    it('Should prepare an order', async () => {
        await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
        const { addItemToOrder } = await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(
            ADD_ITEM_TO_ORDER,
            {
                productVariantId: 'T_1',
                quantity: 2,
            },
        );
        order = addItemToOrder as TestOrderFragmentFragment;
        expect(order.code).toBeDefined();
    });

    it('Should add a Stripe paymentMethod', async () => {
        const { createPaymentMethod } = await adminClient.query<
            CreatePaymentMethod.Mutation,
            CreatePaymentMethod.Variables
        >(CREATE_PAYMENT_METHOD, {
            input: {
                code: `stripe-payment-${E2E_DEFAULT_CHANNEL_TOKEN}`,
                name: 'Stripe payment test',
                description: 'This is a Stripe test payment method',
                enabled: true,
                handler: {
                    code: stripePaymentMethodHandler.code,
                    arguments: [],
                },
            },
        });
        expect(createPaymentMethod.code).toBe(`stripe-payment-${E2E_DEFAULT_CHANNEL_TOKEN}`);

        await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
        await setShipping(shopClient);
    });

    it('if no customer id exists, makes a call to create', async () => {
        let createCustomerPayload: { name: string; email: string } | undefined;
        const emptyList = { data: [] };
        nock('https://api.stripe.com/')
            .get(/\/v1\/customers.*/)
            .reply(200, emptyList);
        nock('https://api.stripe.com/')
            .post('/v1/customers', body => {
                createCustomerPayload = body;
                return true;
            })
            .reply(201, {
                id: 'new-customer-id',
            });
        nock('https://api.stripe.com/').post('/v1/payment_intents').reply(200, {
            client_secret: 'test-client-secret',
        });

        const { createStripePaymentIntent } = await shopClient.query(CREATE_STRIPE_PAYMENT_INTENT);
        expect(createCustomerPayload).toEqual({
            email: 'hayden.zieme12@hotmail.com',
            name: 'Hayden Zieme',
        });
    });

    it('should send correct payload to create payment intent', async () => {
        let createPaymentIntentPayload: any;
        const { activeOrder } = await shopClient.query<GetActiveOrderQuery>(GET_ACTIVE_ORDER);
        nock('https://api.stripe.com/')
            .post('/v1/payment_intents', body => {
                createPaymentIntentPayload = body;
                return true;
            })
            .reply(200, {
                client_secret: 'test-client-secret',
            });
        const { createStripePaymentIntent } = await shopClient.query(CREATE_STRIPE_PAYMENT_INTENT);
        expect(createPaymentIntentPayload).toEqual({
            amount: activeOrder?.totalWithTax.toString(),
            currency: activeOrder?.currencyCode?.toLowerCase(),
            customer: 'new-customer-id',
            'automatic_payment_methods[enabled]': 'true',
            'metadata[channelToken]': E2E_DEFAULT_CHANNEL_TOKEN,
            'metadata[orderId]': '1',
            'metadata[orderCode]': activeOrder?.code,
        });
        expect(createStripePaymentIntent).toEqual('test-client-secret');
    });

    // https://github.com/vendure-ecommerce/vendure/issues/1630
    describe('currencies with no fractional units', () => {
        let japanProductId: string;
        beforeAll(async () => {
            const JAPAN_CHANNEL_TOKEN = 'japan-channel-token';
            const { createChannel } = await adminClient.query<
                CreateChannelMutation,
                CreateChannelMutationVariables
            >(CREATE_CHANNEL, {
                input: {
                    code: 'japan-channel',
                    currencyCode: CurrencyCode.JPY,
                    token: JAPAN_CHANNEL_TOKEN,
                    defaultLanguageCode: LanguageCode.en,
                    defaultShippingZoneId: 'T_1',
                    defaultTaxZoneId: 'T_1',
                    pricesIncludeTax: true,
                },
            });

            adminClient.setChannelToken(JAPAN_CHANNEL_TOKEN);
            shopClient.setChannelToken(JAPAN_CHANNEL_TOKEN);

            const { createProduct } = await adminClient.query<
                CreateProduct.Mutation,
                CreateProduct.Variables
            >(CREATE_PRODUCT, {
                input: {
                    translations: [
                        {
                            languageCode: LanguageCode.en,
                            name: 'Channel Product',
                            slug: 'channel-product',
                            description: 'Channel product',
                        },
                    ],
                },
            });
            const { createProductVariants } = await adminClient.query<
                CreateProductVariants.Mutation,
                CreateProductVariants.Variables
            >(CREATE_PRODUCT_VARIANTS, {
                input: [
                    {
                        productId: createProduct.id,
                        sku: 'PV1',
                        optionIds: [],
                        price: 5000,
                        stockOnHand: 100,
                        translations: [{ languageCode: LanguageCode.en, name: 'Variant 1' }],
                    },
                ],
            });
            japanProductId = createProductVariants[0]!.id;
        });

        it('prepares order', async () => {
            await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: japanProductId,
                quantity: 1,
            });
            expect((addItemToOrder as any).totalWithTax).toBe(5000);
        });

        it('sends correct amount when creating payment intent', async () => {
            let createPaymentIntentPayload: any;
            const { activeOrder } = await shopClient.query<GetActiveOrderQuery>(GET_ACTIVE_ORDER);
            nock('https://api.stripe.com/')
                .post('/v1/payment_intents', body => {
                    createPaymentIntentPayload = body;
                    return true;
                })
                .reply(200, {
                    client_secret: 'test-client-secret',
                });
            const { createStripePaymentIntent } = await shopClient.query(CREATE_STRIPE_PAYMENT_INTENT);
            expect(createPaymentIntentPayload.amount).toBe((activeOrder!.totalWithTax / 100).toString());
            expect(createPaymentIntentPayload.currency).toBe('jpy');
        });
    });
});
