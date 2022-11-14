import { ChannelService, DefaultLogger, Logger, LogLevel, mergeConfig, PaymentMethodService } from '@vendure/core';
import { MolliePlugin } from '../package/mollie';
import localtunnel from 'localtunnel';
import { createTestEnvironment, registerInitializer, SqljsInitializer, testConfig } from '@vendure/testing';
import { initialData } from '../../../e2e-common/e2e-initial-data';
import path from 'path';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { CREATE_MOLLIE_PAYMENT_INTENT, setShipping } from './payment-helpers';
import { AddItemToOrder } from './graphql/generated-shop-types';
import { molliePaymentHandler } from '../package/mollie/mollie.handler';
import { ADD_ITEM_TO_ORDER } from './graphql/shop-queries';
import { CreatePaymentMethod } from './graphql/generated-admin-types';
import { CREATE_PAYMENT_METHOD } from './graphql/admin-queries';
import gql from 'graphql-tag';

/**
 * This should only be used to locally test the Mollie payment plugin
 */
(async () => {
    require('dotenv').config();

    registerInitializer('sqljs', new SqljsInitializer(path.join(__dirname, '__data__')));
    const tunnel = await localtunnel({ port: 3050 });
    const config = mergeConfig(testConfig, {
        plugins: [
            ...testConfig.plugins,
            AdminUiPlugin.init({
                route: 'admin',
                port: 5001,
            }),
            MolliePlugin.init({ vendureHost: tunnel.url })
        ],
        logger: new DefaultLogger({level: LogLevel.Debug})
    });
    const {server, shopClient, adminClient} = createTestEnvironment(config as any);
    await server.init({
        initialData,
        productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
        customerCount: 1,
    });
    // Set EUR as currency for Mollie
    await adminClient.asSuperAdmin();
    await adminClient.query(gql`
            mutation {
              updateChannel(input: {id: "T_1", currencyCode: EUR}) {
                __typename
              }
            }
        `);
    // Create method
    await adminClient.query<CreatePaymentMethod.Mutation,
        CreatePaymentMethod.Variables>(CREATE_PAYMENT_METHOD, {
        input: {
            code: 'mollie',
            name: 'Mollie payment test',
            description: 'This is a Mollie test payment method',
            enabled: true,
            handler: {
                code: molliePaymentHandler.code,
                arguments: [
                    { name: 'redirectUrl', value: `${tunnel.url}/admin/orders?filter=open&page=1` },
                    // tslint:disable-next-line:no-non-null-assertion
                    { name: 'apiKey', value: process.env.MOLLIE_APIKEY! },
                ],
            },
        },
    });
    // Prepare order for payment
    await shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');
    await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
        productVariantId: '1',
        quantity: 2,
    });
    await setShipping(shopClient);
    const { createMolliePaymentIntent } = await shopClient.query(CREATE_MOLLIE_PAYMENT_INTENT, {
        input: {
            paymentMethodCode: 'mollie',
        },
    });
    if (createMolliePaymentIntent.errorCode) {
        throw createMolliePaymentIntent;
    }
    Logger.info(`Mollie payment link: ${createMolliePaymentIntent.url}`, 'Mollie DevServer')
})();

