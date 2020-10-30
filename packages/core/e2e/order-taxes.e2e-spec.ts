import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { testSuccessfulPaymentMethod } from './fixtures/test-payment-methods';
import { GetProductsWithVariantPrices, UpdateChannel } from './graphql/generated-e2e-admin-types';
import {
    AddItemToOrder,
    AdjustmentType,
    GetActiveOrderWithPriceData,
    TestOrderFragmentFragment,
    UpdatedOrderFragment,
} from './graphql/generated-e2e-shop-types';
import { GET_PRODUCTS_WITH_VARIANT_PRICES, UPDATE_CHANNEL } from './graphql/shared-definitions';
import { ADD_ITEM_TO_ORDER, GET_ACTIVE_ORDER_WITH_PRICE_DATA } from './graphql/shop-definitions';

describe('Order taxes', () => {
    const { server, adminClient, shopClient } = createTestEnvironment({
        ...testConfig,
        paymentOptions: {
            paymentMethodHandlers: [testSuccessfulPaymentMethod],
        },
    });

    type OrderSuccessResult = UpdatedOrderFragment | TestOrderFragmentFragment;
    const orderResultGuard: ErrorResultGuard<OrderSuccessResult> = createErrorResultGuard<OrderSuccessResult>(
        input => !!input.lines,
    );
    let products: GetProductsWithVariantPrices.Items[];

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-promotions.csv'),
            customerCount: 2,
        });
        await adminClient.asSuperAdmin();
        const result = await adminClient.query<GetProductsWithVariantPrices.Query>(
            GET_PRODUCTS_WITH_VARIANT_PRICES,
        );
        products = result.products.items;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('Channel.pricesIncludeTax = false', () => {
        beforeAll(async () => {
            await adminClient.query<UpdateChannel.Mutation, UpdateChannel.Variables>(UPDATE_CHANNEL, {
                input: {
                    id: 'T_1',
                    pricesIncludeTax: false,
                },
            });
            await shopClient.asAnonymousUser();
        });

        it('prices are correct', async () => {
            const variant = products[0].variants[0];
            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: variant.id,
                quantity: 2,
            });

            const { activeOrder } = await shopClient.query<GetActiveOrderWithPriceData.Query>(
                GET_ACTIVE_ORDER_WITH_PRICE_DATA,
            );
            expect(activeOrder?.total).toBe(240);
            expect(activeOrder?.totalBeforeTax).toBe(200);
            expect(activeOrder?.lines[0].taxRate).toBe(20);
            expect(activeOrder?.lines[0].linePrice).toBe(200);
            expect(activeOrder?.lines[0].lineTax).toBe(40);
            expect(activeOrder?.lines[0].linePriceWithTax).toBe(240);
            expect(activeOrder?.lines[0].unitPrice).toBe(100);
            expect(activeOrder?.lines[0].unitPriceWithTax).toBe(120);
            expect(activeOrder?.lines[0].items[0].unitPrice).toBe(100);
            expect(activeOrder?.lines[0].items[0].unitPriceWithTax).toBe(120);
            expect(activeOrder?.lines[0].items[0].taxRate).toBe(20);
            expect(activeOrder?.lines[0].adjustments).toEqual([
                {
                    type: AdjustmentType.TAX,
                    amount: 20,
                },
                {
                    type: AdjustmentType.TAX,
                    amount: 20,
                },
            ]);
        });
    });

    describe('Channel.pricesIncludeTax = true', () => {
        beforeAll(async () => {
            await adminClient.query<UpdateChannel.Mutation, UpdateChannel.Variables>(UPDATE_CHANNEL, {
                input: {
                    id: 'T_1',
                    pricesIncludeTax: true,
                },
            });
            await shopClient.asAnonymousUser();
        });

        it('prices are correct', async () => {
            const variant = products[0].variants[0];
            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: variant.id,
                quantity: 2,
            });

            const { activeOrder } = await shopClient.query<GetActiveOrderWithPriceData.Query>(
                GET_ACTIVE_ORDER_WITH_PRICE_DATA,
            );
            expect(activeOrder?.total).toBe(200);
            expect(activeOrder?.totalBeforeTax).toBe(166);
            expect(activeOrder?.lines[0].taxRate).toBe(20);
            expect(activeOrder?.lines[0].linePrice).toBe(166);
            expect(activeOrder?.lines[0].lineTax).toBe(34);
            expect(activeOrder?.lines[0].linePriceWithTax).toBe(200);
            expect(activeOrder?.lines[0].unitPrice).toBe(83);
            expect(activeOrder?.lines[0].unitPriceWithTax).toBe(100);
            expect(activeOrder?.lines[0].items[0].unitPrice).toBe(83);
            expect(activeOrder?.lines[0].items[0].unitPriceWithTax).toBe(100);
            expect(activeOrder?.lines[0].items[0].taxRate).toBe(20);
            expect(activeOrder?.lines[0].adjustments).toEqual([
                {
                    type: AdjustmentType.TAX,
                    amount: 17,
                },
                {
                    type: AdjustmentType.TAX,
                    amount: 17,
                },
            ]);
        });
    });
});
