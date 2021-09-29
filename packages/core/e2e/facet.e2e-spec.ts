import { pick } from '@vendure/common/lib/pick';
import { createTestEnvironment, E2E_DEFAULT_CHANNEL_TOKEN } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { FACET_VALUE_FRAGMENT, FACET_WITH_VALUES_FRAGMENT } from './graphql/fragments';
import {
    AssignProductsToChannel,
    ChannelFragment,
    CreateChannel,
    CreateFacet,
    CreateFacetValues,
    CurrencyCode,
    DeleteFacet,
    DeleteFacetValues,
    DeletionResult,
    FacetWithValues,
    GetFacetList,
    GetFacetWithValues,
    GetProductListWithVariants,
    GetProductWithVariants,
    LanguageCode,
    UpdateFacet,
    UpdateFacetValues,
    UpdateProduct,
    UpdateProductVariants,
} from './graphql/generated-e2e-admin-types';
import {
    ASSIGN_PRODUCT_TO_CHANNEL,
    CREATE_CHANNEL,
    CREATE_FACET,
    GET_FACET_LIST, GET_FACET_LIST_SIMPLE,
    GET_PRODUCT_WITH_VARIANTS,
    UPDATE_FACET,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_VARIANTS,
} from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

// tslint:disable:no-non-null-assertion

