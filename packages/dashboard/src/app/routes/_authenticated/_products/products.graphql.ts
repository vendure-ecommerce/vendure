import { assetFragment } from '@/graphql/fragments.js';
import { graphql } from '@/graphql/graphql.js';

export const productListDocument = graphql(`
    query ProductList($options: ProductListOptions) {
        products(options: $options) {
            items {
                id
                createdAt
                updatedAt
                featuredAsset {
                    id
                    preview
                }
                name
                slug
                enabled
            }
            totalItems
        }
    }
`);

export const productDetailFragment = graphql(
    `
        fragment ProductDetail on Product {
            id
            createdAt
            updatedAt
            enabled
            name
            slug
            description
            featuredAsset {
                ...Asset
            }
            assets {
                ...Asset
            }
            translations {
                id
                languageCode
                name
                slug
                description
            }

            facetValues {
                id
                name
                code
                facet {
                    id
                    name
                    code
                }
            }
            customFields
        }
    `,
    [assetFragment],
);

export const productVariantListDocument = graphql(`
    query ProductVariantList($options: ProductVariantListOptions, $productId: ID) {
        productVariants(options: $options, productId: $productId) {
            items {
                id
                name
                sku
                currencyCode
                price
                priceWithTax
                stockLevels {
                    stockOnHand
                    stockAllocated
                }
            }
            totalItems
        }
    }
`);

export const productDetailDocument = graphql(
    `
        query ProductDetail($id: ID!) {
            product(id: $id) {
                ...ProductDetail
                variantList {
                    totalItems
                }
            }
        }
    `,
    [productDetailFragment],
);

export const createProductDocument = graphql(`
    mutation CreateProduct($input: CreateProductInput!) {
        createProduct(input: $input) {
            id
        }
    }
`);

export const updateProductDocument = graphql(`
    mutation UpdateProduct($input: UpdateProductInput!) {
        updateProduct(input: $input) {
            id
        }
    }
`);

export const deleteProductDocument = graphql(`
    mutation DeleteProduct($id: ID!) {
        deleteProduct(id: $id) {
            result
            message
        }
    }
`);

export const deleteProductsDocument = graphql(`
    mutation DeleteProducts($ids: [ID!]!) {
        deleteProducts(ids: $ids) {
            result
            message
        }
    }
`);

export const assignProductsToChannelDocument = graphql(`
    mutation AssignProductsToChannel($input: AssignProductsToChannelInput!) {
        assignProductsToChannel(input: $input) {
            id
            channels {
                id
                code
            }
        }
    }
`);

export const removeProductsFromChannelDocument = graphql(`
    mutation RemoveProductsFromChannel($input: RemoveProductsFromChannelInput!) {
        removeProductsFromChannel(input: $input) {
            id
            channels {
                id
                code
            }
        }
    }
`);

export const updateProductsDocument = graphql(`
    mutation UpdateProducts($input: [UpdateProductInput!]!) {
        updateProducts(input: $input) {
            id
            name
            facetValues {
                id
                name
                code
            }
        }
    }
`);

export const getProductsWithFacetValuesByIdsDocument = graphql(`
    query GetProductsWithFacetValuesByIds($ids: [String!]!) {
        products(options: { filter: { id: { in: $ids } } }) {
            items {
                id
                name
                facetValues {
                    id
                    name
                    code
                    facet {
                        id
                        name
                        code
                    }
                }
            }
        }
    }
`);

export const duplicateEntityDocument = graphql(`
    mutation DuplicateEntity($input: DuplicateEntityInput!) {
        duplicateEntity(input: $input) {
            ... on DuplicateEntitySuccess {
                newEntityId
            }
            ... on ErrorResult {
                errorCode
                message
            }
            ... on DuplicateEntityError {
                duplicationError
            }
        }
    }
`);
