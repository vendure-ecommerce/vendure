import { graphql } from 'gql.tada';
import { describe, expect, it, vi } from 'vitest';

import { getListQueryFields } from './get-document-structure.js';

vi.mock('virtual:admin-api-schema', () => {
    return {
        schemaInfo: {
            types: {
                Query: {
                    products: ['ProductList', false, false, true],
                    product: ['Product', false, false, false],
                    collection: ['Collection', false, false, false],
                },
                Mutation: {},

                Collection: {
                    id: ['ID', false, false, false],
                    name: ['String', false, false, false],
                    productVariants: ['ProductVariantList', false, false, true],
                },

                ProductVariantList: {
                    items: ['ProductVariant', false, true, false],
                    totalItems: ['Int', false, false, false],
                },

                Product: {
                    channels: ['Channel', false, true, false],
                    id: ['ID', false, false, false],
                    createdAt: ['DateTime', false, false, false],
                    updatedAt: ['DateTime', false, false, false],
                    languageCode: ['LanguageCode', false, false, false],
                    name: ['String', false, false, false],
                    slug: ['String', false, false, false],
                    description: ['String', false, false, false],
                    enabled: ['Boolean', false, false, false],
                    featuredAsset: ['Asset', true, false, false],
                    assets: ['Asset', false, true, false],
                    variants: ['ProductVariant', false, true, false],
                    variantList: ['ProductVariantList', false, false, true],
                    optionGroups: ['ProductOptionGroup', false, true, false],
                    facetValues: ['FacetValue', false, true, false],
                    translations: ['ProductTranslation', false, true, false],
                    collections: ['Collection', false, true, false],
                    reviews: ['ProductReviewList', false, false, true],
                    reviewsHistogram: ['ProductReviewHistogramItem', false, true, false],
                    customFields: ['ProductCustomFields', true, false, false],
                },
                ProductVariantPrice: {
                    currencyCode: ['CurrencyCode', false, false, false],
                    price: ['Money', false, false, false],
                    customFields: ['JSON', true, false, false],
                },
                ProductVariant: {
                    enabled: ['Boolean', false, false, false],
                    trackInventory: ['GlobalFlag', false, false, false],
                    stockOnHand: ['Int', false, false, false],
                    stockAllocated: ['Int', false, false, false],
                    outOfStockThreshold: ['Int', false, false, false],
                    useGlobalOutOfStockThreshold: ['Boolean', false, false, false],
                    prices: ['ProductVariantPrice', false, true, false],
                    stockLevels: ['StockLevel', false, true, false],
                    stockMovements: ['StockMovementList', false, false, false],
                    channels: ['Channel', false, true, false],
                    id: ['ID', false, false, false],
                    product: ['Product', false, false, false],
                    productId: ['ID', false, false, false],
                    createdAt: ['DateTime', false, false, false],
                    updatedAt: ['DateTime', false, false, false],
                    languageCode: ['LanguageCode', false, false, false],
                    sku: ['String', false, false, false],
                    name: ['String', false, false, false],
                    featuredAsset: ['Asset', true, false, false],
                    assets: ['Asset', false, true, false],
                    price: ['Money', false, false, false],
                    currencyCode: ['CurrencyCode', false, false, false],
                    priceWithTax: ['Money', false, false, false],
                    stockLevel: ['String', false, false, false],
                    taxRateApplied: ['TaxRate', false, false, false],
                    taxCategory: ['TaxCategory', false, false, false],
                    options: ['ProductOption', false, true, false],
                    facetValues: ['FacetValue', false, true, false],
                    translations: ['ProductVariantTranslation', false, true, false],
                    customFields: ['JSON', true, false, false],
                },
                ProductCustomFields: {
                    custom1: ['String', false, false, false],
                },

                Asset: {
                    id: ['ID', false, false, false],
                    createdAt: ['DateTime', false, false, false],
                    updatedAt: ['DateTime', false, false, false],
                    name: ['String', false, false, false],
                    type: ['AssetType', false, false, false],
                    fileSize: ['Int', false, false, false],
                    mimeType: ['String', false, false, false],
                    width: ['Int', false, false, false],
                    height: ['Int', false, false, false],
                    source: ['String', false, false, false],
                    preview: ['String', false, false, false],
                    focalPoint: ['Coordinate', true, false, false],
                    tags: ['Tag', false, true, false],
                    customFields: ['JSON', true, false, false],
                },
                ProductTranslation: {
                    id: ['ID', false, false, false],
                    createdAt: ['DateTime', false, false, false],
                    updatedAt: ['DateTime', false, false, false],
                    languageCode: ['LanguageCode', false, false, false],
                    name: ['String', false, false, false],
                    slug: ['String', false, false, false],
                    description: ['String', false, false, false],
                    customFields: ['ProductTranslationCustomFields', true, false, false],
                },
                ProductList: {
                    items: ['Product', false, true, false],
                    totalItems: ['Int', false, false, false],
                },

                ProductVariantTranslation: {
                    id: ['ID', false, false, false],
                    createdAt: ['DateTime', false, false, false],
                    updatedAt: ['DateTime', false, false, false],
                    languageCode: ['LanguageCode', false, false, false],
                    name: ['String', false, false, false],
                },
            },
            inputs: {},
            scalars: ['ID', 'String', 'Int', 'Boolean', 'Float', 'JSON', 'DateTime', 'Upload', 'Money'],
            enums: {},
        },
    };
});