describe('Facet resolver', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(testConfig);

    let brandFacet: FacetWithValues.Fragment;
    let speakerTypeFacet: FacetWithValues.Fragment;

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('createFacet', async () => {
        const result = await adminClient.query<CreateFacet.Mutation, CreateFacet.Variables>(CREATE_FACET, {
            input: {
                isPrivate: false,
                code: 'speaker-type',
                translations: [{ languageCode: LanguageCode.en, name: 'Speaker Type' }],
                values: [
                    {
                        code: 'portable',
                        translations: [{ languageCode: LanguageCode.en, name: 'Portable' }],
                    },
                ],
            },
        });

        speakerTypeFacet = result.createFacet;
        expect(speakerTypeFacet).toMatchSnapshot();
    });

    it('updateFacet', async () => {
        const result = await adminClient.query<UpdateFacet.Mutation, UpdateFacet.Variables>(UPDATE_FACET, {
            input: {
                id: speakerTypeFacet.id,
                translations: [{ languageCode: LanguageCode.en, name: 'Speaker Category' }],
                isPrivate: true
            },
        });

        expect(result.updateFacet.name).toBe('Speaker Category');
    });

    it('createFacetValues', async () => {
        const { createFacetValues } = await adminClient.query<
            CreateFacetValues.Mutation,
            CreateFacetValues.Variables
        >(CREATE_FACET_VALUES, {
            input: [
                {
                    facetId: speakerTypeFacet.id,
                    code: 'pc',
                    translations: [{ languageCode: LanguageCode.en, name: 'PC Speakers' }],
                },
                {
                    facetId: speakerTypeFacet.id,
                    code: 'hi-fi',
                    translations: [{ languageCode: LanguageCode.en, name: 'Hi Fi Speakers' }],
                },
            ],
        });

        expect(createFacetValues.length).toBe(2);
        expect(pick(createFacetValues.find(fv => fv.code === 'pc')!, ['code', 'facet', 'name'])).toEqual({
            code: 'pc',
            facet: {
                id: 'T_2',
                name: 'Speaker Category',
            },
            name: 'PC Speakers',
        });
        expect(pick(createFacetValues.find(fv => fv.code === 'hi-fi')!, ['code', 'facet', 'name'])).toEqual({
            code: 'hi-fi',
            facet: {
                id: 'T_2',
                name: 'Speaker Category',
            },
            name: 'Hi Fi Speakers',
        });
    });

    it('updateFacetValues', async () => {
        const result = await adminClient.query<UpdateFacetValues.Mutation, UpdateFacetValues.Variables>(
            UPDATE_FACET_VALUES,
            {
                input: [
                    {
                        id: speakerTypeFacet.values[0].id,
                        code: 'compact',
                    },
                ],
            },
        );

        expect(result.updateFacetValues[0].code).toBe('compact');
    });

    it('facets', async () => {
        const result = await adminClient.query<GetFacetList.Query>(GET_FACET_LIST);

        const { items } = result.facets;
        expect(items.length).toBe(2);
        expect(items[0].name).toBe('category');
        expect(items[1].name).toBe('Speaker Category');

        brandFacet = items[0];
        speakerTypeFacet = items[1];
    });

    it('facets by shop-api', async () => {
        const result = await shopClient.query<GetFacetList.Query>(GET_FACET_LIST_SIMPLE);

        const { items } = result.facets;
        expect(items.length).toBe(1);
        expect(items[0].name).toBe('category');
    });

    it('facet', async () => {
        const result = await adminClient.query<GetFacetWithValues.Query, GetFacetWithValues.Variables>(
            GET_FACET_WITH_VALUES,
            {
                id: speakerTypeFacet.id,
            },
        );

        expect(result.facet!.name).toBe('Speaker Category');
    });

    describe('deletion', () => {
        let products: GetProductListWithVariants.Items[];

        beforeAll(async () => {
            // add the FacetValues to products and variants
            const result1 = await adminClient.query<GetProductListWithVariants.Query>(
                GET_PRODUCTS_LIST_WITH_VARIANTS,
            );
            products = result1.products.items;

            await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(UPDATE_PRODUCT, {
                input: {
                    id: products[0].id,
                    facetValueIds: [speakerTypeFacet.values[0].id],
                },
            });

            await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                UPDATE_PRODUCT_VARIANTS,
                {
                    input: [
                        {
                            id: products[0].variants[0].id,
                            facetValueIds: [speakerTypeFacet.values[0].id],
                        },
                    ],
                },
            );

            await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(UPDATE_PRODUCT, {
                input: {
                    id: products[1].id,
                    facetValueIds: [speakerTypeFacet.values[1].id],
                },
            });
        });

        it('deleteFacetValues deletes unused facetValue', async () => {
            const facetValueToDelete = speakerTypeFacet.values[2];
            const result1 = await adminClient.query<DeleteFacetValues.Mutation, DeleteFacetValues.Variables>(
                DELETE_FACET_VALUES,
                {
                    ids: [facetValueToDelete.id],
                    force: false,
                },
            );
            const result2 = await adminClient.query<GetFacetWithValues.Query, GetFacetWithValues.Variables>(
                GET_FACET_WITH_VALUES,
                {
                    id: speakerTypeFacet.id,
                },
            );

            expect(result1.deleteFacetValues).toEqual([
                {
                    result: DeletionResult.DELETED,
                    message: ``,
                },
            ]);

            expect(result2.facet!.values[0]).not.toEqual(facetValueToDelete);
        });

        it('deleteFacetValues for FacetValue in use returns NOT_DELETED', async () => {
            const facetValueToDelete = speakerTypeFacet.values[0];
            const result1 = await adminClient.query<DeleteFacetValues.Mutation, DeleteFacetValues.Variables>(
                DELETE_FACET_VALUES,
                {
                    ids: [facetValueToDelete.id],
                    force: false,
                },
            );
            const result2 = await adminClient.query<GetFacetWithValues.Query, GetFacetWithValues.Variables>(
                GET_FACET_WITH_VALUES,
                {
                    id: speakerTypeFacet.id,
                },
            );

            expect(result1.deleteFacetValues).toEqual([
                {
                    result: DeletionResult.NOT_DELETED,
                    message: `The selected FacetValue is assigned to 1 Product, 1 ProductVariant`,
                },
            ]);

            expect(result2.facet!.values.find(v => v.id === facetValueToDelete.id)).toBeDefined();
        });

        it('deleteFacetValues for FacetValue in use can be force deleted', async () => {
            const facetValueToDelete = speakerTypeFacet.values[0];
            const result1 = await adminClient.query<DeleteFacetValues.Mutation, DeleteFacetValues.Variables>(
                DELETE_FACET_VALUES,
                {
                    ids: [facetValueToDelete.id],
                    force: true,
                },
            );

            expect(result1.deleteFacetValues).toEqual([
                {
                    result: DeletionResult.DELETED,
                    message: `The selected FacetValue was removed from 1 Product, 1 ProductVariant and deleted`,
                },
            ]);

            // FacetValue no longer in the Facet.values array
            const result2 = await adminClient.query<GetFacetWithValues.Query, GetFacetWithValues.Variables>(
                GET_FACET_WITH_VALUES,
                {
                    id: speakerTypeFacet.id,
                },
            );
            expect(result2.facet!.values[0]).not.toEqual(facetValueToDelete);

            // FacetValue no longer in the Product.facetValues array
            const result3 = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: products[0].id,
            });
            expect(result3.product!.facetValues).toEqual([]);
        });

        it('deleteFacet that is in use returns NOT_DELETED', async () => {
            const result1 = await adminClient.query<DeleteFacet.Mutation, DeleteFacet.Variables>(
                DELETE_FACET,
                {
                    id: speakerTypeFacet.id,
                    force: false,
                },
            );
            const result2 = await adminClient.query<GetFacetWithValues.Query, GetFacetWithValues.Variables>(
                GET_FACET_WITH_VALUES,
                {
                    id: speakerTypeFacet.id,
                },
            );

            expect(result1.deleteFacet).toEqual({
                result: DeletionResult.NOT_DELETED,
                message: `The selected Facet includes FacetValues which are assigned to 1 Product`,
            });

            expect(result2.facet).not.toBe(null);
        });

        it('deleteFacet that is in use can be force deleted', async () => {
            const result1 = await adminClient.query<DeleteFacet.Mutation, DeleteFacet.Variables>(
                DELETE_FACET,
                {
                    id: speakerTypeFacet.id,
                    force: true,
                },
            );

            expect(result1.deleteFacet).toEqual({
                result: DeletionResult.DELETED,
                message: `The Facet was deleted and its FacetValues were removed from 1 Product`,
            });

            // FacetValue no longer in the Facet.values array
            const result2 = await adminClient.query<GetFacetWithValues.Query, GetFacetWithValues.Variables>(
                GET_FACET_WITH_VALUES,
                {
                    id: speakerTypeFacet.id,
                },
            );
            expect(result2.facet).toBe(null);

            // FacetValue no longer in the Product.facetValues array
            const result3 = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: products[1].id,
            });
            expect(result3.product!.facetValues).toEqual([]);
        });

        it('deleteFacet with no FacetValues works', async () => {
            const { createFacet } = await adminClient.query<CreateFacet.Mutation, CreateFacet.Variables>(
                CREATE_FACET,
                {
                    input: {
                        code: 'test',
                        isPrivate: false,
                        translations: [{ languageCode: LanguageCode.en, name: 'Test' }],
                    },
                },
            );
            const result = await adminClient.query<DeleteFacet.Mutation, DeleteFacet.Variables>(
                DELETE_FACET,
                {
                    id: createFacet.id,
                    force: false,
                },
            );
            expect(result.deleteFacet.result).toBe(DeletionResult.DELETED);
        });
    });

    describe('channels', () => {
        const SECOND_CHANNEL_TOKEN = 'second_channel_token';
        let createdFacet: CreateFacet.CreateFacet;

        beforeAll(async () => {
            const { createChannel } = await adminClient.query<
                CreateChannel.Mutation,
                CreateChannel.Variables
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

            const { assignProductsToChannel } = await adminClient.query<
                AssignProductsToChannel.Mutation,
                AssignProductsToChannel.Variables
            >(ASSIGN_PRODUCT_TO_CHANNEL, {
                input: {
                    channelId: (createChannel as ChannelFragment).id,
                    productIds: ['T_1'],
                    priceFactor: 0.5,
                },
            });

            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
        });

        it('create Facet in channel', async () => {
            const { createFacet } = await adminClient.query<CreateFacet.Mutation, CreateFacet.Variables>(
                CREATE_FACET,
                {
                    input: {
                        isPrivate: false,
                        code: 'channel-facet',
                        translations: [{ languageCode: LanguageCode.en, name: 'Channel Facet' }],
                        values: [
                            {
                                code: 'channel-value-1',
                                translations: [{ languageCode: LanguageCode.en, name: 'Channel Value 1' }],
                            },
                            {
                                code: 'channel-value-2',
                                translations: [{ languageCode: LanguageCode.en, name: 'Channel Value 2' }],
                            },
                        ],
                    },
                },
            );

            expect(createFacet.code).toBe('channel-facet');

            createdFacet = createFacet;
        });

        it('facets list in channel', async () => {
            const result = await adminClient.query<GetFacetList.Query>(GET_FACET_LIST);

            const { items } = result.facets;
            expect(items.length).toBe(1);
            expect(items.map(i => i.code)).toEqual(['channel-facet']);
        });

        it('Product.facetValues in channel', async () => {
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(UPDATE_PRODUCT, {
                input: {
                    id: 'T_1',
                    facetValueIds: [brandFacet.values[0].id, ...createdFacet.values.map(v => v.id)],
                },
            });
            await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                UPDATE_PRODUCT_VARIANTS,
                {
                    input: [
                        {
                            id: 'T_1',
                            facetValueIds: [brandFacet.values[0].id, ...createdFacet.values.map(v => v.id)],
                        },
                    ],
                },
            );

            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { product } = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: 'T_1',
            });

            expect(product?.facetValues.map(fv => fv.code).sort()).toEqual([
                'channel-value-1',
                'channel-value-2',
            ]);
        });

        it('ProductVariant.facetValues in channel', async () => {
            const { product } = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: 'T_1',
            });

            expect(product?.variants[0].facetValues.map(fv => fv.code).sort()).toEqual([
                'channel-value-1',
                'channel-value-2',
            ]);
        });

        it('updating Product facetValuesIds in channel only affects that channel', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            await adminClient.query<UpdateProduct.Mutation, UpdateProduct.Variables>(UPDATE_PRODUCT, {
                input: {
                    id: 'T_1',
                    facetValueIds: [createdFacet.values[0].id],
                },
            });

            const { product: productC2 } = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: 'T_1',
            });

            expect(productC2?.facetValues.map(fv => fv.code)).toEqual([createdFacet.values[0].code]);

            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { product: productCD } = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: 'T_1',
            });

            expect(productCD?.facetValues.map(fv => fv.code)).toEqual([
                brandFacet.values[0].code,
                createdFacet.values[0].code,
            ]);
        });

        it('updating ProductVariant facetValuesIds in channel only affects that channel', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                UPDATE_PRODUCT_VARIANTS,
                {
                    input: [
                        {
                            id: 'T_1',
                            facetValueIds: [createdFacet.values[0].id],
                        },
                    ],
                },
            );

            const { product: productC2 } = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: 'T_1',
            });

            expect(productC2?.variants.find(v => v.id === 'T_1')?.facetValues.map(fv => fv.code)).toEqual([
                createdFacet.values[0].code,
            ]);

            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { product: productCD } = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: 'T_1',
            });

            expect(productCD?.variants.find(v => v.id === 'T_1')?.facetValues.map(fv => fv.code)).toEqual([
                brandFacet.values[0].code,
                createdFacet.values[0].code,
            ]);
        });

        it(
            'attempting to create FacetValue in Facet from another Channel throws',
            assertThrowsWithMessage(async () => {
                adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
                await adminClient.query<CreateFacetValues.Mutation, CreateFacetValues.Variables>(
                    CREATE_FACET_VALUES,
                    {
                        input: [
                            {
                                facetId: brandFacet.id,
                                code: 'channel-brand',
                                translations: [{ languageCode: LanguageCode.en, name: 'Channel Brand' }],
                            },
                        ],
                    },
                );
            }, `No Facet with the id '1' could be found`),
        );
    });

    // https://github.com/vendure-ecommerce/vendure/issues/715
    describe('code conflicts', () => {
        function createFacetWithCode(code: string) {
            return adminClient.query<CreateFacet.Mutation, CreateFacet.Variables>(CREATE_FACET, {
                input: {
                    isPrivate: false,
                    code,
                    translations: [{ languageCode: LanguageCode.en, name: `Test Facet (${code})` }],
                    values: [],
                },
            });
        }

        // https://github.com/vendure-ecommerce/vendure/issues/831
        it('updateFacet with unchanged code', async () => {
            const { createFacet } = await createFacetWithCode('some-new-facet');
            const result = await adminClient.query<UpdateFacet.Mutation, UpdateFacet.Variables>(
                UPDATE_FACET,
                {
                    input: {
                        id: createFacet.id,
                        code: createFacet.code,
                    },
                },
            );

            expect(result.updateFacet.code).toBe(createFacet.code);
        });

        it('createFacet with conflicting slug gets renamed', async () => {
            const { createFacet: result1 } = await createFacetWithCode('test');
            expect(result1.code).toBe('test');

            const { createFacet: result2 } = await createFacetWithCode('test');
            expect(result2.code).toBe('test-2');
        });

        it('updateFacet with conflicting slug gets renamed', async () => {
            const { createFacet } = await createFacetWithCode('foo');
            expect(createFacet.code).toBe('foo');

            const { updateFacet } = await adminClient.query<UpdateFacet.Mutation, UpdateFacet.Variables>(
                UPDATE_FACET,
                {
                    input: {
                        id: createFacet.id,
                        code: 'test-2',
                    },
                },
            );

            expect(updateFacet.code).toBe('test-3');
        });
    });
});

