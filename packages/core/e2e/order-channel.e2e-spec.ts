/* tslint:disable:no-non-null-assertion */
import {
    createErrorResultGuard,
    createTestEnvironment,
    E2E_DEFAULT_CHANNEL_TOKEN,
    ErrorResultGuard,
} from '@vendure/testing';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import {
    AssignProductsToChannel,
    CreateChannel,
    CurrencyCode,
    GetCustomerList,
    GetOrder,
    GetOrderList,
    GetProductWithVariants,
    LanguageCode,
} from './graphql/generated-e2e-admin-types';
import { AddItemToOrder, GetActiveOrder, UpdatedOrderFragment } from './graphql/generated-e2e-shop-types';
import {
    ASSIGN_PRODUCT_TO_CHANNEL,
    CREATE_CHANNEL,
    GET_CUSTOMER_LIST,
    GET_ORDER,
    GET_ORDERS_LIST,
    GET_PRODUCT_WITH_VARIANTS,
} from './graphql/shared-definitions';
import { ADD_ITEM_TO_ORDER, GET_ACTIVE_ORDER } from './graphql/shop-definitions';

describe('Channelaware orders', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(testConfig);
    const SECOND_CHANNEL_TOKEN = 'second_channel_token';
    const THIRD_CHANNEL_TOKEN = 'third_channel_token';
    let customerUser: GetCustomerList.Items;
    let product1: GetProductWithVariants.Product;
    let product2: GetProductWithVariants.Product;
    let order1Id: string;
    let order2Id: string;

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();

        const { customers } = await adminClient.query<GetCustomerList.Query, GetCustomerList.Variables>(
            GET_CUSTOMER_LIST,
            {
                options: { take: 1 },
            },
        );
        customerUser = customers.items[0];
        await shopClient.asUserWithCredentials(customerUser.emailAddress, 'test');

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

        product1 = (
            await adminClient.query<GetProductWithVariants.Query, GetProductWithVariants.Variables>(
                GET_PRODUCT_WITH_VARIANTS,
                {
                    id: 'T_1',
                },
            )
        ).product!;

        await adminClient.query<AssignProductsToChannel.Mutation, AssignProductsToChannel.Variables>(
            ASSIGN_PRODUCT_TO_CHANNEL,
            {
                input: {
                    channelId: 'T_2',
                    productIds: [product1.id],
                },
            },
        );

        product2 = (
            await adminClient.query<GetProductWithVariants.Query, GetProductWithVariants.Variables>(
                GET_PRODUCT_WITH_VARIANTS,
                {
                    id: 'T_2',
                },
            )
        ).product!;

        await adminClient.query<AssignProductsToChannel.Mutation, AssignProductsToChannel.Variables>(
            ASSIGN_PRODUCT_TO_CHANNEL,
            {
                input: {
                    channelId: 'T_3',
                    productIds: [product2.id],
                },
            },
        );
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    const orderResultGuard: ErrorResultGuard<UpdatedOrderFragment> = createErrorResultGuard(
        input => !!input.lines,
    );

    it('creates order on current channel', async () => {
        shopClient.setChannelToken(SECOND_CHANNEL_TOKEN);
        const { addItemToOrder } = await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(
            ADD_ITEM_TO_ORDER,
            {
                productVariantId: product1.variants[0].id,
                quantity: 1,
            },
        );
        orderResultGuard.assertSuccess(addItemToOrder);

        expect(addItemToOrder!.lines.length).toBe(1);
        expect(addItemToOrder!.lines[0].quantity).toBe(1);
        expect(addItemToOrder!.lines[0].productVariant.id).toBe(product1.variants[0].id);

        order1Id = addItemToOrder!.id;
    });

    it('sets active order to null when switching channel', async () => {
        shopClient.setChannelToken(THIRD_CHANNEL_TOKEN);
        const result = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
        expect(result.activeOrder).toBeNull();
    });

    it('creates new order on current channel when already active order on other channel', async () => {
        const { addItemToOrder } = await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(
            ADD_ITEM_TO_ORDER,
            {
                productVariantId: product2.variants[0].id,
                quantity: 1,
            },
        );
        orderResultGuard.assertSuccess(addItemToOrder);

        expect(addItemToOrder!.lines.length).toBe(1);
        expect(addItemToOrder!.lines[0].quantity).toBe(1);
        expect(addItemToOrder!.lines[0].productVariant.id).toBe(product2.variants[0].id);

        order2Id = addItemToOrder!.id;
    });

    it('goes back to most recent active order when switching channel', async () => {
        shopClient.setChannelToken(SECOND_CHANNEL_TOKEN);
        const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
        expect(activeOrder!.id).toBe(order1Id);
    });

    it('returns null when requesting order from other channel', async () => {
        const result = await shopClient.query<GetOrder.Query>(GET_ORDER, {
            id: order2Id,
        });
        expect(result!.order).toBeNull();
    });

    it('returns order when requesting order from correct channel', async () => {
        const result = await shopClient.query<GetOrder.Query>(GET_ORDER, {
            id: order1Id,
        });
        expect(result.order!.id).toBe(order1Id);
    });

    it('returns all orders on default channel', async () => {
        adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
        const result = await adminClient.query<GetOrderList.Query>(GET_ORDERS_LIST);
        expect(result.orders.items.map(o => o.id).sort()).toEqual([order1Id, order2Id]);
    });

    it('returns only channel specific orders when on other than default channel', async () => {
        adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
        const result = await adminClient.query<GetOrderList.Query>(GET_ORDERS_LIST);
        expect(result.orders.items.map(o => o.id)).toEqual([order1Id]);
    });
});
