import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';
import { omit } from '../../common/lib/omit';

import { PRODUCT_OPTION_GROUP_FRAGMENT } from './graphql/fragments';
import * as Codegen from './graphql/generated-e2e-admin-types';
import {
    AssignProductOptionGroupsToChannelInput,
    ChannelFragment,
    CurrencyCode,
    DeletionResult,
    LanguageCode,
    ProductOptionGroup,
    RemoveProductOptionGroupsFromChannelInput,
} from './graphql/generated-e2e-admin-types';
import {
    ADD_OPTION_GROUP_TO_PRODUCT,
    ASSIGN_PRODUCT_TO_CHANNEL,
    CREATE_CHANNEL,
    CREATE_PRODUCT,
    CREATE_PRODUCT_OPTION_GROUP,
    CREATE_PRODUCT_VARIANTS,
    DELETE_PRODUCT_VARIANT,
} from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

/* eslint-disable @typescript-eslint/no-non-null-assertion */

describe('ProductOption resolver', () => {
    const { server, adminClient } = createTestEnvironment(testConfig());
    let sizeGroup: Codegen.ProductOptionGroupFragment;
    let mediumOption: Codegen.CreateProductOptionMutation['createProductOption'];

    beforeAll(async () => {
        await server.init({
            initialData,
            customerCount: 1,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('createProductOptionGroup', async () => {
        const { createProductOptionGroup } = await adminClient.query<
            Codegen.CreateProductOptionGroupMutation,
            Codegen.CreateProductOptionGroupMutationVariables
        >(CREATE_PRODUCT_OPTION_GROUP, {
            input: {
                code: 'size',
                translations: [
                    { languageCode: LanguageCode.en, name: 'Size' },
                    { languageCode: LanguageCode.de, name: 'Größe' },
                ],
                options: [
                    {
                        code: 'small',
                        translations: [
                            { languageCode: LanguageCode.en, name: 'Small' },
                            { languageCode: LanguageCode.de, name: 'Klein' },
                        ],
                    },
                    {
                        code: 'large',
                        translations: [
                            { languageCode: LanguageCode.en, name: 'Large' },
                            { languageCode: LanguageCode.de, name: 'Groß' },
                        ],
                    },
                ],
            },
        });

        expect(omit(createProductOptionGroup, ['options', 'translations'])).toEqual({
            id: 'T_3',
            name: 'Size',
            code: 'size',
        });
        sizeGroup = createProductOptionGroup;
    });

    it('updateProductOptionGroup', async () => {
        const { updateProductOptionGroup } = await adminClient.query<
            Codegen.UpdateProductOptionGroupMutation,
            Codegen.UpdateProductOptionGroupMutationVariables
        >(UPDATE_PRODUCT_OPTION_GROUP, {
            input: {
                id: sizeGroup.id,
                translations: [
                    { id: sizeGroup.translations[0].id, languageCode: LanguageCode.en, name: 'Bigness' },
                ],
            },
        });

        expect(updateProductOptionGroup.name).toBe('Bigness');
    });

    it(
        'createProductOption throws with invalid productOptionGroupId',
        assertThrowsWithMessage(async () => {
            const { createProductOption } = await adminClient.query<
                Codegen.CreateProductOptionMutation,
                Codegen.CreateProductOptionMutationVariables
            >(CREATE_PRODUCT_OPTION, {
                input: {
                    productOptionGroupId: 'T_999',
                    code: 'medium',
                    translations: [
                        { languageCode: LanguageCode.en, name: 'Medium' },
                        { languageCode: LanguageCode.de, name: 'Mittel' },
                    ],
                },
            });
        }, 'No ProductOptionGroup with the id "999" could be found'),
    );

    it('createProductOption', async () => {
        const { createProductOption } = await adminClient.query<
            Codegen.CreateProductOptionMutation,
            Codegen.CreateProductOptionMutationVariables
        >(CREATE_PRODUCT_OPTION, {
            input: {
                productOptionGroupId: sizeGroup.id,
                code: 'medium',
                translations: [
                    { languageCode: LanguageCode.en, name: 'Medium' },
                    { languageCode: LanguageCode.de, name: 'Mittel' },
                ],
            },
        });

        expect(omit(createProductOption, ['translations'])).toEqual({
            id: 'T_7',
            groupId: sizeGroup.id,
            code: 'medium',
            name: 'Medium',
        });
        mediumOption = createProductOption;
    });

    it('updateProductOption', async () => {
        const { updateProductOption } = await adminClient.query<
            Codegen.UpdateProductOptionMutation,
            Codegen.UpdateProductOptionMutationVariables
        >(UPDATE_PRODUCT_OPTION, {
            input: {
                id: 'T_7',
                translations: [
                    { id: mediumOption.translations[0].id, languageCode: LanguageCode.en, name: 'Middling' },
                ],
            },
        });

        expect(updateProductOption.name).toBe('Middling');
    });

    describe('deletion', () => {
        let sizeOptionGroupWithOptions: NonNullable<Codegen.GetProductOptionGroupQuery['productOptionGroup']>;
        let variants: Codegen.CreateProductVariantsMutation['createProductVariants'];

        beforeAll(async () => {
            // Create a new product with a variant in each size option
            const { createProduct } = await adminClient.query<
                Codegen.CreateProductMutation,
                Codegen.CreateProductMutationVariables
            >(CREATE_PRODUCT, {
                input: {
                    translations: [
                        {
                            languageCode: LanguageCode.en,
                            name: 'T-shirt',
                            slug: 't-shirt',
                            description: 'A television set',
                        },
                    ],
                },
            });

            const result = await adminClient.query<
                Codegen.AddOptionGroupToProductMutation,
                Codegen.AddOptionGroupToProductMutationVariables
            >(ADD_OPTION_GROUP_TO_PRODUCT, {
                optionGroupId: sizeGroup.id,
                productId: createProduct.id,
            });

            const { productOptionGroup } = await adminClient.query<
                Codegen.GetProductOptionGroupQuery,
                Codegen.GetProductOptionGroupQueryVariables
            >(GET_PRODUCT_OPTION_GROUP, {
                id: sizeGroup.id,
            });

            const variantInput: Codegen.CreateProductVariantsMutationVariables['input'] =
                productOptionGroup!.options.map((option, i) => ({
                    productId: createProduct.id,
                    sku: `TS-${option.code}`,
                    optionIds: [option.id],
                    translations: [{ languageCode: LanguageCode.en, name: `T-shirt ${option.code}` }],
                }));

            const { createProductVariants } = await adminClient.query<
                Codegen.CreateProductVariantsMutation,
                Codegen.CreateProductVariantsMutationVariables
            >(CREATE_PRODUCT_VARIANTS, {
                input: variantInput,
            });
            variants = createProductVariants;
            sizeOptionGroupWithOptions = productOptionGroup!;
        });

        it(
            'attempting to delete a non-existent id throws',
            assertThrowsWithMessage(
                () =>
                    adminClient.query<
                        Codegen.DeleteProductOptionMutation,
                        Codegen.DeleteProductOptionMutationVariables
                    >(DELETE_PRODUCT_OPTION, {
                        id: '999999',
                    }),
                'No ProductOption with the id "999999" could be found',
            ),
        );

        it('cannot delete ProductOption that is used by a ProductVariant', async () => {
            const { deleteProductOption } = await adminClient.query<
                Codegen.DeleteProductOptionMutation,
                Codegen.DeleteProductOptionMutationVariables
            >(DELETE_PRODUCT_OPTION, {
                id: sizeOptionGroupWithOptions.options.find(o => o.code === 'medium')!.id,
            });

            expect(deleteProductOption.result).toBe(DeletionResult.NOT_DELETED);
            expect(deleteProductOption.message).toBe(
                'Cannot delete the option "medium" as it is being used by 1 ProductVariant',
            );
        });

        it('can delete ProductOption after deleting associated ProductVariant', async () => {
            const { deleteProductVariant } = await adminClient.query<
                Codegen.DeleteProductVariantMutation,
                Codegen.DeleteProductVariantMutationVariables
            >(DELETE_PRODUCT_VARIANT, {
                id: variants.find(v => v!.name.includes('medium'))!.id,
            });

            expect(deleteProductVariant.result).toBe(DeletionResult.DELETED);

            const { deleteProductOption } = await adminClient.query<
                Codegen.DeleteProductOptionMutation,
                Codegen.DeleteProductOptionMutationVariables
            >(DELETE_PRODUCT_OPTION, {
                id: sizeOptionGroupWithOptions.options.find(o => o.code === 'medium')!.id,
            });

            expect(deleteProductOption.result).toBe(DeletionResult.DELETED);
        });

        it('deleted ProductOptions not included in query result', async () => {
            const { productOptionGroup } = await adminClient.query<
                Codegen.GetProductOptionGroupQuery,
                Codegen.GetProductOptionGroupQueryVariables
            >(GET_PRODUCT_OPTION_GROUP, {
                id: sizeGroup.id,
            });

            expect(productOptionGroup?.options.length).toBe(2);
            expect(productOptionGroup?.options.findIndex(o => o.code === 'medium')).toBe(-1);
        });
    });

    describe('channels', () => {
        const SECOND_CHANNEL_TOKEN = 'second_channel_token';
        let secondChannel: ChannelFragment;
        let channelOptionGroup: Codegen.ProductOptionGroupFragment;

        beforeAll(async () => {
            const { createChannel } = await adminClient.query<
                Codegen.CreateChannelMutation,
                Codegen.CreateChannelMutationVariables
            >(CREATE_CHANNEL, {
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

            secondChannel = createChannel as ChannelFragment;

            // Create a test product for channel-aware tests
            const { createProduct } = await adminClient.query<
                Codegen.CreateProductMutation,
                Codegen.CreateProductMutationVariables
            >(CREATE_PRODUCT, {
                input: {
                    translations: [
                        {
                            languageCode: LanguageCode.en,
                            name: 'Channel Test Product',
                            slug: 'channel-test-product',
                            description: 'A product for testing channel-aware options',
                        },
                    ],
                },
            });

            // Assign the product to the second channel
            await adminClient.query<
                Codegen.AssignProductsToChannelMutation,
                Codegen.AssignProductsToChannelMutationVariables
            >(ASSIGN_PRODUCT_TO_CHANNEL, {
                input: {
                    channelId: secondChannel.id,
                    productIds: [createProduct.id],
                    priceFactor: 1.0,
                },
            });
        });

        it('creates ProductOptionGroup in current channel', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);

            const { createProductOptionGroup } = await adminClient.query<
                Codegen.CreateProductOptionGroupMutation,
                Codegen.CreateProductOptionGroupMutationVariables
            >(CREATE_PRODUCT_OPTION_GROUP, {
                input: {
                    code: 'channel-option-group',
                    translations: [{ languageCode: LanguageCode.en, name: 'Channel Option Group' }],
                    options: [
                        {
                            code: 'channel-option-1',
                            translations: [{ languageCode: LanguageCode.en, name: 'Channel Option 1' }],
                        },
                        {
                            code: 'channel-option-2',
                            translations: [{ languageCode: LanguageCode.en, name: 'Channel Option 2' }],
                        },
                    ],
                },
            });

            expect(createProductOptionGroup.code).toBe('channel-option-group');
            channelOptionGroup = createProductOptionGroup;
        });

        it('productOptionGroups list in channel', async () => {
            const result =
                await adminClient.query<Codegen.GetProductOptionGroupsQuery>(GET_PRODUCT_OPTION_GROUPS);

            const { productOptionGroups } = result;
            expect(productOptionGroups.items.length).toBe(1);
            expect(productOptionGroups.items[0].code).toBe('channel-option-group');
        });

        it(
            'throws when attempting to assign empty productOptionGroupIds array',
            assertThrowsWithMessage(async () => {
                await adminClient.query<
                    Codegen.AssignProductOptionGroupsToChannelMutation,
                    Codegen.AssignProductOptionGroupsToChannelMutationVariables
                >(ASSIGN_PRODUCT_OPTION_GROUPS_TO_CHANNEL, {
                    input: {
                        productOptionGroupIds: [],
                        channelId: secondChannel.id,
                    },
                });
            }, 'Product option group ids cannot be empty'),
        );

        it('assigns ProductOptionGroups to channel', async () => {
            const input: AssignProductOptionGroupsToChannelInput = {
                productOptionGroupIds: [sizeGroup.id],
                channelId: secondChannel.id,
            };

            const { assignProductOptionGroupsToChannel } = await adminClient.query<
                Codegen.AssignProductOptionGroupsToChannelMutation,
                Codegen.AssignProductOptionGroupsToChannelMutationVariables
            >(ASSIGN_PRODUCT_OPTION_GROUPS_TO_CHANNEL, {
                input,
            });

            expect(assignProductOptionGroupsToChannel).toHaveLength(1);
            expect(assignProductOptionGroupsToChannel[0].id).toBe(sizeGroup.id);
        });

        it('returns assigned ProductOptionGroups in target channel', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);

            const result =
                await adminClient.query<Codegen.GetProductOptionGroupsQuery>(GET_PRODUCT_OPTION_GROUPS);

            const assignedGroup = result.productOptionGroups.items.find(g => g.code === 'size');
            expect(assignedGroup).toBeDefined();
            expect(assignedGroup?.code).toBe('size');
        });

        it(
            'throws when attempting to remove empty productOptionGroupIds array',
            assertThrowsWithMessage(async () => {
                adminClient.setChannelToken('e2e-default-channel');
                await adminClient.query<
                    Codegen.RemoveProductOptionGroupsFromChannelMutation,
                    Codegen.RemoveProductOptionGroupsFromChannelMutationVariables
                >(REMOVE_PRODUCT_OPTION_GROUPS_FROM_CHANNEL, {
                    input: {
                        productOptionGroupIds: [],
                        channelId: secondChannel.id,
                        force: false,
                    },
                });
            }, 'Product option group ids cannot be empty'),
        );

        it('removes ProductOptionGroups from channel', async () => {
            adminClient.setChannelToken('e2e-default-channel');

            const input: RemoveProductOptionGroupsFromChannelInput = {
                productOptionGroupIds: [sizeGroup.id],
                channelId: secondChannel.id,
                force: false,
            };

            const { removeProductOptionGroupsFromChannel } = await adminClient.query<
                Codegen.RemoveProductOptionGroupsFromChannelMutation,
                Codegen.RemoveProductOptionGroupsFromChannelMutationVariables
            >(REMOVE_PRODUCT_OPTION_GROUPS_FROM_CHANNEL, {
                input,
            });

            expect(removeProductOptionGroupsFromChannel).toHaveLength(1);
            expect((removeProductOptionGroupsFromChannel[0] as ProductOptionGroup).id).toBe(sizeGroup.id);
        });

        it('no longer returns removed ProductOptionGroups in target channel', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);

            const result =
                await adminClient.query<Codegen.GetProductOptionGroupsQuery>(GET_PRODUCT_OPTION_GROUPS);

            const removedGroup = result.productOptionGroups.items.find(g => g.code === 'size');
            expect(removedGroup).toBeUndefined();

            adminClient.setChannelToken('e2e-default-channel');
        });

        it('prevents removal from default channel', async () => {
            try {
                await adminClient.query<
                    Codegen.RemoveProductOptionGroupsFromChannelMutation,
                    Codegen.RemoveProductOptionGroupsFromChannelMutationVariables
                >(REMOVE_PRODUCT_OPTION_GROUPS_FROM_CHANNEL, {
                    input: {
                        productOptionGroupIds: [sizeGroup.id],
                        channelId: 'T_1', // Default channel ID
                        force: false,
                    },
                });
                expect.fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.message).toEqual('Items cannot be removed from the default Channel');
            }
        });

        it('creates ProductOption that inherits channels from parent group', async () => {
            adminClient.setChannelToken('e2e-default-channel');

            // First assign the channel option group to default channel
            await adminClient.query<
                Codegen.AssignProductOptionGroupsToChannelMutation,
                Codegen.AssignProductOptionGroupsToChannelMutationVariables
            >(ASSIGN_PRODUCT_OPTION_GROUPS_TO_CHANNEL, {
                input: {
                    productOptionGroupIds: [channelOptionGroup.id],
                    channelId: 'T_1',
                },
            });

            const { createProductOption } = await adminClient.query<
                Codegen.CreateProductOptionMutation,
                Codegen.CreateProductOptionMutationVariables
            >(CREATE_PRODUCT_OPTION, {
                input: {
                    productOptionGroupId: channelOptionGroup.id,
                    code: 'channel-option-3',
                    translations: [{ languageCode: LanguageCode.en, name: 'Channel Option 3' }],
                },
            });

            expect(createProductOption).toBeDefined();
            expect(createProductOption.code).toBe('channel-option-3');
            expect(createProductOption.groupId).toBe(channelOptionGroup.id);
        });

        it(
            'attempting to create ProductOption in ProductOptionGroup from another Channel throws',
            assertThrowsWithMessage(async () => {
                adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
                await adminClient.query<
                    Codegen.CreateProductOptionMutation,
                    Codegen.CreateProductOptionMutationVariables
                >(CREATE_PRODUCT_OPTION, {
                    input: {
                        productOptionGroupId: sizeGroup.id,
                        code: 'channel-size',
                        translations: [{ languageCode: LanguageCode.en, name: 'Channel Size' }],
                    },
                });
            }, 'No ProductOptionGroup with the id'),
        );

        it('removing from channel with error', async () => {
            // First, create a product with the channel option group
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);

            const { createProduct } = await adminClient.query<
                Codegen.CreateProductMutation,
                Codegen.CreateProductMutationVariables
            >(CREATE_PRODUCT, {
                input: {
                    translations: [
                        {
                            languageCode: LanguageCode.en,
                            name: 'Product with Options',
                            slug: 'product-with-options',
                            description: 'Testing removal errors',
                        },
                    ],
                },
            });

            await adminClient.query<
                Codegen.AddOptionGroupToProductMutation,
                Codegen.AddOptionGroupToProductMutationVariables
            >(ADD_OPTION_GROUP_TO_PRODUCT, {
                productId: createProduct.id,
                optionGroupId: channelOptionGroup.id,
            });

            // Create variants with the options
            await adminClient.query<
                Codegen.CreateProductVariantsMutation,
                Codegen.CreateProductVariantsMutationVariables
            >(CREATE_PRODUCT_VARIANTS, {
                input: channelOptionGroup.options.map(option => ({
                    productId: createProduct.id,
                    sku: `VARIANT-${option.code}`,
                    optionIds: [option.id],
                    translations: [{ languageCode: LanguageCode.en, name: `Variant ${option.code}` }],
                })),
            });

            adminClient.setChannelToken('e2e-default-channel');
            const { removeProductOptionGroupsFromChannel } = await adminClient.query<
                Codegen.RemoveProductOptionGroupsFromChannelMutation,
                Codegen.RemoveProductOptionGroupsFromChannelMutationVariables
            >(REMOVE_PRODUCT_OPTION_GROUPS_FROM_CHANNEL, {
                input: {
                    channelId: secondChannel.id,
                    productOptionGroupIds: [channelOptionGroup.id],
                    force: false,
                },
            });

            expect(removeProductOptionGroupsFromChannel).toEqual([
                {
                    errorCode: 'PRODUCT_OPTION_GROUP_IN_USE_ERROR',
                    message:
                        'Cannot remove ProductOptionGroup \"channel-option-group\" as it is used by 1 Product 2 ProductVariants',
                    optionGroupCode: 'channel-option-group',
                    productCount: 1,
                    variantCount: 2,
                },
            ]);
        });

        it('force removing from channel', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);

            // Verify option group is still there
            const before =
                await adminClient.query<Codegen.GetProductOptionGroupsQuery>(GET_PRODUCT_OPTION_GROUPS);
            expect(
                before.productOptionGroups.items.find(g => g.code === 'channel-option-group'),
            ).toBeDefined();

            adminClient.setChannelToken('e2e-default-channel');
            const { removeProductOptionGroupsFromChannel } = await adminClient.query<
                Codegen.RemoveProductOptionGroupsFromChannelMutation,
                Codegen.RemoveProductOptionGroupsFromChannelMutationVariables
            >(REMOVE_PRODUCT_OPTION_GROUPS_FROM_CHANNEL, {
                input: {
                    channelId: secondChannel.id,
                    productOptionGroupIds: [channelOptionGroup.id],
                    force: true,
                },
            });

            expect(removeProductOptionGroupsFromChannel).toEqual([
                {
                    id: 'T_4',
                    name: 'Channel Option Group',
                },
            ]);

            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const after =
                await adminClient.query<Codegen.GetProductOptionGroupsQuery>(GET_PRODUCT_OPTION_GROUPS);
            expect(
                after.productOptionGroups.items.find(g => g.code === 'channel-option-group'),
            ).toBeUndefined();
        });

        it('re-assigning to channel after removal', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const before =
                await adminClient.query<Codegen.GetProductOptionGroupsQuery>(GET_PRODUCT_OPTION_GROUPS);
            expect(
                before.productOptionGroups.items.find(g => g.code === 'channel-option-group'),
            ).toBeUndefined();

            adminClient.setChannelToken('e2e-default-channel');
            const { assignProductOptionGroupsToChannel } = await adminClient.query<
                Codegen.AssignProductOptionGroupsToChannelMutation,
                Codegen.AssignProductOptionGroupsToChannelMutationVariables
            >(ASSIGN_PRODUCT_OPTION_GROUPS_TO_CHANNEL, {
                input: {
                    channelId: secondChannel.id,
                    productOptionGroupIds: [channelOptionGroup.id],
                },
            });

            expect(assignProductOptionGroupsToChannel).toHaveLength(1);
            expect(assignProductOptionGroupsToChannel[0].id).toBe(channelOptionGroup.id);

            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const after =
                await adminClient.query<Codegen.GetProductOptionGroupsQuery>(GET_PRODUCT_OPTION_GROUPS);
            expect(
                after.productOptionGroups.items.find(g => g.code === 'channel-option-group'),
            ).toBeDefined();
        });
    });

    describe('automatic option group cleanup when variants are deleted', () => {
        let testProduct: Codegen.CreateProductMutation['createProduct'];
        let testOptionGroup1: Codegen.CreateProductOptionGroupMutation['createProductOptionGroup'];
        let testOptionGroup2: Codegen.CreateProductOptionGroupMutation['createProductOptionGroup'];
        let testVariants: Codegen.CreateProductVariantsMutation['createProductVariants'];

        it('creates a product with multiple option groups', async () => {
            // Create product
            const { createProduct } = await adminClient.query<
                Codegen.CreateProductMutation,
                Codegen.CreateProductMutationVariables
            >(CREATE_PRODUCT, {
                input: {
                    translations: [
                        {
                            languageCode: LanguageCode.en,
                            name: 'Test Product for Option Cleanup',
                            slug: 'test-product-option-cleanup',
                            description: 'Testing option group cleanup',
                        },
                    ],
                },
            });
            testProduct = createProduct;

            // Create first option group
            const { createProductOptionGroup: group1 } = await adminClient.query<
                Codegen.CreateProductOptionGroupMutation,
                Codegen.CreateProductOptionGroupMutationVariables
            >(CREATE_PRODUCT_OPTION_GROUP, {
                input: {
                    code: 'test-group-1',
                    translations: [{ languageCode: LanguageCode.en, name: 'Test Group 1' }],
                    options: [
                        {
                            code: 'test-option-1a',
                            translations: [{ languageCode: LanguageCode.en, name: 'Option 1A' }],
                        },
                        {
                            code: 'test-option-1b',
                            translations: [{ languageCode: LanguageCode.en, name: 'Option 1B' }],
                        },
                    ],
                },
            });
            testOptionGroup1 = group1;

            // Create second option group
            const { createProductOptionGroup: group2 } = await adminClient.query<
                Codegen.CreateProductOptionGroupMutation,
                Codegen.CreateProductOptionGroupMutationVariables
            >(CREATE_PRODUCT_OPTION_GROUP, {
                input: {
                    code: 'test-group-2',
                    translations: [{ languageCode: LanguageCode.en, name: 'Test Group 2' }],
                    options: [
                        {
                            code: 'test-option-2a',
                            translations: [{ languageCode: LanguageCode.en, name: 'Option 2A' }],
                        },
                        {
                            code: 'test-option-2b',
                            translations: [{ languageCode: LanguageCode.en, name: 'Option 2B' }],
                        },
                    ],
                },
            });
            testOptionGroup2 = group2;

            // Add both option groups to product
            await adminClient.query<
                Codegen.AddOptionGroupToProductMutation,
                Codegen.AddOptionGroupToProductMutationVariables
            >(ADD_OPTION_GROUP_TO_PRODUCT, {
                productId: testProduct.id,
                optionGroupId: testOptionGroup1.id,
            });

            await adminClient.query<
                Codegen.AddOptionGroupToProductMutation,
                Codegen.AddOptionGroupToProductMutationVariables
            >(ADD_OPTION_GROUP_TO_PRODUCT, {
                productId: testProduct.id,
                optionGroupId: testOptionGroup2.id,
            });

            // Create variants with options from both groups
            const { createProductVariants } = await adminClient.query<
                Codegen.CreateProductVariantsMutation,
                Codegen.CreateProductVariantsMutationVariables
            >(CREATE_PRODUCT_VARIANTS, {
                input: [
                    {
                        productId: testProduct.id,
                        sku: 'TEST-VARIANT-1',
                        price: 100,
                        translations: [{ languageCode: LanguageCode.en, name: 'Variant 1' }],
                        optionIds: [testOptionGroup1.options[0].id, testOptionGroup2.options[0].id],
                    },
                    {
                        productId: testProduct.id,
                        sku: 'TEST-VARIANT-2',
                        price: 100,
                        translations: [{ languageCode: LanguageCode.en, name: 'Variant 2' }],
                        optionIds: [testOptionGroup1.options[1].id, testOptionGroup2.options[0].id],
                    },
                    {
                        productId: testProduct.id,
                        sku: 'TEST-VARIANT-3',
                        price: 100,
                        translations: [{ languageCode: LanguageCode.en, name: 'Variant 3' }],
                        optionIds: [testOptionGroup1.options[0].id, testOptionGroup2.options[1].id],
                    },
                ],
            });
            testVariants = createProductVariants;

            expect(testVariants).toHaveLength(3);
        });

        it('product has both option groups', async () => {
            const { product } = await adminClient.query<
                Codegen.GetProductWithOptionGroupsQuery,
                Codegen.GetProductWithOptionGroupsQueryVariables
            >(GET_PRODUCT_WITH_OPTION_GROUPS, {
                id: testProduct.id,
            });

            expect(product?.optionGroups).toHaveLength(2);
            expect(product?.optionGroups.map(g => g.id)).toContain(testOptionGroup1.id);
            expect(product?.optionGroups.map(g => g.id)).toContain(testOptionGroup2.id);
        });

        it('deleting some variants keeps option groups that are still in use', async () => {
            // Delete variant 3 which uses option1a and option2b
            const result1 = await adminClient.query<
                Codegen.DeleteProductVariantMutation,
                Codegen.DeleteProductVariantMutationVariables
            >(DELETE_PRODUCT_VARIANT, {
                id: testVariants[2]!.id,
            });
            expect(result1.deleteProductVariant.result).toBe(DeletionResult.DELETED);

            // Wait a bit for the event handler to process
            await new Promise(resolve => setTimeout(resolve, 100));

            // Check that both option groups are still on the product (other variants still use them)
            const { product: productAfterFirstDelete } = await adminClient.query<
                Codegen.GetProductWithOptionGroupsQuery,
                Codegen.GetProductWithOptionGroupsQueryVariables
            >(GET_PRODUCT_WITH_OPTION_GROUPS, {
                id: testProduct.id,
            });
            expect(productAfterFirstDelete?.optionGroups).toHaveLength(2);
        });

        it('deleting all variants removes all option groups from product', async () => {
            // Delete remaining variants
            const result1 = await adminClient.query<
                Codegen.DeleteProductVariantMutation,
                Codegen.DeleteProductVariantMutationVariables
            >(DELETE_PRODUCT_VARIANT, {
                id: testVariants[0]!.id,
            });
            expect(result1.deleteProductVariant.result).toBe(DeletionResult.DELETED);

            const result2 = await adminClient.query<
                Codegen.DeleteProductVariantMutation,
                Codegen.DeleteProductVariantMutationVariables
            >(DELETE_PRODUCT_VARIANT, {
                id: testVariants[1]!.id,
            });
            expect(result2.deleteProductVariant.result).toBe(DeletionResult.DELETED);

            // Wait a bit for the event handler to process
            await new Promise(resolve => setTimeout(resolve, 100));

            // Check that all option groups have been removed from the product
            const { product: productAfterAllDeletes } = await adminClient.query<
                Codegen.GetProductWithOptionGroupsQuery,
                Codegen.GetProductWithOptionGroupsQueryVariables
            >(GET_PRODUCT_WITH_OPTION_GROUPS, {
                id: testProduct.id,
            });
            expect(productAfterAllDeletes?.optionGroups).toHaveLength(0);
        });

        it('option groups still exist but are not assigned to the product', async () => {
            // Verify option groups still exist in the system
            const { productOptionGroup: group1 } = await adminClient.query<
                Codegen.GetProductOptionGroupQuery,
                Codegen.GetProductOptionGroupQueryVariables
            >(GET_PRODUCT_OPTION_GROUP, {
                id: testOptionGroup1.id,
            });
            expect(group1).toBeDefined();
            expect(group1?.code).toBe('test-group-1');

            const { productOptionGroup: group2 } = await adminClient.query<
                Codegen.GetProductOptionGroupQuery,
                Codegen.GetProductOptionGroupQueryVariables
            >(GET_PRODUCT_OPTION_GROUP, {
                id: testOptionGroup2.id,
            });
            expect(group2).toBeDefined();
            expect(group2?.code).toBe('test-group-2');
        });
    });

    describe('shared option groups are not removed from other products', () => {
        let product1: Codegen.CreateProductMutation['createProduct'];
        let product2: Codegen.CreateProductMutation['createProduct'];
        let sharedOptionGroup: Codegen.CreateProductOptionGroupMutation['createProductOptionGroup'];
        let product1Variants: Codegen.CreateProductVariantsMutation['createProductVariants'];
        let product2Variants: Codegen.CreateProductVariantsMutation['createProductVariants'];

        it('creates two products sharing the same option group', async () => {
            // Create shared option group
            const { createProductOptionGroup } = await adminClient.query<
                Codegen.CreateProductOptionGroupMutation,
                Codegen.CreateProductOptionGroupMutationVariables
            >(CREATE_PRODUCT_OPTION_GROUP, {
                input: {
                    code: 'shared-size-group',
                    translations: [{ languageCode: LanguageCode.en, name: 'Size' }],
                    options: [
                        {
                            code: 'size-small',
                            translations: [{ languageCode: LanguageCode.en, name: 'Small' }],
                        },
                        {
                            code: 'size-medium',
                            translations: [{ languageCode: LanguageCode.en, name: 'Medium' }],
                        },
                        {
                            code: 'size-large',
                            translations: [{ languageCode: LanguageCode.en, name: 'Large' }],
                        },
                    ],
                },
            });
            sharedOptionGroup = createProductOptionGroup;

            // Create first product
            const { createProduct: prod1 } = await adminClient.query<
                Codegen.CreateProductMutation,
                Codegen.CreateProductMutationVariables
            >(CREATE_PRODUCT, {
                input: {
                    translations: [
                        {
                            languageCode: LanguageCode.en,
                            name: 'T-Shirt',
                            slug: 't-shirt-shared-test',
                            description: 'A t-shirt with shared size options',
                        },
                    ],
                },
            });
            product1 = prod1;

            // Create second product
            const { createProduct: prod2 } = await adminClient.query<
                Codegen.CreateProductMutation,
                Codegen.CreateProductMutationVariables
            >(CREATE_PRODUCT, {
                input: {
                    translations: [
                        {
                            languageCode: LanguageCode.en,
                            name: 'Hoodie',
                            slug: 'hoodie-shared-test',
                            description: 'A hoodie with shared size options',
                        },
                    ],
                },
            });
            product2 = prod2;

            // Add shared option group to both products
            await adminClient.query<
                Codegen.AddOptionGroupToProductMutation,
                Codegen.AddOptionGroupToProductMutationVariables
            >(ADD_OPTION_GROUP_TO_PRODUCT, {
                productId: product1.id,
                optionGroupId: sharedOptionGroup.id,
            });

            await adminClient.query<
                Codegen.AddOptionGroupToProductMutation,
                Codegen.AddOptionGroupToProductMutationVariables
            >(ADD_OPTION_GROUP_TO_PRODUCT, {
                productId: product2.id,
                optionGroupId: sharedOptionGroup.id,
            });

            // Create variants for product 1
            const { createProductVariants: variants1 } = await adminClient.query<
                Codegen.CreateProductVariantsMutation,
                Codegen.CreateProductVariantsMutationVariables
            >(CREATE_PRODUCT_VARIANTS, {
                input: [
                    {
                        productId: product1.id,
                        sku: 'TSHIRT-S',
                        price: 1500,
                        translations: [{ languageCode: LanguageCode.en, name: 'T-Shirt Small' }],
                        optionIds: [sharedOptionGroup.options[0].id], // Small
                    },
                    {
                        productId: product1.id,
                        sku: 'TSHIRT-M',
                        price: 1500,
                        translations: [{ languageCode: LanguageCode.en, name: 'T-Shirt Medium' }],
                        optionIds: [sharedOptionGroup.options[1].id], // Medium
                    },
                ],
            });
            product1Variants = variants1;

            // Create variants for product 2
            const { createProductVariants: variants2 } = await adminClient.query<
                Codegen.CreateProductVariantsMutation,
                Codegen.CreateProductVariantsMutationVariables
            >(CREATE_PRODUCT_VARIANTS, {
                input: [
                    {
                        productId: product2.id,
                        sku: 'HOODIE-M',
                        price: 3500,
                        translations: [{ languageCode: LanguageCode.en, name: 'Hoodie Medium' }],
                        optionIds: [sharedOptionGroup.options[1].id], // Medium
                    },
                    {
                        productId: product2.id,
                        sku: 'HOODIE-L',
                        price: 3500,
                        translations: [{ languageCode: LanguageCode.en, name: 'Hoodie Large' }],
                        optionIds: [sharedOptionGroup.options[2].id], // Large
                    },
                ],
            });
            product2Variants = variants2;
        });

        it('deleting all variants from product1 removes option group from product1 only', async () => {
            // Delete all variants from product 1
            for (const variant of product1Variants) {
                const result = await adminClient.query<
                    Codegen.DeleteProductVariantMutation,
                    Codegen.DeleteProductVariantMutationVariables
                >(DELETE_PRODUCT_VARIANT, {
                    id: variant!.id,
                });
                expect(result.deleteProductVariant.result).toBe(DeletionResult.DELETED);
            }

            // Wait for event processing
            await new Promise(resolve => setTimeout(resolve, 100));

            // Check that product1 no longer has the option group
            const { product: prod1After } = await adminClient.query<
                Codegen.GetProductWithOptionGroupsQuery,
                Codegen.GetProductWithOptionGroupsQueryVariables
            >(GET_PRODUCT_WITH_OPTION_GROUPS, {
                id: product1.id,
            });
            expect(prod1After?.optionGroups).toHaveLength(0);

            // Check that product2 still has the option group
            const { product: prod2After } = await adminClient.query<
                Codegen.GetProductWithOptionGroupsQuery,
                Codegen.GetProductWithOptionGroupsQueryVariables
            >(GET_PRODUCT_WITH_OPTION_GROUPS, {
                id: product2.id,
            });
            expect(prod2After?.optionGroups).toHaveLength(1);
            expect(prod2After?.optionGroups[0].id).toBe(sharedOptionGroup.id);
        });

        it('shared option group is still active and assigned to product2', async () => {
            const { productOptionGroup } = await adminClient.query<
                Codegen.GetProductOptionGroupQuery,
                Codegen.GetProductOptionGroupQueryVariables
            >(GET_PRODUCT_OPTION_GROUP, {
                id: sharedOptionGroup.id,
            });

            expect(productOptionGroup).toBeDefined();
            expect(productOptionGroup?.code).toBe('shared-size-group');
        });
    });
});

