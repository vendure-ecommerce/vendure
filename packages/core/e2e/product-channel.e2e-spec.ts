/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    createErrorResultGuard,
    createTestEnvironment,
    E2E_DEFAULT_CHANNEL_TOKEN,
    ErrorResultGuard,
} from '@vendure/testing';
import { fail } from 'assert';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import {
    AssignProductsToChannelDocument,
    AssignProductVariantsToChannelDocument,
    ChannelFragment,
    CreateAdministratorDocument,
    CreateChannelDocument,
    CreateProductDocument,
    CreateProductMutation,
    CreateProductVariantsDocument,
    CreateRoleDocument,
    CreateRoleMutation,
    CurrencyCode,
    GetChannelsDocument,
    GetProductVariantListDocument,
    GetProductWithVariantsDocument,
    GetProductWithVariantsQuery,
    LanguageCode,
    Permission,
    ProductVariantFragment,
    RemoveProductsFromChannelDocument,
    RemoveProductVariantsFromChannelDocument,
    UpdateChannelDocument,
    UpdateProductDocument,
    UpdateProductVariantsDocument,
} from './graphql/generated-e2e-admin-types';
import { AddItemToOrderMutation, AddItemToOrderMutationVariables } from './graphql/generated-e2e-shop-types';
import { ADD_ITEM_TO_ORDER } from './graphql/shop-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('ChannelAware Products and ProductVariants', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(testConfig());
    const SECOND_CHANNEL_TOKEN = 'second_channel_token';
    const THIRD_CHANNEL_TOKEN = 'third_channel_token';
    let secondChannelAdminRole: CreateRoleMutation['createRole'];
    const orderResultGuard: ErrorResultGuard<{ lines: Array<{ id: string }> }> = createErrorResultGuard(
        input => !!input.lines,
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();

        await adminClient.query(CreateChannelDocument, {
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

        await adminClient.query(CreateChannelDocument, {
            input: {
                code: 'third-channel',
                token: THIRD_CHANNEL_TOKEN,
                defaultLanguageCode: LanguageCode.en,
                currencyCode: CurrencyCode.EUR,
                pricesIncludeTax: true,
                defaultShippingZoneId: 'T_1',
                defaultTaxZoneId: 'T_1',
            },
        });

        const { createRole } = await adminClient.query(CreateRoleDocument, {
            input: {
                description: 'second channel admin',
                code: 'second-channel-admin',
                channelIds: ['T_2'],
                permissions: [
                    Permission.ReadCatalog,
                    Permission.ReadSettings,
                    Permission.ReadAdministrator,
                    Permission.CreateAdministrator,
                    Permission.UpdateAdministrator,
                ],
            },
        });
        secondChannelAdminRole = createRole;

        await adminClient.query(CreateAdministratorDocument, {
            input: {
                firstName: 'Admin',
                lastName: 'Two',
                emailAddress: 'admin2@test.com',
                password: 'test',
                roleIds: [secondChannelAdminRole.id],
            },
        });
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('assigning Product to Channels', () => {
        let product1: NonNullable<GetProductWithVariantsQuery['product']>;

        beforeAll(async () => {
            await adminClient.asSuperAdmin();
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);

            const { product } = await adminClient.query(GetProductWithVariantsDocument, {
                id: 'T_1',
            });
            product1 = product!;
        });

        it(
            'throws if attempting to assign Product to channel to which the admin has no access',
            assertThrowsWithMessage(async () => {
                await adminClient.asUserWithCredentials('admin2@test.com', 'test');
                await adminClient.query(AssignProductsToChannelDocument, {
                    input: {
                        channelId: 'T_3',
                        productIds: [product1.id],
                    },
                });
            }, 'You are not currently authorized to perform this action'),
        );

        it('assigns Product to Channel and applies price factor', async () => {
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const PRICE_FACTOR = 0.5;
            await adminClient.asSuperAdmin();
            const { assignProductsToChannel } = await adminClient.query(AssignProductsToChannelDocument, {
                input: {
                    channelId: 'T_2',
                    productIds: [product1.id],
                    priceFactor: PRICE_FACTOR,
                },
            });

            expect(assignProductsToChannel[0].channels.map(c => c.id).sort()).toEqual(['T_1', 'T_2']);
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { product } = await adminClient.query(GetProductWithVariantsDocument, {
                id: product1.id,
            });

            expect(product!.variants.map(v => v.price)).toEqual(
                product1.variants.map(v => Math.round(v.price * PRICE_FACTOR)),
            );
            // Second Channel is configured to include taxes in price, so they should be the same.
            expect(product!.variants.map(v => v.priceWithTax)).toEqual(
                product1.variants.map(v => Math.round(v.priceWithTax * PRICE_FACTOR)),
            );
            // Second Channel has the default currency of GBP, so the prices should be the same.
            expect(product!.variants.map(v => v.currencyCode)).toEqual(['GBP', 'GBP', 'GBP', 'GBP']);
        });

        it('ProductVariant.channels includes all Channels from default Channel', async () => {
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { product } = await adminClient.query(GetProductWithVariantsDocument, {
                id: product1.id,
            });

            expect(product?.variants[0].channels.map(c => c.id)).toEqual(['T_1', 'T_2']);
        });

        it('ProductVariant.channels includes only current Channel from non-default Channel', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { product } = await adminClient.query(GetProductWithVariantsDocument, {
                id: product1.id,
            });

            expect(product?.variants[0].channels.map(c => c.id)).toEqual(['T_2']);
        });

        it('does not assign Product to same channel twice', async () => {
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { assignProductsToChannel } = await adminClient.query(AssignProductsToChannelDocument, {
                input: {
                    channelId: 'T_2',
                    productIds: [product1.id],
                },
            });

            expect(assignProductsToChannel[0].channels.map(c => c.id).sort()).toEqual(['T_1', 'T_2']);
        });

        it(
            'throws if attempting to remove Product from default Channel',
            assertThrowsWithMessage(async () => {
                await adminClient.query(RemoveProductsFromChannelDocument, {
                    input: {
                        productIds: [product1.id],
                        channelId: 'T_1',
                    },
                });
            }, 'Items cannot be removed from the default Channel'),
        );

        it('removes Product from Channel', async () => {
            await adminClient.asSuperAdmin();
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { removeProductsFromChannel } = await adminClient.query(RemoveProductsFromChannelDocument, {
                input: {
                    productIds: [product1.id],
                    channelId: 'T_2',
                },
            });

            expect(removeProductsFromChannel[0].channels.map(c => c.id)).toEqual(['T_1']);
        });

        // https://github.com/vendure-ecommerce/vendure/issues/2716
        it('querying an Order with a variant that was since removed from the channel', async () => {
            await adminClient.query(AssignProductsToChannelDocument, {
                input: {
                    channelId: 'T_2',
                    productIds: [product1.id],
                    priceFactor: 1,
                },
            });

            // Create an order in the second channel with the variant just assigned
            shopClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrderMutation,
                AddItemToOrderMutationVariables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: product1.variants[0].id,
                quantity: 1,
            });
            orderResultGuard.assertSuccess(addItemToOrder);

            // Now remove that variant from the second channel
            await adminClient.query(RemoveProductsFromChannelDocument, {
                input: {
                    productIds: [product1.id],
                    channelId: 'T_2',
                },
            });

            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);

            // If no price fields are requested on the ProductVariant, then the query will
            // succeed even if the ProductVariant is no longer assigned to the channel.
            const GET_ORDER_WITHOUT_VARIANT_PRICE = `
            query GetOrderWithoutVariantPrice($id: ID!) {
              order(id: $id) {
                id
                lines {
                  id
                  linePrice
                  productVariant {
                    id
                    name
                  }
                }
              }
            }`;
            const { order } = await adminClient.query(gql(GET_ORDER_WITHOUT_VARIANT_PRICE), {
                id: addItemToOrder.id,
            });

            expect(order).toEqual({
                id: 'T_1',
                lines: [
                    {
                        id: 'T_1',
                        linePrice: 129900,
                        productVariant: {
                            id: 'T_1',
                            name: 'Laptop 13 inch 8GB',
                        },
                    },
                ],
            });

            try {
                // The API will only throw if one of the price fields is requested in the query
                const GET_ORDER_WITH_VARIANT_PRICE = `
                query GetOrderWithVariantPrice($id: ID!) {
                  order(id: $id) {
                    id
                    lines {
                      id
                      linePrice
                      productVariant {
                        id
                        name
                        price
                      }
                    }
                  }
                }`;
                await adminClient.query(gql(GET_ORDER_WITH_VARIANT_PRICE), {
                    id: addItemToOrder.id,
                });
                fail(`Should have thrown`);
            } catch (e: any) {
                expect(e.message).toContain(
                    'No price information was found for ProductVariant ID "1" in the Channel "second-channel"',
                );
            }
        });
    });

    describe('assigning ProductVariant to Channels', () => {
        let product1: NonNullable<GetProductWithVariantsQuery['product']>;

        beforeAll(async () => {
            await adminClient.asSuperAdmin();
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);

            const { product } = await adminClient.query(GetProductWithVariantsDocument, {
                id: 'T_2',
            });
            product1 = product!;
        });

        it(
            'throws if attempting to assign ProductVariant to channel to which the admin has no access',
            assertThrowsWithMessage(async () => {
                await adminClient.asUserWithCredentials('admin2@test.com', 'test');
                await adminClient.query(AssignProductVariantsToChannelDocument, {
                    input: {
                        channelId: 'T_3',
                        productVariantIds: [product1.variants[0].id],
                    },
                });
            }, 'You are not currently authorized to perform this action'),
        );

        it('assigns ProductVariant to Channel and applies price factor', async () => {
            const PRICE_FACTOR = 0.5;
            await adminClient.asSuperAdmin();
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { assignProductVariantsToChannel } = await adminClient.query(
                AssignProductVariantsToChannelDocument,
                {
                    input: {
                        channelId: 'T_3',
                        productVariantIds: [product1.variants[0].id],
                        priceFactor: PRICE_FACTOR,
                    },
                },
            );

            expect(assignProductVariantsToChannel[0].channels.map(c => c.id).sort()).toEqual(['T_1', 'T_3']);
            adminClient.setChannelToken(THIRD_CHANNEL_TOKEN);
            const { product } = await adminClient.query(GetProductWithVariantsDocument, {
                id: product1.id,
            });
            expect(product!.channels.map(c => c.id).sort()).toEqual(['T_3']);
            // Third Channel is configured to include taxes in price, so they should be the same.
            expect(product!.variants.map(v => v.priceWithTax)).toEqual([
                Math.round(product1.variants[0].priceWithTax * PRICE_FACTOR),
            ]);

            // Third Channel has the default currency EUR
            expect(product!.variants.map(v => v.currencyCode)).toEqual(['EUR']);

            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { product: check } = await adminClient.query(GetProductWithVariantsDocument, {
                id: product1.id,
            });

            // from the default channel, all channels are visible
            expect(check?.channels.map(c => c.id).sort()).toEqual(['T_1', 'T_3']);
            expect(check?.variants[0].channels.map(c => c.id).sort()).toEqual(['T_1', 'T_3']);
            expect(check?.variants[1].channels.map(c => c.id).sort()).toEqual(['T_1']);
        });

        it('does not assign ProductVariant to same channel twice', async () => {
            await adminClient.asSuperAdmin();
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { assignProductVariantsToChannel } = await adminClient.query(
                AssignProductVariantsToChannelDocument,
                {
                    input: {
                        channelId: 'T_3',
                        productVariantIds: [product1.variants[0].id],
                    },
                },
            );
            expect(assignProductVariantsToChannel[0].channels.map(c => c.id).sort()).toEqual(['T_1', 'T_3']);
        });

        it(
            'throws if attempting to remove ProductVariant from default Channel',
            assertThrowsWithMessage(async () => {
                await adminClient.query(RemoveProductVariantsFromChannelDocument, {
                    input: {
                        productVariantIds: [product1.variants[0].id],
                        channelId: 'T_1',
                    },
                });
            }, 'Items cannot be removed from the default Channel'),
        );

        it('removes ProductVariant but not Product from Channel', async () => {
            await adminClient.asSuperAdmin();
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { assignProductVariantsToChannel } = await adminClient.query(
                AssignProductVariantsToChannelDocument,
                {
                    input: {
                        channelId: 'T_3',
                        productVariantIds: [product1.variants[1].id],
                    },
                },
            );
            expect(assignProductVariantsToChannel[0].channels.map(c => c.id).sort()).toEqual(['T_1', 'T_3']);

            const { removeProductVariantsFromChannel } = await adminClient.query(
                RemoveProductVariantsFromChannelDocument,
                {
                    input: {
                        productVariantIds: [product1.variants[1].id],
                        channelId: 'T_3',
                    },
                },
            );
            expect(removeProductVariantsFromChannel[0].channels.map(c => c.id)).toEqual(['T_1']);

            const { product } = await adminClient.query(GetProductWithVariantsDocument, {
                id: product1.id,
            });
            expect(product!.channels.map(c => c.id).sort()).toEqual(['T_1', 'T_3']);
        });

        it('removes ProductVariant and Product from Channel', async () => {
            await adminClient.asSuperAdmin();
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { removeProductVariantsFromChannel } = await adminClient.query(
                RemoveProductVariantsFromChannelDocument,
                {
                    input: {
                        productVariantIds: [product1.variants[0].id],
                        channelId: 'T_3',
                    },
                },
            );

            expect(removeProductVariantsFromChannel[0].channels.map(c => c.id)).toEqual(['T_1']);

            const { product } = await adminClient.query(GetProductWithVariantsDocument, {
                id: product1.id,
            });
            expect(product!.channels.map(c => c.id).sort()).toEqual(['T_1']);
        });
    });

    describe('creating Product in sub-channel', () => {
        let createdProduct: CreateProductMutation['createProduct'];
        let createdVariant: ProductVariantFragment;

        it('creates a Product in sub-channel', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);

            const { createProduct } = await adminClient.query(CreateProductDocument, {
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
            const { createProductVariants } = await adminClient.query(CreateProductVariantsDocument, {
                input: [
                    {
                        productId: createProduct.id,
                        sku: 'PV1',
                        optionIds: [],
                        translations: [{ languageCode: LanguageCode.en, name: 'Variant 1' }],
                    },
                ],
            });

            createdProduct = createProduct;
            createdVariant = createProductVariants[0]!;

            // from sub-channel, only that channel is visible
            expect(createdProduct.channels.map(c => c.id).sort()).toEqual(['T_2']);
            expect(createdVariant.channels.map(c => c.id).sort()).toEqual(['T_2']);

            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);

            const { product } = await adminClient.query(GetProductWithVariantsDocument, {
                id: createProduct.id,
            });

            // from the default channel, all channels are visible
            expect(product?.channels.map(c => c.id).sort()).toEqual(['T_1', 'T_2']);
            expect(product?.variants[0].channels.map(c => c.id).sort()).toEqual(['T_1', 'T_2']);
        });
    });

    describe('updating Product in sub-channel', () => {
        it(
            'throws if attempting to update a Product which is not assigned to that Channel',
            assertThrowsWithMessage(async () => {
                adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
                await adminClient.query(UpdateProductDocument, {
                    input: {
                        id: 'T_2',
                        translations: [{ languageCode: LanguageCode.en, name: 'xyz' }],
                    },
                });
            }, 'No Product with the id "2" could be found'),
        );
    });

    describe('updating channel defaultCurrencyCode', () => {
        let secondChannelId: string;
        const channelGuard: ErrorResultGuard<ChannelFragment> = createErrorResultGuard(input => !!input.id);

        beforeAll(async () => {
            const { channels } = await adminClient.query(GetChannelsDocument);
            secondChannelId = channels.items.find(c => c.token === SECOND_CHANNEL_TOKEN)!.id;
        });

        it('updates variant prices from old default to new', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { productVariants } = await adminClient.query(GetProductVariantListDocument, {});

            expect(productVariants.items.map(i => i.currencyCode)).toEqual(['GBP']);

            const { updateChannel } = await adminClient.query(UpdateChannelDocument, {
                input: {
                    id: secondChannelId,
                    availableCurrencyCodes: [CurrencyCode.MYR, CurrencyCode.GBP, CurrencyCode.EUR],
                    defaultCurrencyCode: CurrencyCode.MYR,
                },
            });

            channelGuard.assertSuccess(updateChannel);
            expect(updateChannel.defaultCurrencyCode).toBe(CurrencyCode.MYR);

            const { productVariants: variantsAfter } = await adminClient.query(
                GetProductVariantListDocument,
                {},
            );

            expect(variantsAfter.items.map(i => i.currencyCode)).toEqual(['MYR']);
        });

        it('does not change prices in other currencies', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { productVariants } = await adminClient.query(GetProductVariantListDocument, {});

            const { updateProductVariants } = await adminClient.query(UpdateProductVariantsDocument, {
                input: productVariants.items.map(i => ({
                    id: i.id,
                    prices: [
                        { price: 100, currencyCode: CurrencyCode.GBP },
                        { price: 200, currencyCode: CurrencyCode.MYR },
                        { price: 300, currencyCode: CurrencyCode.EUR },
                    ],
                })),
            });

            expect(updateProductVariants[0]?.prices.sort((a, b) => a.price - b.price)).toEqual([
                { currencyCode: 'GBP', price: 100 },
                { currencyCode: 'MYR', price: 200 },
                { currencyCode: 'EUR', price: 300 },
            ]);
            expect(updateProductVariants[0]?.currencyCode).toBe('MYR');

            await adminClient.query(UpdateChannelDocument, {
                input: {
                    id: secondChannelId,
                    availableCurrencyCodes: [
                        CurrencyCode.MYR,
                        CurrencyCode.GBP,
                        CurrencyCode.EUR,
                        CurrencyCode.AUD,
                    ],
                    defaultCurrencyCode: CurrencyCode.AUD,
                },
            });

            const { productVariants: after } = await adminClient.query(GetProductVariantListDocument, {});

            expect(after.items.map(i => i.currencyCode)).toEqual(['AUD']);
            expect(after.items[0]?.prices.sort((a, b) => a.price - b.price)).toEqual([
                { currencyCode: 'GBP', price: 100 },
                { currencyCode: 'AUD', price: 200 },
                { currencyCode: 'EUR', price: 300 },
            ]);
        });

        // https://github.com/vendure-ecommerce/vendure/issues/2391
        it('does not duplicate an existing price', async () => {
            await adminClient.query(UpdateChannelDocument, {
                input: {
                    id: secondChannelId,
                    defaultCurrencyCode: CurrencyCode.GBP,
                },
            });

            const { productVariants: after } = await adminClient.query(GetProductVariantListDocument, {});

            expect(after.items.map(i => i.currencyCode)).toEqual(['GBP']);
            expect(after.items[0]?.prices.sort((a, b) => a.price - b.price)).toEqual([
                { currencyCode: 'GBP', price: 100 },
                { currencyCode: 'AUD', price: 200 },
                { currencyCode: 'EUR', price: 300 },
            ]);
        });
    });
});