export const GET_FACET_WITH_VALUES = gql`
    query GetFacetWithValues($id: ID!) {
        facet(id: $id) {
            ...FacetWithValues
        }
    }
    ${FACET_WITH_VALUES_FRAGMENT}
`;

const DELETE_FACET_VALUES = gql`
    mutation DeleteFacetValues($ids: [ID!]!, $force: Boolean) {
        deleteFacetValues(ids: $ids, force: $force) {
            result
            message
        }
    }
`;

const DELETE_FACET = gql`
    mutation DeleteFacet($id: ID!, $force: Boolean) {
        deleteFacet(id: $id, force: $force) {
            result
            message
        }
    }
`;

const GET_PRODUCTS_LIST_WITH_VARIANTS = gql`
    query GetProductListWithVariants {
        products {
            items {
                id
                name
                variants {
                    id
                    name
                }
            }
            totalItems
        }
    }
`;

export const CREATE_FACET_VALUES = gql`
    mutation CreateFacetValues($input: [CreateFacetValueInput!]!) {
        createFacetValues(input: $input) {
            ...FacetValue
        }
    }
    ${FACET_VALUE_FRAGMENT}
`;

export const UPDATE_FACET_VALUES = gql`
    mutation UpdateFacetValues($input: [UpdateFacetValueInput!]!) {
        updateFacetValues(input: $input) {
            ...FacetValue
        }
    }
    ${FACET_VALUE_FRAGMENT}
`;