const GET_PRODUCT_OPTION_GROUP = gql`
    query GetProductOptionGroup($id: ID!) {
        productOptionGroup(id: $id) {
            id
            code
            name
            options {
                id
                code
                name
            }
        }
    }
`;

const UPDATE_PRODUCT_OPTION_GROUP = gql`
    mutation UpdateProductOptionGroup($input: UpdateProductOptionGroupInput!) {
        updateProductOptionGroup(input: $input) {
            ...ProductOptionGroup
        }
    }
    ${PRODUCT_OPTION_GROUP_FRAGMENT}
`;

const CREATE_PRODUCT_OPTION = gql`
    mutation CreateProductOption($input: CreateProductOptionInput!) {
        createProductOption(input: $input) {
            id
            code
            name
            groupId
            translations {
                id
                languageCode
                name
            }
        }
    }
`;

const UPDATE_PRODUCT_OPTION = gql`
    mutation UpdateProductOption($input: UpdateProductOptionInput!) {
        updateProductOption(input: $input) {
            id
            code
            name
            groupId
        }
    }
`;

const DELETE_PRODUCT_OPTION = gql`
    mutation DeleteProductOption($id: ID!) {
        deleteProductOption(id: $id) {
            result
            message
        }
    }
`;

const GET_PRODUCT_OPTION_GROUPS = gql`
    query GetProductOptionGroups($options: ProductOptionGroupListOptions) {
        productOptionGroups(options: $options) {
            items {
                ...ProductOptionGroup
            }
            totalItems
        }
    }
    ${PRODUCT_OPTION_GROUP_FRAGMENT}
`;

const ASSIGN_PRODUCT_OPTION_GROUPS_TO_CHANNEL = gql`
    mutation AssignProductOptionGroupsToChannel($input: AssignProductOptionGroupsToChannelInput!) {
        assignProductOptionGroupsToChannel(input: $input) {
            id
            name
        }
    }
`;

const REMOVE_PRODUCT_OPTION_GROUPS_FROM_CHANNEL = gql`
    mutation RemoveProductOptionGroupsFromChannel($input: RemoveProductOptionGroupsFromChannelInput!) {
        removeProductOptionGroupsFromChannel(input: $input) {
            ... on ProductOptionGroup {
                id
                name
            }
            ... on ProductOptionGroupInUseError {
                errorCode
                message
                optionGroupCode
                productCount
                variantCount
            }
        }
    }
`;

const GET_PRODUCT_WITH_OPTION_GROUPS = gql`
    query GetProductWithOptionGroups($id: ID!) {
        product(id: $id) {
            id
            name
            optionGroups {
                id
                code
                name
            }
        }
    }
`;
