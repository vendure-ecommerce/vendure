/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { facetValueCollectionFilter, JobQueueService } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { LanguageCode } from './graphql/generated-e2e-admin-types';
import * as Codegen from './graphql/generated-e2e-admin-types';
import {
    CREATE_COLLECTION,
    CREATE_FACET,
    GET_FACET_LIST,
    GET_PRODUCT_SIMPLE,
    GET_PRODUCT_WITH_VARIANTS,
    UPDATE_COLLECTION,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_VARIANTS,
} from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';
import { awaitRunningJobs } from './utils/await-running-jobs';

describe('Shop catalog', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(testConfig());

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

    describe('products', () => {
        beforeAll(async () => {
            // disable the first product
            await adminClient.query<Codegen.DisableProductMutation, Codegen.DisableProductMutationVariables>(
                DISABLE_PRODUCT,
                {
                    id: 'T_1',
                },
            );

            const monitorProduct = await adminClient.query<
                Codegen.GetProductWithVariantsQuery,
                Codegen.GetProductWithVariantsQueryVariables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: 'T_2',
            });
            if (monitorProduct.product) {
                await adminClient.query<
                    Codegen.UpdateProductVariantsMutation,
                    Codegen.UpdateProductVariantsMutationVariables
                >(UPDATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            id: monitorProduct.product.variants[0].id,
                            enabled: false,
                        },
                    ],
                });
            }
        });

        it('products list omits disabled products', async () => {
            const result = await shopClient.query<Codegen.GetProductsTake3Query>(gql`
                query GetProductsTake3 {
                    products(options: { take: 3 }) {
                        items {
                            id
                        }
                    }
                }
            `);

            expect(result.products.items.map(item => item.id).sort()).toEqual(['T_2', 'T_3', 'T_4']);
        });

        it('by id', async () => {
            const { product } = await shopClient.query<
                Codegen.GetProductSimpleQuery,
                Codegen.GetProductSimpleQueryVariables
            >(GET_PRODUCT_SIMPLE, { id: 'T_2' });

            if (!product) {
                fail('Product not found');
                return;
            }
            expect(product.id).toBe('T_2');
        });

        it('by slug', async () => {
            const { product } = await shopClient.query<
                Codegen.GetProductSimpleQuery,
                Codegen.GetProductSimpleQueryVariables
            >(GET_PRODUCT_SIMPLE, { slug: 'curvy-monitor' });

            if (!product) {
                fail('Product not found');
                return;
            }
            expect(product.slug).toBe('curvy-monitor');
        });

        it(
            'throws if neither id nor slug provided',
            assertThrowsWithMessage(async () => {
                await shopClient.query<Codegen.GetProductSimpleQuery, Codegen.GetProductSimpleQueryVariables>(
                    GET_PRODUCT_SIMPLE,
                    {},
                );
            }, 'Either the Product id or slug must be provided'),
        );

        it('product returns null for disabled product', async () => {
            const result = await shopClient.query<Codegen.GetProduct1Query>(gql`
                query GetProduct1 {
                    product(id: "T_1") {
                        id
                    }
                }
            `);

            expect(result.product).toBeNull();
        });

        it('omits disabled variants from product response', async () => {
            const result = await shopClient.query<Codegen.GetProduct2VariantsQuery>(gql`
                query GetProduct2Variants {
                    product(id: "T_2") {
                        id
                        variants {
                            id
                            name
                        }
                    }
                }
            `);

            expect(result.product!.variants).toEqual([{ id: 'T_6', name: 'Curvy Monitor 27 inch' }]);
        });
    });

    describe('facets', () => {
        let facetValue: Codegen.FacetWithValuesFragment;

        beforeAll(async () => {
            const result = await adminClient.query<
                Codegen.CreateFacetMutation,
                Codegen.CreateFacetMutationVariables
            >(CREATE_FACET, {
                input: {
                    code: 'profit-margin',
                    isPrivate: true,
                    translations: [{ languageCode: LanguageCode.en, name: 'Profit Margin' }],
                    values: [
                        {
                            code: 'massive',
                            translations: [{ languageCode: LanguageCode.en, name: 'massive' }],
                        },
                    ],
                },
            });
            facetValue = result.createFacet.values[0];

            await adminClient.query<Codegen.UpdateProductMutation, Codegen.UpdateProductMutationVariables>(
                UPDATE_PRODUCT,
                {
                    input: {
                        id: 'T_2',
                        facetValueIds: [facetValue.id],
                    },
                },
            );

            await adminClient.query<
                Codegen.UpdateProductVariantsMutation,
                Codegen.UpdateProductVariantsMutationVariables
            >(UPDATE_PRODUCT_VARIANTS, {
                input: [
                    {
                        id: 'T_6',
                        facetValueIds: [facetValue.id],
                    },
                ],
            });
        });

        it('omits private Product.facetValues', async () => {
            const result = await shopClient.query<
                Codegen.GetProductFacetValuesQuery,
                Codegen.GetProductFacetValuesQueryVariables
            >(GET_PRODUCT_FACET_VALUES, {
                id: 'T_2',
            });

            expect(result.product!.facetValues.map(fv => fv.name)).toEqual([]);
        });

        it('omits private ProductVariant.facetValues', async () => {
            const result = await shopClient.query<
                Codegen.GetVariantFacetValuesQuery,
                Codegen.GetVariantFacetValuesQueryVariables
            >(GET_PRODUCT_VARIANT_FACET_VALUES, {
                id: 'T_2',
            });

            expect(result.product!.variants[0].facetValues.map(fv => fv.name)).toEqual([]);
        });
    });

    describe('collections', () => {
        let collection: Codegen.CreateCollectionMutation['createCollection'];

        async function createNewCollection(name: string, isPrivate: boolean, parentId?: string) {
            return await adminClient.query<
                Codegen.CreateCollectionMutation,
                Codegen.CreateCollectionMutationVariables
            >(CREATE_COLLECTION, {
                input: {
                    translations: [
                        {
                            languageCode: LanguageCode.en,
                            name,
                            description: '',
                            slug: name,
                        },
                    ],
                    isPrivate,
                    parentId,
                    filters: [],
                },
            });
        }

        beforeAll(async () => {
            const result = await adminClient.query<Codegen.GetFacetListQuery>(GET_FACET_LIST);
            const category = result.facets.items[0];
            const sportsEquipment = category.values.find(v => v.code === 'sports-equipment')!;
            const { createCollection } = await adminClient.query<
                Codegen.CreateCollectionMutation,
                Codegen.CreateCollectionMutationVariables
            >(CREATE_COLLECTION, {
                input: {
                    filters: [
                        {
                            code: facetValueCollectionFilter.code,
                            arguments: [
                                {
                                    name: 'facetValueIds',
                                    value: `["${sportsEquipment.id}"]`,
                                },
                                {
                                    name: 'containsAny',
                                    value: 'false',
                                },
                            ],
                        },
                    ],
                    translations: [
                        {
                            languageCode: LanguageCode.en,
                            name: 'My Collection',
                            description: '',
                            slug: 'my-collection',
                        },
                    ],
                },
            });
            collection = createCollection;
            await awaitRunningJobs(adminClient);
        });

        it('returns collection with variants', async () => {
            const result = await shopClient.query<
                Codegen.GetCollectionVariantsQuery,
                Codegen.GetCollectionVariantsQueryVariables
            >(GET_COLLECTION_VARIANTS, { id: collection.id });
            expect(result.collection!.productVariants.items).toEqual([
                { id: 'T_22', name: 'Road Bike' },
                { id: 'T_23', name: 'Skipping Rope' },
                { id: 'T_24', name: 'Boxing Gloves' },
                { id: 'T_25', name: 'Tent' },
                { id: 'T_26', name: 'Cruiser Skateboard' },
                { id: 'T_27', name: 'Football' },
                { id: 'T_28', name: 'Running Shoe Size 40' },
                { id: 'T_29', name: 'Running Shoe Size 42' },
                { id: 'T_30', name: 'Running Shoe Size 44' },
                { id: 'T_31', name: 'Running Shoe Size 46' },
            ]);
        });

        it('collection by slug', async () => {
            const result = await shopClient.query<
                Codegen.GetCollectionVariantsQuery,
                Codegen.GetCollectionVariantsQueryVariables
            >(GET_COLLECTION_VARIANTS, { slug: collection.slug });
            expect(result.collection?.id).toBe(collection.id);
        });

        it('omits variants from disabled products', async () => {
            await adminClient.query<Codegen.DisableProductMutation, Codegen.DisableProductMutationVariables>(
                DISABLE_PRODUCT,
                {
                    id: 'T_17',
                },
            );
            await awaitRunningJobs(adminClient);

            const result = await shopClient.query<
                Codegen.GetCollectionVariantsQuery,
                Codegen.GetCollectionVariantsQueryVariables
            >(GET_COLLECTION_VARIANTS, { id: collection.id });
            expect(result.collection!.productVariants.items).toEqual([
                { id: 'T_22', name: 'Road Bike' },
                { id: 'T_23', name: 'Skipping Rope' },
                { id: 'T_24', name: 'Boxing Gloves' },
                { id: 'T_25', name: 'Tent' },
                { id: 'T_26', name: 'Cruiser Skateboard' },
                { id: 'T_27', name: 'Football' },
            ]);
        });

        it('omits disabled product variants', async () => {
            await adminClient.query<
                Codegen.UpdateProductVariantsMutation,
                Codegen.UpdateProductVariantsMutationVariables
            >(UPDATE_PRODUCT_VARIANTS, {
                input: [{ id: 'T_22', enabled: false }],
            });
            await awaitRunningJobs(adminClient);

            const result = await shopClient.query<
                Codegen.GetCollectionVariantsQuery,
                Codegen.GetCollectionVariantsQueryVariables
            >(GET_COLLECTION_VARIANTS, { id: collection.id });
            expect(result.collection!.productVariants.items).toEqual([
                { id: 'T_23', name: 'Skipping Rope' },
                { id: 'T_24', name: 'Boxing Gloves' },
                { id: 'T_25', name: 'Tent' },
                { id: 'T_26', name: 'Cruiser Skateboard' },
                { id: 'T_27', name: 'Football' },
            ]);
        });

        it('collection list', async () => {
            const result = await shopClient.query<Codegen.GetCollectionListQuery>(GET_COLLECTION_LIST);

            expect(result.collections.items).toEqual([
                { id: 'T_2', name: 'Plants' },
                { id: 'T_3', name: 'My Collection' },
            ]);
        });

        it('omits private collections', async () => {
            await adminClient.query<
                Codegen.UpdateCollectionMutation,
                Codegen.UpdateCollectionMutationVariables
            >(UPDATE_COLLECTION, {
                input: {
                    id: collection.id,
                    isPrivate: true,
                },
            });
            await awaitRunningJobs(adminClient);
            const result = await shopClient.query<Codegen.GetCollectionListQuery>(GET_COLLECTION_LIST);

            expect(result.collections.items).toEqual([{ id: 'T_2', name: 'Plants' }]);
        });

        it('returns null for private collection', async () => {
            const result = await shopClient.query<
                Codegen.GetCollectionVariantsQuery,
                Codegen.GetCollectionVariantsQueryVariables
            >(GET_COLLECTION_VARIANTS, { id: collection.id });

            expect(result.collection).toBeNull();
        });

        it('product.collections list omits private collections', async () => {
            const result = await shopClient.query<Codegen.GetProductCollectionQuery>(gql`
                query GetProductCollection {
                    product(id: "T_12") {
                        collections {
                            id
                            name
                        }
                    }
                }
            `);

            expect(result.product!.collections).toEqual([]);
        });

        it('private children not returned in Shop API', async () => {
            const { createCollection: parent } = await createNewCollection('public-parent', false);
            const { createCollection: child } = await createNewCollection('private-child', true, parent.id);

            const result = await shopClient.query<
                Codegen.GetCollectionQuery,
                Codegen.GetCollectionQueryVariables
            >(GET_COLLECTION_SHOP, {
                id: parent.id,
            });

            expect(result.collection?.children).toEqual([]);
        });

        it('private parent not returned in Shop API', async () => {
            const { createCollection: parent } = await createNewCollection('private-parent', true);
            const { createCollection: child } = await createNewCollection('public-child', false, parent.id);

            const result = await shopClient.query<
                Codegen.GetCollectionQuery,
                Codegen.GetCollectionQueryVariables
            >(GET_COLLECTION_SHOP, {
                id: child.id,
            });

            expect(result.collection?.parent).toBeNull();
        });
    });
});

