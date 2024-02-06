/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import * as Codegen from './graphql/generated-e2e-admin-types';
import {
    CreateProductDocument,
    CreateProductVariantsDocument,
    CurrencyCode,
    GetProductWithVariantsDocument,
    LanguageCode,
    UpdateChannelDocument,
    UpdateProductVariantsDocument,
} from './graphql/generated-e2e-admin-types';
import {
    AddItemToOrderDocument,
    AdjustItemQuantityDocument,
    GetActiveOrderDocument,
    TestOrderFragmentFragment,
    UpdatedOrderFragment,
} from './graphql/generated-e2e-shop-types';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('Product prices', () => {
    const { server, adminClient, shopClient } = createTestEnvironment({ ...testConfig() });

    let multiPriceProduct: Codegen.CreateProductMutation['createProduct'];
    let multiPriceVariant: NonNullable<
        Codegen.CreateProductVariantsMutation['createProductVariants'][number]
    >;

    const orderResultGuard: ErrorResultGuard<TestOrderFragmentFragment | UpdatedOrderFragment> =
        createErrorResultGuard(input => !!input.lines);

    beforeAll(async () => {
        await server.init({
            initialData,
            customerCount: 1,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
        });
        await adminClient.asSuperAdmin();
        await adminClient.query(UpdateChannelDocument, {
            input: {
                id: 'T_1',
                availableCurrencyCodes: [CurrencyCode.USD, CurrencyCode.GBP, CurrencyCode.EUR],
            },
        });
        const { createProduct } = await adminClient.query(CreateProductDocument, {
            input: {
                translations: [
                    {
                        languageCode: LanguageCode.en,
                        name: 'Cactus',
                        slug: 'cactus',
                        description: 'A prickly plant',
                    },
                ],
            },
        });
        multiPriceProduct = createProduct;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('create ProductVariant creates price in Channel default currency', async () => {
        const { createProductVariants } = await adminClient.query(CreateProductVariantsDocument, {
            input: [
                {
                    productId: multiPriceProduct.id,
                    sku: 'CACTUS-1',
                    optionIds: [],
                    translations: [{ languageCode: LanguageCode.de, name: 'Cactus' }],
                    price: 1000,
                },
            ],
        });

        expect(createProductVariants.length).toBe(1);
        expect(createProductVariants[0]?.prices).toEqual([
            {
                currencyCode: CurrencyCode.USD,
                price: 1000,
            },
        ]);
        multiPriceVariant = createProductVariants[0]!;
    });

    it(
        'updating ProductVariant with price in unavailable currency throws',
        assertThrowsWithMessage(async () => {
            await adminClient.query(UpdateProductVariantsDocument, {
                input: {
                    id: multiPriceVariant.id,
                    prices: [
                        {
                            currencyCode: CurrencyCode.JPY,
                            price: 100000,
                        },
                    ],
                },
            });
        }, 'The currency "JPY" is not available in the current Channel'),
    );

    it('updates ProductVariant with multiple prices', async () => {
        await adminClient.query(UpdateProductVariantsDocument, {
            input: {
                id: multiPriceVariant.id,
                prices: [
                    { currencyCode: CurrencyCode.USD, price: 1200 },
                    { currencyCode: CurrencyCode.GBP, price: 900 },
                    { currencyCode: CurrencyCode.EUR, price: 1100 },
                ],
            },
        });

        const { product } = await adminClient.query(GetProductWithVariantsDocument, {
            id: multiPriceProduct.id,
        });

        expect(product?.variants[0]?.prices.sort((a, b) => a.price - b.price)).toEqual([
            { currencyCode: CurrencyCode.GBP, price: 900 },
            { currencyCode: CurrencyCode.EUR, price: 1100 },
            { currencyCode: CurrencyCode.USD, price: 1200 },
        ]);
    });

    it('deletes a price in a non-default currency', async () => {
        await adminClient.query(UpdateProductVariantsDocument, {
            input: {
                id: multiPriceVariant.id,
                prices: [{ currencyCode: CurrencyCode.EUR, price: 1100, delete: true }],
            },
        });

        const { product } = await adminClient.query(GetProductWithVariantsDocument, {
            id: multiPriceProduct.id,
        });

        expect(product?.variants[0]?.prices.sort((a, b) => a.price - b.price)).toEqual([
            { currencyCode: CurrencyCode.GBP, price: 900 },
            { currencyCode: CurrencyCode.USD, price: 1200 },
        ]);
    });

    describe('DefaultProductVariantPriceSelectionStrategy', () => {
        it('defaults to default Channel currency', async () => {
            const { product } = await adminClient.query(GetProductWithVariantsDocument, {
                id: multiPriceProduct.id,
            });

            expect(product?.variants[0]?.price).toEqual(1200);
            expect(product?.variants[0]?.priceWithTax).toEqual(1200 * 1.2);
            expect(product?.variants[0]?.currencyCode).toEqual(CurrencyCode.USD);
        });

        it('uses query string to select currency', async () => {
            const { product } = await adminClient.query(
                GetProductWithVariantsDocument,
                {
                    id: multiPriceProduct.id,
                },
                { currencyCode: 'GBP' },
            );

            expect(product?.variants[0]?.price).toEqual(900);
            expect(product?.variants[0]?.priceWithTax).toEqual(900 * 1.2);
            expect(product?.variants[0]?.currencyCode).toEqual(CurrencyCode.GBP);
        });

        it(
            'throws if unrecognised currency code passed in query string',
            assertThrowsWithMessage(async () => {
                await adminClient.query(
                    GetProductWithVariantsDocument,
                    {
                        id: multiPriceProduct.id,
                    },
                    { currencyCode: 'JPY' },
                );
            }, 'The currency "JPY" is not available in the current Channel'),
        );
    });

    describe('changing Order currencyCode', () => {
        beforeAll(async () => {
            await adminClient.query(UpdateProductVariantsDocument, {
                input: [
                    {
                        id: 'T_1',
                        prices: [
                            { currencyCode: CurrencyCode.USD, price: 1000 },
                            { currencyCode: CurrencyCode.GBP, price: 900 },
                            { currencyCode: CurrencyCode.EUR, price: 1100 },
                        ],
                    },
                    {
                        id: 'T_2',
                        prices: [
                            { currencyCode: CurrencyCode.USD, price: 2000 },
                            { currencyCode: CurrencyCode.GBP, price: 1900 },
                            { currencyCode: CurrencyCode.EUR, price: 2100 },
                        ],
                    },
                    {
                        id: 'T_3',
                        prices: [
                            { currencyCode: CurrencyCode.USD, price: 3000 },
                            { currencyCode: CurrencyCode.GBP, price: 2900 },
                            { currencyCode: CurrencyCode.EUR, price: 3100 },
                        ],
                    },
                ],
            });
        });

        it('create order in default currency', async () => {
            await shopClient.query(AddItemToOrderDocument, {
                productVariantId: 'T_1',
                quantity: 1,
            });
            await shopClient.query(AddItemToOrderDocument, {
                productVariantId: 'T_2',
                quantity: 1,
            });

            const { activeOrder } = await shopClient.query(GetActiveOrderDocument);

            expect(activeOrder?.lines[0]?.unitPrice).toBe(1000);
            expect(activeOrder?.lines[0]?.unitPriceWithTax).toBe(1200);
            expect(activeOrder?.lines[1]?.unitPrice).toBe(2000);
            expect(activeOrder?.lines[1]?.unitPriceWithTax).toBe(2400);
            expect(activeOrder?.currencyCode).toBe(CurrencyCode.USD);
        });

        it(
            'updating an order in an unsupported currency throws',
            assertThrowsWithMessage(async () => {
                await shopClient.query(
                    AddItemToOrderDocument,
                    {
                        productVariantId: 'T_1',
                        quantity: 1,
                    },
                    { currencyCode: 'JPY' },
                );
            }, 'The currency "JPY" is not available in the current Channel'),
        );

        it('updating an order line with a new currency updates all lines to that currency', async () => {
            const { activeOrder } = await shopClient.query(GetActiveOrderDocument);
            const { adjustOrderLine } = await shopClient.query(
                AdjustItemQuantityDocument,
                {
                    orderLineId: activeOrder!.lines[0]?.id,
                    quantity: 2,
                },
                { currencyCode: 'GBP' },
            );

            orderResultGuard.assertSuccess(adjustOrderLine);

            expect(adjustOrderLine?.lines[0]?.unitPrice).toBe(900);
            expect(adjustOrderLine?.lines[0]?.unitPriceWithTax).toBe(1080);
            expect(adjustOrderLine?.lines[1]?.unitPrice).toBe(1900);
            expect(adjustOrderLine?.lines[1]?.unitPriceWithTax).toBe(2280);
            expect(adjustOrderLine.currencyCode).toBe('GBP');
        });

        it('adding a new order line with a new currency updates all lines to that currency', async () => {
            const { addItemToOrder } = await shopClient.query(
                AddItemToOrderDocument,
                {
                    productVariantId: 'T_3',
                    quantity: 1,
                },
                { currencyCode: 'EUR' },
            );

            orderResultGuard.assertSuccess(addItemToOrder);

            expect(addItemToOrder?.lines[0]?.unitPrice).toBe(1100);
            expect(addItemToOrder?.lines[0]?.unitPriceWithTax).toBe(1320);
            expect(addItemToOrder?.lines[1]?.unitPrice).toBe(2100);
            expect(addItemToOrder?.lines[1]?.unitPriceWithTax).toBe(2520);
            expect(addItemToOrder?.lines[2]?.unitPrice).toBe(3100);
            expect(addItemToOrder?.lines[2]?.unitPriceWithTax).toBe(3720);
            expect(addItemToOrder.currencyCode).toBe('EUR');
        });
    });
});
