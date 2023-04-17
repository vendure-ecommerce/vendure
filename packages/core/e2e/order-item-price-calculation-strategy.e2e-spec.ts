import { DefaultSearchPlugin, JobQueueService, mergeConfig } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { TestOrderItemPriceCalculationStrategy } from './fixtures/test-order-item-price-calculation-strategy';
import {
    AddItemToOrderMutation,
    AddItemToOrderMutationVariables,
    SearchProductsShopQuery,
    SearchProductsShopQueryVariables,
    SinglePrice,
} from './graphql/generated-e2e-shop-types';
import { ADD_ITEM_TO_ORDER, SEARCH_PRODUCTS_SHOP } from './graphql/shop-definitions';

describe('custom OrderItemPriceCalculationStrategy', () => {
    let variants: SearchProductsShopQuery['search']['items'];
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            customFields: {
                OrderLine: [{ name: 'giftWrap', type: 'boolean' }],
            },
            orderOptions: {
                orderItemPriceCalculationStrategy: new TestOrderItemPriceCalculationStrategy(),
            },
            plugins: [DefaultSearchPlugin],
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 3,
        });
        const { search } = await shopClient.query<SearchProductsShopQuery, SearchProductsShopQueryVariables>(
            SEARCH_PRODUCTS_SHOP,
            {
                input: { take: 3, groupByProduct: false },
            },
        );
        variants = search.items;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    let secondOrderLineId: string;

    it('does not add surcharge', async () => {
        const variant0 = variants[0];

        const { addItemToOrder } = await shopClient.query(ADD_ITEM_TO_ORDER_CUSTOM_FIELDS, {
            productVariantId: variant0.productVariantId,
            quantity: 1,
            customFields: {
                giftWrap: false,
            },
        });

        expect(addItemToOrder.lines[0].unitPrice).toEqual((variant0.price as SinglePrice).value);
    });

    it('adds a surcharge', async () => {
        const variant0 = variants[0];

        const { addItemToOrder } = await shopClient.query(ADD_ITEM_TO_ORDER_CUSTOM_FIELDS, {
            productVariantId: variant0.productVariantId,
            quantity: 1,
            customFields: {
                giftWrap: true,
            },
        });

        const variantPrice = (variant0.price as SinglePrice).value;
        expect(addItemToOrder.lines[0].unitPrice).toEqual(variantPrice);
        expect(addItemToOrder.lines[1].unitPrice).toEqual(variantPrice + 500);
        expect(addItemToOrder.subTotal).toEqual(variantPrice + variantPrice + 500);
        secondOrderLineId = addItemToOrder.lines[1].id;
    });

    it('re-calculates when customFields changes', async () => {
        const { adjustOrderLine } = await shopClient.query(ADJUST_ORDER_LINE_CUSTOM_FIELDS, {
            orderLineId: secondOrderLineId,
            quantity: 1,
            customFields: {
                giftWrap: false,
            },
        });

        const variantPrice = (variants[0].price as SinglePrice).value;
        expect(adjustOrderLine.lines[0].unitPrice).toEqual(variantPrice);
        expect(adjustOrderLine.lines[1].unitPrice).toEqual(variantPrice);
        expect(adjustOrderLine.subTotal).toEqual(variantPrice + variantPrice);
    });

    it('applies discount for quantity greater than 3', async () => {
        const { adjustOrderLine } = await shopClient.query(ADJUST_ORDER_LINE_CUSTOM_FIELDS, {
            orderLineId: secondOrderLineId,
            quantity: 4,
            customFields: {
                giftWrap: false,
            },
        });

        const variantPrice = (variants[0].price as SinglePrice).value;
        expect(adjustOrderLine.lines[1].unitPrice).toEqual(variantPrice / 2);
        expect(adjustOrderLine.subTotal).toEqual(variantPrice + (variantPrice / 2) * 4);
    });
});

const ORDER_WITH_LINES_AND_ITEMS_FRAGMENT = gql`
    fragment OrderWithLinesAndItems on Order {
        id
        subTotal
        subTotalWithTax
        shipping
        total
        totalWithTax
        lines {
            id
            quantity
            unitPrice
            unitPriceWithTax
        }
    }
`;

const ADD_ITEM_TO_ORDER_CUSTOM_FIELDS = gql`
    mutation AddItemToOrderCustomFields(
        $productVariantId: ID!
        $quantity: Int!
        $customFields: OrderLineCustomFieldsInput
    ) {
        addItemToOrder(
            productVariantId: $productVariantId
            quantity: $quantity
            customFields: $customFields
        ) {
            ...OrderWithLinesAndItems
        }
    }
    ${ORDER_WITH_LINES_AND_ITEMS_FRAGMENT}
`;

const ADJUST_ORDER_LINE_CUSTOM_FIELDS = gql`
    mutation AdjustOrderLineCustomFields(
        $orderLineId: ID!
        $quantity: Int!
        $customFields: OrderLineCustomFieldsInput
    ) {
        adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity, customFields: $customFields) {
            ...OrderWithLinesAndItems
        }
    }
    ${ORDER_WITH_LINES_AND_ITEMS_FRAGMENT}
`;
