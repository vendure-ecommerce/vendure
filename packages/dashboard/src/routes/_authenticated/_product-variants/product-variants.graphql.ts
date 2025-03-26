import { assetFragment } from '@/graphql/fragments.js';
import { graphql } from '@/graphql/graphql.js';

export const productVariantListDocument = graphql(
    `
        query ProductVariantLis($options: ProductVariantListOptions) {
            productVariants(options: $options) {
                items {
                    id
                    createdAt
                    updatedAt
                    featuredAsset {
                        ...Asset
                    }
                    name
                    sku
                    currencyCode
                    price
                    priceWithTax
                    stockLevels {
                        id
                        stockOnHand
                        stockAllocated
                    }
                    customFields
                }
                totalItems
            }
        }
    `,
    [assetFragment],
);

export const productVariantDetailDocument = graphql(
    `
        query ProductVariantDetail($id: ID!) {
            productVariant(id: $id) {
                id
                createdAt
                updatedAt
                product {
                    id
                    name
                }
                enabled
                featuredAsset {
                    ...Asset
                }
                assets {
                    ...Asset
                }
                facetValues {
                    id
                    code
                    name
                    facet {
                        id
                        code
                        name
                    }
                }
                translations {
                    id
                    languageCode
                    name
                }
                name
                sku
                currencyCode
                taxCategory {
                    id
                    name
                    isDefault
                }
                price
                priceWithTax
                prices {
                    currencyCode
                    price
                    customFields
                }
                trackInventory
                outOfStockThreshold
                stockLevels {
                    id
                    stockOnHand
                    stockAllocated
                    stockLocation {
                        id
                        name
                    }
                }
                customFields
            }
        }
    `,
    [assetFragment],
);

export const createProductVariantDocument = graphql(`
    mutation CreateProductVariant($input: [CreateProductVariantInput!]!) {
        createProductVariants(input: $input) {
            id
        }
    }
`);

export const updateProductVariantDocument = graphql(`
    mutation UpdateProductVariant($input: UpdateProductVariantInput!) {
        updateProductVariant(input: $input) {
            id
        }
    }
`);
