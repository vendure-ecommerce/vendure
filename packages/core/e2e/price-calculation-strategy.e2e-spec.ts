import { DefaultSearchPlugin, mergeConfig } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import { TestPriceCalculationStrategy } from './fixtures/test-price-calculation-strategy';
import { AddItemToOrder, SearchProductsShop, SinglePrice } from './graphql/generated-e2e-shop-types';
import { ADD_ITEM_TO_ORDER, SEARCH_PRODUCTS_SHOP } from './graphql/shop-definitions';

describe('custom PriceCalculationStrategy', () => {
    let variants: SearchProductsShop.Items[];
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            customFields: {
                OrderLine: [{ name: 'giftWrap', type: 'boolean' }],
            },
            orderOptions: {
                priceCalculationStrategy: new TestPriceCalculationStrategy(),
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
        const { search } = await shopClient.query<SearchProductsShop.Query, SearchProductsShop.Variables>(
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

        const variantPrice = (variant0.price as SinglePrice).value as number;
        expect(addItemToOrder.lines[0].unitPrice).toEqual(variantPrice);
        expect(addItemToOrder.lines[1].unitPrice).toEqual(variantPrice + 500);
        expect(addItemToOrder.subTotalBeforeTax).toEqual(variantPrice + variantPrice + 500);
    });
});

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
            ... on Order {
                id
                subTotalBeforeTax
                subTotal
                shipping
                total
                lines {
                    id
                    quantity
                    unitPrice
                    unitPriceWithTax
                    items {
                        unitPrice
                        unitPriceWithTax
                        unitPriceIncludesTax
                    }
                }
            }
        }
    }
`;
