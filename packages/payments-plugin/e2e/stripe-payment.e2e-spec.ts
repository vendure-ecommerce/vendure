/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CurrencyCode, LanguageCode } from '@vendure/common/lib/generated-types';
import { EntityHydrator, mergeConfig } from '@vendure/core';
import { testCreateStockLocationDocument } from '@vendure/core/e2e/graphql/admin-definitions';
import {
    createProductDocument,
    createProductVariantsDocument,
} from '@vendure/core/e2e/graphql/shared-definitions';
import {
    createErrorResultGuard,
    createTestEnvironment,
    E2E_DEFAULT_CHANNEL_TOKEN,
    ErrorResultGuard,
} from '@vendure/testing';
import nock from 'nock';
import fetch from 'node-fetch';
import path from 'path';
import { Stripe } from 'stripe';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';
import { StripePlugin } from '../src/stripe';
import { stripePaymentMethodHandler } from '../src/stripe/stripe.handler';

import {
    createChannelDocument,
    createPaymentMethodDocument,
    getCustomerListDocument,
} from './graphql/admin-definitions';
import { ResultOf } from './graphql/graphql-admin';
import { FragmentOf } from './graphql/graphql-shop';
import { createStripePaymentIntentDocument } from './graphql/shared-definitions';
import {
    addItemToOrderDocument,
    getActiveOrderDocument,
    testOrderFragment,
} from './graphql/shop-definitions';
import { setShipping } from './payment-helpers';

