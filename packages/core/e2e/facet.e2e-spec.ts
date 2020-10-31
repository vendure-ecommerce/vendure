import { pick } from '@vendure/common/lib/pick';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import { FACET_VALUE_FRAGMENT, FACET_WITH_VALUES_FRAGMENT } from './graphql/fragments';
import {
    CreateFacet,
    CreateFacetValues,
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
    CREATE_FACET,
    GET_FACET_LIST,
    GET_PRODUCT_WITH_VARIANTS,
    UPDATE_FACET,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_VARIANTS,
} from './graphql/shared-definitions';

// tslint:disable:no-non-null-assertion

describe('Facet resolver', () => {
    const { server, adminClient } = createTestEnvironment(testConfig);

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