describe('getListQueryFields', () => {
    it('should extract fields from a simple paginated list query', () => {
        const doc = graphql(`
            query {
                products {
                    items {
                        id
                        name
                    }
                }
            }
        `);

        const fields = getListQueryFields(doc);
        expect(fields).toEqual([
            {
                isPaginatedList: false,
                isScalar: true,
                list: false,
                name: 'id',
                nullable: false,
                type: 'ID',
            },
            {
                isPaginatedList: false,
                isScalar: true,
                list: false,
                name: 'name',
                nullable: false,
                type: 'String',
            },
        ]);
    });

    it('should handle a fragment of the main entity in the query', () => {
        const doc = graphql(`
            query {
                products {
                    items {
                        ...ProductFields
                    }
                }
            }

            fragment ProductFields on Product {
                id
                name
            }
        `);

        const fields = getListQueryFields(doc);
        expect(fields).toEqual([
            {
                isPaginatedList: false,
                isScalar: true,
                list: false,
                name: 'id',
                nullable: false,
                type: 'ID',
            },
            {
                isPaginatedList: false,
                isScalar: true,
                list: false,
                name: 'name',
                nullable: false,
                type: 'String',
            },
        ]);
    });

    it('should handle a fragment of a nested entity in the query', () => {
        const doc = graphql(/* graphql*/ `
            query {
                products {
                    items {
                        id
                        featuredAsset {
                            ...Asset
                        }
                    }
                }
            }

            fragment Asset on Asset {
                preview
            }
        `);

        const fields = getListQueryFields(doc);
        expect(fields).toEqual([
            {
                isPaginatedList: false,
                isScalar: true,
                list: false,
                name: 'id',
                nullable: false,
                type: 'ID',
            },
            {
                isPaginatedList: false,
                isScalar: false,
                list: false,
                name: 'featuredAsset',
                nullable: true,
                type: 'Asset',
            },
        ]);
    });

    it('should return empty array for non-paginated queries', () => {
        const doc = graphql(`
            query {
                product {
                    id
                }
            }
        `);

        const fields = getListQueryFields(doc);
        expect(fields).toEqual([]);
    });

    it('should handle empty items selection set', () => {
        const doc = graphql(`
            query {
                products {
                    totalItems
                }
            }
        `);

        const fields = getListQueryFields(doc);
        expect(fields).toEqual([]);
    });

    it('should handle a fragment of a nested entity in the query', () => {
        const doc = graphql(/* graphql*/ `
            query GetCollectionWithProductVariants {
                collection {
                    id
                    name
                    productVariants {
                        items {
                            id
                            sku
                        }
                        totalItems
                    }
                }
            }
        `);

        const fields = getListQueryFields(doc);
        expect(fields).toEqual([
            {
                isPaginatedList: false,
                isScalar: true,
                list: false,
                name: 'id',
                nullable: false,
                type: 'ID',
            },
            {
                isPaginatedList: false,
                isScalar: true,
                list: false,
                name: 'sku',
                nullable: false,
                type: 'String',
            },
        ]);
    });
});
