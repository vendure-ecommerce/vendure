import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';
import { omit } from '../../common/lib/omit';

import { PRODUCT_OPTION_GROUP_FRAGMENT } from './graphql/fragments';
import * as Codegen from './graphql/generated-e2e-admin-types';
import { DeletionResult, LanguageCode } from './graphql/generated-e2e-admin-types';
import {
    ADD_OPTION_GROUP_TO_PRODUCT,
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
