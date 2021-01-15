/* tslint:disable:no-non-null-assertion */
import { createTestEnvironment, E2E_DEFAULT_CHANNEL_TOKEN } from '@vendure/testing';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import {
    AssignProductsToChannel,
    AssignProductVariantsToChannel,
    CreateAdministrator,
    CreateChannel,
    CreateProduct,
    CreateProductVariants,
    CreateRole,
    CurrencyCode,
    GetProductWithVariants,
    LanguageCode,
    Permission,
    ProductVariantFragment,
    RemoveProductsFromChannel,
    RemoveProductVariantsFromChannel,
} from './graphql/generated-e2e-admin-types';
import {
    ASSIGN_PRODUCTVARIANT_TO_CHANNEL,
    ASSIGN_PRODUCT_TO_CHANNEL,
    CREATE_ADMINISTRATOR,
    CREATE_CHANNEL,
    CREATE_PRODUCT,
    CREATE_PRODUCT_VARIANTS,
    CREATE_ROLE,
    GET_PRODUCT_WITH_VARIANTS,
    REMOVE_PRODUCTVARIANT_FROM_CHANNEL,
    REMOVE_PRODUCT_FROM_CHANNEL,
} from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('ChannelAware Products and ProductVariants', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(testConfig);
    const SECOND_CHANNEL_TOKEN = 'second_channel_token';
    const THIRD_CHANNEL_TOKEN = 'third_channel_token';
    let secondChannelAdminRole: CreateRole.CreateRole;

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();

        await adminClient.query<CreateChannel.Mutation, CreateChannel.Variables>(CREATE_CHANNEL, {
            input: {
                code: 'second-channel',
                token: SECOND_CHANNEL_TOKEN,
                defaultLanguageCode: LanguageCode.en,
                currencyCode: CurrencyCode.USD,
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
                currencyCode: CurrencyCode.USD,
                pricesIncludeTax: true,
                defaultShippingZoneId: 'T_1',
                defaultTaxZoneId: 'T_1',
            },
        });

        const { createRole } = await adminClient.query<CreateRole.Mutation, CreateRole.Variables>(
            CREATE_ROLE,
            {
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
            },
        );
        secondChannelAdminRole = createRole;

        await adminClient.query<CreateAdministrator.Mutation, CreateAdministrator.Variables>(
            CREATE_ADMINISTRATOR,
            {
                input: {
                    firstName: 'Admin',
                    lastName: 'Two',
                    emailAddress: 'admin2@test.com',
                    password: 'test',
                    roleIds: [secondChannelAdminRole.id],
                },
            },
        );
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('assigning Product to Channels', () => {
        let product1: GetProductWithVariants.Product;

        beforeAll(async () => {
            await adminClient.asSuperAdmin();
            await adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);

            const { product } = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: 'T_1',
            });
            product1 = product!;
        });

        it(
            'throws if attempting to assign Product to channel to which the admin has no access',
            assertThrowsWithMessage(async () => {
                await adminClient.asUserWithCredentials('admin2@test.com', 'test');
                await adminClient.query<AssignProductsToChannel.Mutation, AssignProductsToChannel.Variables>(
                    ASSIGN_PRODUCT_TO_CHANNEL,
                    {
                        input: {
                            channelId: 'T_3',
                            productIds: [product1.id],
                        },
                    },
                );
            }, 'You are not currently authorized to perform this action'),
        );

        it('assigns Product to Channel and applies price factor', async () => {
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const PRICE_FACTOR = 0.5;
            await adminClient.asSuperAdmin();
            const { assignProductsToChannel } = await adminClient.query<
                AssignProductsToChannel.Mutation,
                AssignProductsToChannel.Variables
            >(ASSIGN_PRODUCT_TO_CHANNEL, {
                input: {
                    channelId: 'T_2',
                    productIds: [product1.id],
                    priceFactor: PRICE_FACTOR,
                },
            });

            expect(assignProductsToChannel[0].channels.map(c => c.id).sort()).toEqual(['T_1', 'T_2']);
            await adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { product } = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: product1.id,
            });

            expect(product!.variants.map(v => v.price)).toEqual(
                product1.variants.map(v => Math.round((v.price * PRICE_FACTOR) / 1.2)),
            );
            // Second Channel is configured to include taxes in price, so they should be the same.
            expect(product!.variants.map(v => v.priceWithTax)).toEqual(
                product1.variants.map(v => Math.round((v.priceWithTax * PRICE_FACTOR) / 1.2)),
            );
        });

        it('ProductVariant.channels includes all Channels from default Channel', async () => {
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { product } = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: product1.id,
            });

            expect(product?.variants[0].channels.map(c => c.id)).toEqual(['T_1', 'T_2']);
        });

        it('ProductVariant.channels includes only current Channel from non-default Channel', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { product } = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: product1.id,
            });

            expect(product?.variants[0].channels.map(c => c.id)).toEqual(['T_2']);
        });

        it('does not assign Product to same channel twice', async () => {
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { assignProductsToChannel } = await adminClient.query<
                AssignProductsToChannel.Mutation,
                AssignProductsToChannel.Variables
            >(ASSIGN_PRODUCT_TO_CHANNEL, {
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
                await adminClient.query<
                    RemoveProductsFromChannel.Mutation,
                    RemoveProductsFromChannel.Variables
                >(REMOVE_PRODUCT_FROM_CHANNEL, {
                    input: {
                        productIds: [product1.id],
                        channelId: 'T_1',
                    },
                });
            }, 'Products cannot be removed from the default Channel'),
        );

        it('removes Product from Channel', async () => {
            await adminClient.asSuperAdmin();
            await adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { removeProductsFromChannel } = await adminClient.query<
                RemoveProductsFromChannel.Mutation,
                RemoveProductsFromChannel.Variables
            >(REMOVE_PRODUCT_FROM_CHANNEL, {
                input: {
                    productIds: [product1.id],
                    channelId: 'T_2',
                },
            });

            expect(removeProductsFromChannel[0].channels.map(c => c.id)).toEqual(['T_1']);
        });
    });

    describe('assigning ProductVariant to Channels', () => {
        let product1: GetProductWithVariants.Product;

        beforeAll(async () => {
            await adminClient.asSuperAdmin();
            await adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);

            const { product } = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: 'T_2',
            });
            product1 = product!;
        });

        it(
            'throws if attempting to assign ProductVariant to channel to which the admin has no access',
            assertThrowsWithMessage(async () => {
                await adminClient.asUserWithCredentials('admin2@test.com', 'test');
                await adminClient.query<
                    AssignProductVariantsToChannel.Mutation,
                    AssignProductVariantsToChannel.Variables
                >(ASSIGN_PRODUCTVARIANT_TO_CHANNEL, {
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
            await adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { assignProductVariantsToChannel } = await adminClient.query<
                AssignProductVariantsToChannel.Mutation,
                AssignProductVariantsToChannel.Variables
            >(ASSIGN_PRODUCTVARIANT_TO_CHANNEL, {
                input: {
                    channelId: 'T_3',
                    productVariantIds: [product1.variants[0].id],
                    priceFactor: PRICE_FACTOR,
                },
            });

            expect(assignProductVariantsToChannel[0].channels.map(c => c.id).sort()).toEqual(['T_1', 'T_3']);
            await adminClient.setChannelToken(THIRD_CHANNEL_TOKEN);
            const { product } = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: product1.id,
            });
            expect(product!.channels.map(c => c.id).sort()).toEqual(['T_3']);
            expect(product!.variants.map(v => v.price)).toEqual([
                Math.round((product1.variants[0].price * PRICE_FACTOR) / 1.2),
            ]);
            // Third Channel is configured to include taxes in price, so they should be the same.
            expect(product!.variants.map(v => v.priceWithTax)).toEqual([
                product1.variants[0].price * PRICE_FACTOR,
            ]);

            await adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { product: check } = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: product1.id,
            });

            // from the default channel, all channels are visible
            expect(check?.channels.map(c => c.id).sort()).toEqual(['T_1', 'T_3']);
            expect(check?.variants[0].channels.map(c => c.id).sort()).toEqual(['T_1', 'T_3']);
            expect(check?.variants[1].channels.map(c => c.id).sort()).toEqual(['T_1']);
        });

        it('does not assign ProductVariant to same channel twice', async () => {
            await adminClient.asSuperAdmin();
            await adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { assignProductVariantsToChannel } = await adminClient.query<
                AssignProductVariantsToChannel.Mutation,
                AssignProductVariantsToChannel.Variables
            >(ASSIGN_PRODUCTVARIANT_TO_CHANNEL, {
                input: {
                    channelId: 'T_3',
                    productVariantIds: [product1.variants[0].id],
                },
            });
            expect(assignProductVariantsToChannel[0].channels.map(c => c.id).sort()).toEqual(['T_1', 'T_3']);
        });

        it(
            'throws if attempting to remove ProductVariant from default Channel',
            assertThrowsWithMessage(async () => {
                await adminClient.query<
                    RemoveProductVariantsFromChannel.Mutation,
                    RemoveProductVariantsFromChannel.Variables
                >(REMOVE_PRODUCTVARIANT_FROM_CHANNEL, {
                    input: {
                        productVariantIds: [product1.variants[0].id],
                        channelId: 'T_1',
                    },
                });
            }, 'Products cannot be removed from the default Channel'),
        );

        it('removes ProductVariant but not Product from Channel', async () => {
            await adminClient.asSuperAdmin();
            await adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { assignProductVariantsToChannel } = await adminClient.query<
                AssignProductVariantsToChannel.Mutation,
                AssignProductVariantsToChannel.Variables
            >(ASSIGN_PRODUCTVARIANT_TO_CHANNEL, {
                input: {
                    channelId: 'T_3',
                    productVariantIds: [product1.variants[1].id],
                },
            });
            expect(assignProductVariantsToChannel[0].channels.map(c => c.id).sort()).toEqual(['T_1', 'T_3']);

            const { removeProductVariantsFromChannel } = await adminClient.query<
                RemoveProductVariantsFromChannel.Mutation,
                RemoveProductVariantsFromChannel.Variables
            >(REMOVE_PRODUCTVARIANT_FROM_CHANNEL, {
                input: {
                    productVariantIds: [product1.variants[1].id],
                    channelId: 'T_3',
                },
            });
            expect(removeProductVariantsFromChannel[0].channels.map(c => c.id)).toEqual(['T_1']);

            const { product } = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: product1.id,
            });
            expect(product!.channels.map(c => c.id).sort()).toEqual(['T_1', 'T_3']);
        });

        it('removes ProductVariant and Product from Channel', async () => {
            await adminClient.asSuperAdmin();
            await adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { removeProductVariantsFromChannel } = await adminClient.query<
                RemoveProductVariantsFromChannel.Mutation,
                RemoveProductVariantsFromChannel.Variables
            >(REMOVE_PRODUCTVARIANT_FROM_CHANNEL, {
                input: {
                    productVariantIds: [product1.variants[0].id],
                    channelId: 'T_3',
                },
            });

            expect(removeProductVariantsFromChannel[0].channels.map(c => c.id)).toEqual(['T_1']);

            const { product } = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: product1.id,
            });
            expect(product!.channels.map(c => c.id).sort()).toEqual(['T_1']);
        });
    });

    describe('creating Product in sub-channel', () => {
        let createdProduct: CreateProduct.CreateProduct;
        let createdVariant: ProductVariantFragment;

        it('creates a Product in sub-channel', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);

            const { createProduct } = await adminClient.query<
                CreateProduct.Mutation,
                CreateProduct.Variables
            >(CREATE_PRODUCT, {
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
            const { createProductVariants } = await adminClient.query<
                CreateProductVariants.Mutation,
                CreateProductVariants.Variables
            >(CREATE_PRODUCT_VARIANTS, {
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

            const { product } = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: createProduct.id,
            });

            // from the default channel, all channels are visible
            expect(product?.channels.map(c => c.id).sort()).toEqual(['T_1', 'T_2']);
            expect(product?.variants[0].channels.map(c => c.id).sort()).toEqual(['T_1', 'T_2']);
        });
    });
});
