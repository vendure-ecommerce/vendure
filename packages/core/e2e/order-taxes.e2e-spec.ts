/* tslint:disable:no-non-null-assertion */
import { summate } from '@vendure/common/lib/shared-utils';
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
import { sortById } from './utils/test-order-utils';

describe('Order taxes', () => {
    const { server, adminClient, shopClient } = createTestEnvironment({
        ...testConfig,
        paymentOptions: {
            paymentMethodHandlers: [testSuccessfulPaymentMethod],
        },
    });

    type OrderSuccessResult = UpdatedOrderFragment | TestOrderFragmentFragment;
    const orderResultGuard: ErrorResultGuard<OrderSuccessResult> = createErrorResultGuard(
        input => !!input.lines,
    );
    let products: GetProductsWithVariantPrices.Items[];

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
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-order-taxes.csv'),
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
            const variant = products.sort(sortById)[0].variants.sort(sortById)[0];
            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: variant.id,
                quantity: 2,
            });

            const { activeOrder } = await shopClient.query<GetActiveOrderWithPriceData.Query>(
                GET_ACTIVE_ORDER_WITH_PRICE_DATA,
            );
            expect(activeOrder?.totalWithTax).toBe(240);
            expect(activeOrder?.total).toBe(200);
            expect(activeOrder?.lines[0].taxRate).toBe(20);
            expect(activeOrder?.lines[0].linePrice).toBe(200);
            expect(activeOrder?.lines[0].lineTax).toBe(40);
            expect(activeOrder?.lines[0].linePriceWithTax).toBe(240);
            expect(activeOrder?.lines[0].unitPrice).toBe(100);
            expect(activeOrder?.lines[0].unitPriceWithTax).toBe(120);
            expect(activeOrder?.lines[0].items[0].unitPrice).toBe(100);
            expect(activeOrder?.lines[0].items[0].unitPriceWithTax).toBe(120);
            expect(activeOrder?.lines[0].items[0].taxRate).toBe(20);
            expect(activeOrder?.lines[0].taxLines).toEqual([
                {
                    description: 'Standard Tax Europe',
                    taxRate: 20,
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
            expect(activeOrder?.totalWithTax).toBe(200);
            expect(activeOrder?.total).toBe(166);
            expect(activeOrder?.lines[0].taxRate).toBe(20);
            expect(activeOrder?.lines[0].linePrice).toBe(166);
            expect(activeOrder?.lines[0].lineTax).toBe(34);
            expect(activeOrder?.lines[0].linePriceWithTax).toBe(200);
            expect(activeOrder?.lines[0].unitPrice).toBe(83);
            expect(activeOrder?.lines[0].unitPriceWithTax).toBe(100);
            expect(activeOrder?.lines[0].items[0].unitPrice).toBe(83);
            expect(activeOrder?.lines[0].items[0].unitPriceWithTax).toBe(100);
            expect(activeOrder?.lines[0].items[0].taxRate).toBe(20);
            expect(activeOrder?.lines[0].taxLines).toEqual([
                {
                    description: 'Standard Tax Europe',
                    taxRate: 20,
                },
            ]);
        });
    });

    it('taxSummary works', async () => {
        await adminClient.query<UpdateChannel.Mutation, UpdateChannel.Variables>(UPDATE_CHANNEL, {
            input: {
                id: 'T_1',
                pricesIncludeTax: false,
            },
        });
        await shopClient.asAnonymousUser();
        await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
            productVariantId: products[0].variants[0].id,
            quantity: 2,
        });
        await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
            productVariantId: products[1].variants[0].id,
            quantity: 2,
        });
        await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
            productVariantId: products[2].variants[0].id,
            quantity: 2,
        });

        const { activeOrder } = await shopClient.query<GetActiveOrderWithPriceData.Query>(
            GET_ACTIVE_ORDER_WITH_PRICE_DATA,
        );

        expect(activeOrder?.taxSummary).toEqual([
            {
                description: 'Standard Tax Europe',
                taxRate: 20,
                taxBase: 200,
                taxTotal: 40,
            },
            {
                description: 'Reduced Tax Europe',
                taxRate: 10,
                taxBase: 200,
                taxTotal: 20,
            },
            {
                description: 'Zero Tax Europe',
                taxRate: 0,
                taxBase: 200,
                taxTotal: 0,
            },
        ]);

        // ensure that the summary total add up to the overall totals
        const taxSummaryBaseTotal = summate(activeOrder!.taxSummary, 'taxBase');
        const taxSummaryTaxTotal = summate(activeOrder!.taxSummary, 'taxTotal');

        expect(taxSummaryBaseTotal).toBe(activeOrder?.total);
        expect(taxSummaryBaseTotal + taxSummaryTaxTotal).toBe(activeOrder?.totalWithTax);
    });
});
