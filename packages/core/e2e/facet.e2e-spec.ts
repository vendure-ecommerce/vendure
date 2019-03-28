import gql from 'graphql-tag';
import path from 'path';

import {
    CREATE_FACET,
    CREATE_FACET_VALUES,
    GET_FACET_LIST,
    GET_FACET_WITH_VALUES,
    UPDATE_FACET,
    UPDATE_FACET_VALUES,
} from '../../../admin-ui/src/app/data/definitions/facet-definitions';
import {
    GET_PRODUCT_LIST,
    GET_PRODUCT_WITH_VARIANTS,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_VARIANTS,
} from '../../../admin-ui/src/app/data/definitions/product-definitions';
import {
    CreateFacet,
    CreateFacetValues,
    DeletionResult,
    FacetWithValues,
    GetFacetList,
    GetFacetWithValues,
    GetProductList,
    GetProductWithVariants,
    LanguageCode,
    UpdateFacet,
    UpdateFacetValues,
    UpdateProduct,
    UpdateProductVariants,
} from '../../../shared/generated-types';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { TestAdminClient } from './test-client';
import { TestServer } from './test-server';

// tslint:disable:no-non-null-assertion

describe('Facet resolver', () => {
    const client = new TestAdminClient();
    const server = new TestServer();
    let brandFacet: FacetWithValues.Fragment;
    let speakerTypeFacet: FacetWithValues.Fragment;

    beforeAll(async () => {
        await server.init({
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await client.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('createFacet', async () => {
        const result = await client.query<CreateFacet.Mutation, CreateFacet.Variables>(CREATE_FACET, {
            input: {
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
        const result = await client.query<UpdateFacet.Mutation, UpdateFacet.Variables>(UPDATE_FACET, {
            input: {
                id: speakerTypeFacet.id,
                translations: [{ languageCode: LanguageCode.en, name: 'Speaker Category' }],
            },
        });

        expect(result.updateFacet.name).toBe('Speaker Category');
    });

    it('createFacetValues', async () => {
        const result = await client.query<CreateFacetValues.Mutation, CreateFacetValues.Variables>(
            CREATE_FACET_VALUES,
            {
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
            },
        );

        expect(result.createFacetValues).toMatchSnapshot();
    });

    it('updateFacetValues', async () => {
        const result = await client.query<UpdateFacetValues.Mutation, UpdateFacetValues.Variables>(
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
        const result = await client.query<GetFacetList.Query>(GET_FACET_LIST);

        const { items } = result.facets;
        expect(items.length).toBe(2);
        expect(items[0].name).toBe('category');
        expect(items[1].name).toBe('Speaker Category');

        brandFacet = items[0];
        speakerTypeFacet = items[1];
    });

    it('facet', async () => {
        const result = await client.query<GetFacetWithValues.Query, GetFacetWithValues.Variables>(
            GET_FACET_WITH_VALUES,
            {
                id: speakerTypeFacet.id,
            },
        );

        expect(result.facet!.name).toBe('Speaker Category');
    });

    describe('deletion', () => {
        let products: Array<GetProductList.Items & { variants: Array<{ id: string; name: string }> }>;

        beforeAll(async () => {
            // add the FacetValues to products and variants
            const result1 = await client.query(GET_PRODUCTS_LIST_WITH_VARIANTS);
            products = result1.products.items;

            await client.query<UpdateProduct.Mutation, UpdateProduct.Variables>(UPDATE_PRODUCT, {
                input: {
                    id: products[0].id,
                    facetValueIds: [speakerTypeFacet.values[0].id],
                },
            });

            await client.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
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

            await client.query<UpdateProduct.Mutation, UpdateProduct.Variables>(UPDATE_PRODUCT, {
                input: {
                    id: products[1].id,
                    facetValueIds: [speakerTypeFacet.values[1].id],
                },
            });
        });

        it('deleteFacetValues deletes unused facetValue', async () => {
            const facetValueToDelete = speakerTypeFacet.values[2];
            const result1 = await client.query(DELETE_FACET_VALUES, {
                ids: [facetValueToDelete.id],
                force: false,
            });
            const result2 = await client.query<GetFacetWithValues.Query, GetFacetWithValues.Variables>(
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
            const result1 = await client.query(DELETE_FACET_VALUES, {
                ids: [facetValueToDelete.id],
                force: false,
            });
            const result2 = await client.query<GetFacetWithValues.Query, GetFacetWithValues.Variables>(
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

            expect(result2.facet!.values[0]).toEqual(facetValueToDelete);
        });

        it('deleteFacetValues for FacetValue in use can be force deleted', async () => {
            const facetValueToDelete = speakerTypeFacet.values[0];
            const result1 = await client.query(DELETE_FACET_VALUES, {
                ids: [facetValueToDelete.id],
                force: true,
            });

            expect(result1.deleteFacetValues).toEqual([
                {
                    result: DeletionResult.DELETED,
                    message: `The selected FacetValue was removed from 1 Product, 1 ProductVariant and deleted`,
                },
            ]);

            // FacetValue no longer in the Facet.values array
            const result2 = await client.query<GetFacetWithValues.Query, GetFacetWithValues.Variables>(
                GET_FACET_WITH_VALUES,
                {
                    id: speakerTypeFacet.id,
                },
            );
            expect(result2.facet!.values[0]).not.toEqual(facetValueToDelete);

            // FacetValue no longer in the Product.facetValues array
            const result3 = await client.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: products[0].id,
            });
            expect(result3.product!.facetValues).toEqual([]);
        });

        it('deleteFacet that is in use returns NOT_DELETED', async () => {
            const result1 = await client.query(DELETE_FACET, { id: speakerTypeFacet.id, force: false });
            const result2 = await client.query<GetFacetWithValues.Query, GetFacetWithValues.Variables>(
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
            const result1 = await client.query(DELETE_FACET, { id: speakerTypeFacet.id, force: true });

            expect(result1.deleteFacet).toEqual({
                result: DeletionResult.DELETED,
                message: `The Facet was deleted and its FacetValues were removed from 1 Product`,
            });

            // FacetValue no longer in the Facet.values array
            const result2 = await client.query<GetFacetWithValues.Query, GetFacetWithValues.Variables>(
                GET_FACET_WITH_VALUES,
                {
                    id: speakerTypeFacet.id,
                },
            );
            expect(result2.facet).toBe(null);

            // FacetValue no longer in the Product.facetValues array
            const result3 = await client.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: products[1].id,
            });
            expect(result3.product!.facetValues).toEqual([]);
        });
    });
});

const DELETE_FACET_VALUES = gql`
    mutation DeleteFacetValue($ids: [ID!]!, $force: Boolean) {
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