const GET_COLLECTION_SHOP = gql`
    query GetCollectionShop($id: ID, $slug: String) {
        collection(id: $id, slug: $slug) {
            id
            name
            slug
            description
            parent {
                id
                name
            }
            children {
                id
                name
            }
        }
    }
`;

const DISABLE_PRODUCT = gql`
    mutation DisableProduct($id: ID!) {
        updateProduct(input: { id: $id, enabled: false }) {
            id
        }
    }
`;

const GET_COLLECTION_VARIANTS = gql`
    query GetCollectionVariants($id: ID, $slug: String) {
        collection(id: $id, slug: $slug) {
            id
            productVariants {
                items {
                    id
                    name
                }
            }
        }
    }
`;

const GET_COLLECTION_LIST = gql`
    query GetCollectionList {
        collections {
            items {
                id
                name
            }
        }
    }
`;

const GET_PRODUCT_FACET_VALUES = gql`
    query GetProductFacetValues($id: ID!) {
        product(id: $id) {
            id
            name
            facetValues {
                name
            }
        }
    }
`;

const GET_PRODUCT_VARIANT_FACET_VALUES = gql`
    query GetVariantFacetValues($id: ID!) {
        product(id: $id) {
            id
            name
            variants {
                id
                facetValues {
                    name
                }
            }
        }
    }
`;