describe('Stripe payments', () => {
    const devConfig = mergeConfig(testConfig(), {
        plugins: [
            StripePlugin.init({
                storeCustomersInStripe: true,
            }),
        ],
    });
    const { shopClient, adminClient, server } = createTestEnvironment(devConfig);
    let started = false;
    let customers: ResultOf<typeof getCustomerListDocument>['customers']['items'];
    let order: FragmentOf<typeof testOrderFragment>;
    let serverPort: number;

    const orderGuard: ErrorResultGuard<FragmentOf<typeof testOrderFragment>> = createErrorResultGuard(
        input => !!input.lines,
    );
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
        } = await adminClient.query(getCustomerListDocument, {
            options: {
                take: 2,
            },
        }));
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('Should start successfully', () => {
        expect(started).toEqual(true);
        expect(customers).toHaveLength(2);
    });

    it('Should prepare an order', async () => {
        await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
        const { addItemToOrder } = await shopClient.query(addItemToOrderDocument, {
            productVariantId: 'T_1',
            quantity: 2,
        });
        orderGuard.assertSuccess(addItemToOrder);
        order = addItemToOrder;
        expect(order.code).toBeDefined();
    });

    it('Should add a Stripe paymentMethod', async () => {
        const { createPaymentMethod } = await adminClient.query(createPaymentMethodDocument, {
            input: {
                code: `stripe-payment-${E2E_DEFAULT_CHANNEL_TOKEN}`,
                translations: [
                    {
                        name: 'Stripe payment test',
                        description: 'This is a Stripe test payment method',
                        languageCode: LanguageCode.en,
                    },
                ],
                enabled: true,
                handler: {
                    code: stripePaymentMethodHandler.code,
                    arguments: [
                        { name: 'apiKey', value: 'test-api-key' },
                        { name: 'webhookSecret', value: 'test-signing-secret' },
                    ],
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

        const { createStripePaymentIntent } = await shopClient.query(createStripePaymentIntentDocument);
        expect(createCustomerPayload).toEqual({
            email: 'hayden.zieme12@hotmail.com',
            name: 'Hayden Zieme',
        });
    });

    it('should send correct payload to create payment intent', async () => {
        let createPaymentIntentPayload: any;
        const { activeOrder } = await shopClient.query(getActiveOrderDocument);
        nock('https://api.stripe.com/')
            .post('/v1/payment_intents', body => {
                createPaymentIntentPayload = body;
                return true;
            })
            .reply(200, {
                client_secret: 'test-client-secret',
            });
        const { createStripePaymentIntent } = await shopClient.query(createStripePaymentIntentDocument);
        expect(createPaymentIntentPayload).toEqual({
            amount: activeOrder?.totalWithTax.toString(),
            currency: activeOrder?.currencyCode?.toLowerCase(),
            customer: 'new-customer-id',
            'automatic_payment_methods[enabled]': 'true',
            'metadata[channelToken]': E2E_DEFAULT_CHANNEL_TOKEN,
            'metadata[orderId]': '1',
            'metadata[orderCode]': activeOrder?.code,
            'metadata[languageCode]': 'en',
        });
        expect(createStripePaymentIntent).toEqual('test-client-secret');
    });

    // https://github.com/vendure-ecommerce/vendure/issues/1935
    it('should attach metadata to stripe payment intent', async () => {
        StripePlugin.options.metadata = async (injector, ctx, currentOrder) => {
            const hydrator = injector.get(EntityHydrator);
            await hydrator.hydrate(ctx, currentOrder, { relations: ['customer'] });
            return {
                customerEmail: currentOrder.customer?.emailAddress ?? 'demo',
            };
        };
        let createPaymentIntentPayload: any;
        const { activeOrder } = await shopClient.query(getActiveOrderDocument);
        nock('https://api.stripe.com/')
            .post('/v1/payment_intents', body => {
                createPaymentIntentPayload = body;
                return true;
            })
            .reply(200, {
                client_secret: 'test-client-secret',
            });
        const { createStripePaymentIntent } = await shopClient.query(createStripePaymentIntentDocument);
        expect(createPaymentIntentPayload).toEqual({
            amount: activeOrder?.totalWithTax.toString(),
            currency: activeOrder?.currencyCode?.toLowerCase(),
            customer: 'new-customer-id',
            'automatic_payment_methods[enabled]': 'true',
            'metadata[channelToken]': E2E_DEFAULT_CHANNEL_TOKEN,
            'metadata[orderId]': '1',
            'metadata[orderCode]': activeOrder?.code,
            'metadata[languageCode]': 'en',
            'metadata[customerEmail]': customers[0].emailAddress,
        });
        expect(createStripePaymentIntent).toEqual('test-client-secret');
        StripePlugin.options.metadata = undefined;
    });

    // https://github.com/vendure-ecommerce/vendure/issues/2412
    it('should attach additional params to payment intent using paymentIntentCreateParams', async () => {
        StripePlugin.options.paymentIntentCreateParams = async (injector, ctx, currentOrder) => {
            const hydrator = injector.get(EntityHydrator);
            await hydrator.hydrate(ctx, currentOrder, { relations: ['customer'] });
            return {
                description: `Order #${currentOrder.code} for ${currentOrder.customer!.emailAddress}`,
            };
        };
        let createPaymentIntentPayload: any;
        const { activeOrder } = await shopClient.query(getActiveOrderDocument);
        nock('https://api.stripe.com/')
            .post('/v1/payment_intents', body => {
                createPaymentIntentPayload = body;
                return true;
            })
            .reply(200, {
                client_secret: 'test-client-secret',
            });
        const { createStripePaymentIntent } = await shopClient.query(createStripePaymentIntentDocument);
        expect(createPaymentIntentPayload).toEqual({
            amount: activeOrder?.totalWithTax.toString(),
            currency: activeOrder?.currencyCode?.toLowerCase(),
            customer: 'new-customer-id',
            description: `Order #${activeOrder!.code} for ${activeOrder!.customer!.emailAddress}`,
            'automatic_payment_methods[enabled]': 'true',
            'metadata[channelToken]': E2E_DEFAULT_CHANNEL_TOKEN,
            'metadata[languageCode]': 'en',
            'metadata[orderId]': '1',
            'metadata[orderCode]': activeOrder?.code,
        });
        expect(createStripePaymentIntent).toEqual('test-client-secret');
        StripePlugin.options.paymentIntentCreateParams = undefined;
    });

    // https://github.com/vendure-ecommerce/vendure/issues/3183
    it('should attach additional options to payment intent using requestOptions', async () => {
        StripePlugin.options.requestOptions = (injector, ctx, currentOrder) => {
            return {
                stripeAccount: 'acct_connected',
            };
        };
        let connectedAccountHeader: any;
        let createPaymentIntentPayload: any;
        const { activeOrder } = await shopClient.query(getActiveOrderDocument);
        nock('https://api.stripe.com/', {
            reqheaders: {
                'Stripe-Account': headerValue => {
                    connectedAccountHeader = headerValue;
                    return true;
                },
            },
        })
            .post('/v1/payment_intents', body => {
                createPaymentIntentPayload = body;
                return true;
            })
            .reply(200, {
                client_secret: 'test-client-secret',
            });
        const { createStripePaymentIntent } = await shopClient.query(createStripePaymentIntentDocument);
        expect(createPaymentIntentPayload).toEqual({
            amount: activeOrder?.totalWithTax.toString(),
            currency: activeOrder?.currencyCode?.toLowerCase(),
            customer: 'new-customer-id',
            'automatic_payment_methods[enabled]': 'true',
            'metadata[channelToken]': E2E_DEFAULT_CHANNEL_TOKEN,
            'metadata[orderId]': '1',
            'metadata[languageCode]': 'en',
            'metadata[orderCode]': activeOrder?.code,
        });
        expect(connectedAccountHeader).toEqual('acct_connected');
        expect(createStripePaymentIntent).toEqual('test-client-secret');
        StripePlugin.options.paymentIntentCreateParams = undefined;
    });

    // https://github.com/vendure-ecommerce/vendure/issues/2412
    it('should attach additional params to customer using customerCreateParams', async () => {
        StripePlugin.options.customerCreateParams = async (injector, ctx, currentOrder) => {
            const hydrator = injector.get(EntityHydrator);
            await hydrator.hydrate(ctx, currentOrder, { relations: ['customer'] });
            return {
                description: `Description for ${currentOrder.customer!.emailAddress}`,
                phone: '12345',
            };
        };

        await shopClient.asUserWithCredentials(customers[1].emailAddress, 'test');
        const { addItemToOrder } = await shopClient.query(addItemToOrderDocument, {
            productVariantId: 'T_1',
            quantity: 2,
        });
        orderGuard.assertSuccess(addItemToOrder);
        order = addItemToOrder;

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

        const { activeOrder } = await shopClient.query(getActiveOrderDocument);

        await shopClient.query(createStripePaymentIntentDocument);
        expect(createCustomerPayload).toEqual({
            email: 'trevor_donnelly96@hotmail.com',
            name: 'Trevor Donnelly',
            description: `Description for ${activeOrder!.customer!.emailAddress}`,
            phone: '12345',
        });
    });

    // https://github.com/vendure-ecommerce/vendure/issues/2450
    it('Should not crash on signature validation failure', async () => {
        const MOCKED_WEBHOOK_PAYLOAD = {
            id: 'evt_0',
            object: 'event',
            api_version: '2022-11-15',
            data: {
                object: {
                    id: 'pi_0',
                    currency: 'usd',
                    status: 'succeeded',
                },
            },
            livemode: false,
            pending_webhooks: 1,
            request: {
                id: 'req_0',
                idempotency_key: '00000000-0000-0000-0000-000000000000',
            },
            type: 'payment_intent.succeeded',
        };

        const payloadString = JSON.stringify(MOCKED_WEBHOOK_PAYLOAD, null, 2);

        const result = await fetch(`http://localhost:${serverPort}/payments/stripe`, {
            method: 'post',
            body: payloadString,
            headers: { 'Content-Type': 'application/json' },
        });

        // We didn't provided any signatures, it should result in a 400 - Bad request
        expect(result.status).toEqual(400);
    });

    // TODO: Contribution welcome: test webhook handling and order settlement
    // https://github.com/vendure-ecommerce/vendure/issues/2450
    it("Should validate the webhook's signature properly", async () => {
        await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');

        const { activeOrder } = await shopClient.query(getActiveOrderDocument);
        order = activeOrder!;

        const MOCKED_WEBHOOK_PAYLOAD = {
            id: 'evt_0',
            object: 'event',
            api_version: '2022-11-15',
            data: {
                object: {
                    id: 'pi_0',
                    currency: 'usd',
                    metadata: {
                        orderCode: order.code,
                        orderId: parseInt(order.id.replace('T_', ''), 10),
                        channelToken: E2E_DEFAULT_CHANNEL_TOKEN,
                    },
                    amount_received: order.totalWithTax,
                    status: 'succeeded',
                },
            },
            livemode: false,
            pending_webhooks: 1,
            request: {
                id: 'req_0',
                idempotency_key: '00000000-0000-0000-0000-000000000000',
            },
            type: 'payment_intent.succeeded',
        };

        const payloadString = JSON.stringify(MOCKED_WEBHOOK_PAYLOAD, null, 2);
        const stripeWebhooks = new Stripe('test-api-secret', { apiVersion: '2023-08-16' }).webhooks;
        const header = stripeWebhooks.generateTestHeaderString({
            payload: payloadString,
            secret: 'test-signing-secret',
        });

        const event = stripeWebhooks.constructEvent(payloadString, header, 'test-signing-secret');
        expect(event.id).to.equal(MOCKED_WEBHOOK_PAYLOAD.id);
        await setShipping(shopClient);
        // Due to the `this.orderService.transitionToState(...)` fails with the internal lookup by id,
        // we need to put the order into `ArrangingPayment` state manually before calling the webhook handler.
        // const transitionResult = await adminClient.query(TRANSITION_TO_ARRANGING_PAYMENT, { id: order.id });
        // expect(transitionResult.transitionOrderToState.__typename).toBe('Order')

        const result = await fetch(`http://localhost:${serverPort}/payments/stripe`, {
            method: 'post',
            body: payloadString,
            headers: { 'Content-Type': 'application/json', 'Stripe-Signature': header },
        });

        // I would expect to the status to be 200, but at the moment either the
        // `orderService.transitionToState()` or the `orderService.addPaymentToOrder()`
        // throws an error of 'error.entity-with-id-not-found'
        expect(result.status).toEqual(200);
    });

    // https://github.com/vendure-ecommerce/vendure/issues/3249
    it('Should skip events without expected metadata, when the plugin option is set', async () => {
        StripePlugin.options.skipPaymentIntentsWithoutExpectedMetadata = true;

        const MOCKED_WEBHOOK_PAYLOAD = {
            id: 'evt_0',
            object: 'event',
            api_version: '2022-11-15',
            data: {
                object: {
                    id: 'pi_0',
                    currency: 'usd',
                    metadata: {
                        dummy: 'not a vendure payload',
                    },
                    amount_received: 10000,
                    status: 'succeeded',
                },
            },
            livemode: false,
            pending_webhooks: 1,
            request: {
                id: 'req_0',
                idempotency_key: '00000000-0000-0000-0000-000000000000',
            },
            type: 'payment_intent.succeeded',
        };

        const payloadString = JSON.stringify(MOCKED_WEBHOOK_PAYLOAD, null, 2);
        const stripeWebhooks = new Stripe('test-api-secret', { apiVersion: '2023-08-16' }).webhooks;
        const header = stripeWebhooks.generateTestHeaderString({
            payload: payloadString,
            secret: 'test-signing-secret',
        });

        const result = await fetch(`http://localhost:${serverPort}/payments/stripe`, {
            method: 'post',
            body: payloadString,
            headers: { 'Content-Type': 'application/json', 'Stripe-Signature': header },
        });

        expect(result.status).toEqual(200);
    });

    // https://github.com/vendure-ecommerce/vendure/issues/1630
    describe('currencies with no fractional units', () => {
        let japanProductId: string;
        beforeAll(async () => {
            const JAPAN_CHANNEL_TOKEN = 'japan-channel-token';
            const { createChannel } = await adminClient.query(createChannelDocument, {
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

            const { createStockLocation } = await adminClient.query(testCreateStockLocationDocument, {
                input: {
                    name: 'Japan warehouse',
                },
            });

            const { createProduct } = await adminClient.query(createProductDocument, {
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
            const { createProductVariants } = await adminClient.query(createProductVariantsDocument, {
                input: [
                    {
                        productId: createProduct.id,
                        sku: 'PV1',
                        optionIds: [],
                        price: 5000,
                        stockLevels: [
                            {
                                stockLocationId: createStockLocation.id,
                                stockOnHand: 100,
                            },
                        ],
                        translations: [{ languageCode: LanguageCode.en, name: 'Variant 1' }],
                    },
                ],
            });
            japanProductId = createProductVariants[0]!.id;
            // Create a payment method for the Japan channel
            await adminClient.query(createPaymentMethodDocument, {
                input: {
                    code: `stripe-payment-${E2E_DEFAULT_CHANNEL_TOKEN}`,
                    translations: [
                        {
                            name: 'Stripe payment test',
                            description: 'This is a Stripe test payment method',
                            languageCode: LanguageCode.en,
                        },
                    ],
                    enabled: true,
                    handler: {
                        code: stripePaymentMethodHandler.code,
                        arguments: [
                            { name: 'apiKey', value: 'test-api-key' },
                            { name: 'webhookSecret', value: 'test-signing-secret' },
                        ],
                    },
                },
            });
        });

        it('prepares order', async () => {
            await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');
            const { addItemToOrder } = await shopClient.query(addItemToOrderDocument, {
                productVariantId: japanProductId,
                quantity: 1,
            });
            expect((addItemToOrder as any).totalWithTax).toBe(5000);
        });

        it('sends correct amount when creating payment intent', async () => {
            let createPaymentIntentPayload: any;
            const { activeOrder } = await shopClient.query(getActiveOrderDocument);
            nock('https://api.stripe.com/')
                .post('/v1/payment_intents', body => {
                    createPaymentIntentPayload = body;
                    return true;
                })
                .reply(200, {
                    client_secret: 'test-client-secret',
                });
            const { createStripePaymentIntent } = await shopClient.query(createStripePaymentIntentDocument);
            expect(createPaymentIntentPayload.amount).toBe((activeOrder!.totalWithTax / 100).toString());
            expect(createPaymentIntentPayload.currency).toBe('jpy');
        });
    });
});
