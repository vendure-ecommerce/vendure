import {
    Channel,
    ChannelService,
    discountOnItemWithFacets,
    hasFacetValues,
    Order,
    OrderLine,
    OrderService,
    ProductVariant,
    ProductVariantService,
    Promotion,
    PromotionService,
    RequestContextService,
    ShippingLine,
    ShippingMethod,
    ShippingMethodService,
    TransactionalConnection,
} from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import { fail } from 'assert';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import { testSuccessfulPaymentMethod } from './fixtures/test-payment-methods';
import * as Codegen from './graphql/generated-e2e-admin-types';
import { LanguageCode } from './graphql/generated-e2e-admin-types';
import * as CodegenShop from './graphql/generated-e2e-shop-types';
import { CREATE_PROMOTION } from './graphql/shared-definitions';
import {
    ADD_ITEM_TO_ORDER,
    ADD_PAYMENT,
    SET_SHIPPING_METHOD,
    TRANSITION_TO_STATE,
} from './graphql/shop-definitions';

/**
 * This suite tests to make sure entities can be serialized. It focuses on those
 * entities that contain methods and/or properties which potentially reference
 * non-serializable objects.
 *
 * See https://github.com/vendure-ecommerce/vendure/issues/3277
 */
describe('Entity serialization', () => {
    type OrderSuccessResult =
        | CodegenShop.UpdatedOrderFragment
        | CodegenShop.TestOrderFragmentFragment
        | CodegenShop.TestOrderWithPaymentsFragment
        | CodegenShop.ActiveOrderCustomerFragment
        | CodegenShop.OrderWithAddressesFragment;
    const orderResultGuard: ErrorResultGuard<OrderSuccessResult> = createErrorResultGuard(
        input => !!input.lines,
    );

    const { server, adminClient, shopClient } = createTestEnvironment({
        ...testConfig(),
        paymentOptions: {
            paymentMethodHandlers: [testSuccessfulPaymentMethod],
        },
    });

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
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('serialize ShippingMethod', async () => {
        const ctx = await createCtx();
        const result = await server.app.get(ShippingMethodService).findAll(ctx);

        expect(result.items.length).toBeGreaterThan(0);
        const shippingMethod = result.items[0];
        expect(shippingMethod instanceof ShippingMethod).toBe(true);

        assertCanBeSerialized(shippingMethod);
        const json = JSON.stringify(shippingMethod);
        const parsed = JSON.parse(json);
        expect(parsed.createdAt).toBe(shippingMethod.createdAt.toISOString());
    });

    it('serialize Channel', async () => {
        const result = await server.app.get(ChannelService).getDefaultChannel();
        expect(result instanceof Channel).toBe(true);

        assertCanBeSerialized(result);
    });

    it('serialize Order', async () => {
        await shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');
        await shopClient.query<
            CodegenShop.AddItemToOrderMutation,
            CodegenShop.AddItemToOrderMutationVariables
        >(ADD_ITEM_TO_ORDER, {
            productVariantId: 'T_1',
            quantity: 1,
        });
        await shopClient.query<
            CodegenShop.SetShippingMethodMutation,
            CodegenShop.SetShippingMethodMutationVariables
        >(SET_SHIPPING_METHOD, {
            id: 'T_1',
        });
        const result = await shopClient.query<
            CodegenShop.TransitionToStateMutation,
            CodegenShop.TransitionToStateMutationVariables
        >(TRANSITION_TO_STATE, { state: 'ArrangingPayment' });

        const { addPaymentToOrder } = await shopClient.query<
            CodegenShop.AddPaymentToOrderMutation,
            CodegenShop.AddPaymentToOrderMutationVariables
        >(ADD_PAYMENT, {
            input: {
                method: testSuccessfulPaymentMethod.code,
                metadata: {
                    foo: 'bar',
                },
            },
        });
        orderResultGuard.assertSuccess(addPaymentToOrder);

        const ctx = await createCtx();
        const order = await server.app.get(OrderService).findOneByCode(ctx, addPaymentToOrder.code);

        expect(order).not.toBeNull();
        expect(order instanceof Order).toBe(true);
        assertCanBeSerialized(order);
    });

    it('serialize OrderLine', async () => {
        const ctx = await createCtx();
        const orderLine = await server.app.get(TransactionalConnection).getEntityOrThrow(ctx, OrderLine, 1);

        expect(orderLine instanceof OrderLine).toBe(true);
        assertCanBeSerialized(orderLine);
    });

    it('serialize ProductVariant', async () => {
        const ctx = await createCtx();
        const productVariant = await server.app.get(ProductVariantService).findOne(ctx, 1);

        expect(productVariant instanceof ProductVariant).toBe(true);
        assertCanBeSerialized(productVariant);
    });

    it('serialize Promotion', async () => {
        await adminClient.query<Codegen.CreatePromotionMutation, Codegen.CreatePromotionMutationVariables>(
            CREATE_PROMOTION,
            {
                input: {
                    enabled: true,
                    startsAt: new Date('2019-10-30T00:00:00.000Z'),
                    endsAt: new Date('2019-12-01T00:00:00.000Z'),
                    translations: [
                        {
                            languageCode: LanguageCode.en,
                            name: 'test promotion',
                            description: 'a test promotion',
                        },
                    ],
                    conditions: [
                        {
                            code: hasFacetValues.code,
                            arguments: [
                                { name: 'minimum', value: '2' },
                                { name: 'facets', value: `["T_1"]` },
                            ],
                        },
                    ],
                    actions: [
                        {
                            code: discountOnItemWithFacets.code,
                            arguments: [
                                { name: 'discount', value: '50' },
                                { name: 'facets', value: `["T_1"]` },
                            ],
                        },
                    ],
                },
            },
        );

        const ctx = await createCtx();
        const promotion = await server.app.get(PromotionService).findOne(ctx, 1);

        expect(promotion instanceof Promotion).toBe(true);
        assertCanBeSerialized(promotion);
    });

    it('serialize ShippingLine', async () => {
        const ctx = await createCtx();
        const shippingLine = await server.app
            .get(TransactionalConnection)
            .getEntityOrThrow(ctx, ShippingLine, 1);

        expect(shippingLine instanceof ShippingLine).toBe(true);
        assertCanBeSerialized(shippingLine);
    });

    it('serialize Order with nested ShippingMethod', async () => {
        const ctx = await createCtx();
        const order = await server.app
            .get(OrderService)
            .findOne(ctx, 1, ['lines', 'shippingLines.shippingMethod']);

        expect(order).not.toBeNull();
        expect(order instanceof Order).toBe(true);
        assertCanBeSerialized(order);
    });

    function assertCanBeSerialized(entity: any) {
        try {
            const json = JSON.stringify(entity);
        } catch (e: any) {
            fail(`Could not serialize entity: ${e.message as string}`);
        }
    }

    async function createCtx() {
        return server.app.get(RequestContextService).create({
            apiType: 'admin',
        });
    }
});
