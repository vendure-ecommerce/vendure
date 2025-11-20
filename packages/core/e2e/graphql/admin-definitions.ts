import gql from 'graphql-tag';

import { countryFragment, orderWithModificationsFragment } from './fragments-admin';
import { graphql } from './graphql-admin';

export const searchProductsAdminDocument = graphql(`
    query SearchProductsAdmin($input: SearchInput!) {
        search(input: $input) {
            totalItems
            items {
                enabled
                productId
                productName
                slug
                description
                productVariantId
                productVariantName
                sku
            }
        }
    }
`);

export const getOrderWithSellerOrdersDocument = gql`
    query GetOrderWithSellerOrders($id: ID!) {
        order(id: $id) {
            id
            code
            state
            sellerOrders {
                id
                aggregateOrderId
                lines {
                    id
                    productVariant {
                        id
                        name
                    }
                }
                shippingLines {
                    id
                    shippingMethod {
                        id
                        code
                    }
                }
            }
            lines {
                id
                productVariant {
                    id
                    name
                }
            }
            shippingLines {
                id
                shippingMethod {
                    id
                    code
                }
            }
        }
    }
`;

export const disableProductDocument = graphql(`
    mutation DisableProduct($id: ID!) {
        updateProduct(input: { id: $id, enabled: false }) {
            id
        }
    }
`);

export const modifyOrderDocument = graphql(
    `
        mutation ModifyOrder($input: ModifyOrderInput!) {
            modifyOrder(input: $input) {
                ...OrderWithModifications
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
    `,
    [orderWithModificationsFragment],
);

export const getTagListDocument = graphql(`
    query GetTagList($options: TagListOptions) {
        tags(options: $options) {
            items {
                id
                value
            }
            totalItems
        }
    }
`);

export const getTagDocument = graphql(`
    query GetTag($id: ID!) {
        tag(id: $id) {
            id
            value
        }
    }
`);

export const createTagDocument = graphql(`
    mutation CreateTag($input: CreateTagInput!) {
        createTag(input: $input) {
            id
            value
        }
    }
`);

export const updateTagDocument = graphql(`
    mutation UpdateTag($input: UpdateTagInput!) {
        updateTag(input: $input) {
            id
            value
        }
    }
`);

export const deleteTagDocument = graphql(`
    mutation DeleteTag($id: ID!) {
        deleteTag(id: $id) {
            message
            result
        }
    }
`);

export const getCountryDocument = graphql(
    `
        query GetCountry($id: ID!) {
            country(id: $id) {
                ...Country
            }
        }
    `,
    [countryFragment],
);

export const createCountryDocument = graphql(
    `
        mutation CreateCountry($input: CreateCountryInput!) {
            createCountry(input: $input) {
                ...Country
            }
        }
    `,
    [countryFragment],
);

export const deleteCountryDocument = graphql(`
    mutation DeleteCountry($id: ID!) {
        deleteCountry(id: $id) {
            result
            message
        }
    }
`);

export const reindexDocument = graphql(`
    mutation Reindex {
        reindex {
            id
        }
    }
`);

export const searchGetAssetsDocument = graphql(`
    query SearchGetAssets($input: SearchInput!) {
        search(input: $input) {
            totalItems
            items {
                productId
                productVariantId
                productName
                productVariantName
                productAsset {
                    id
                    preview
                    focalPoint {
                        x
                        y
                    }
                }
                productVariantAsset {
                    id
                    preview
                    focalPoint {
                        x
                        y
                    }
                }
            }
        }
    }
`);

export const searchGetPricesDocument = graphql(`
    query SearchGetPrices($input: SearchInput!) {
        search(input: $input) {
            items {
                price {
                    ... on PriceRange {
                        min
                        max
                    }
                    ... on SinglePrice {
                        value
                    }
                }
                priceWithTax {
                    ... on PriceRange {
                        min
                        max
                    }
                    ... on SinglePrice {
                        value
                    }
                }
            }
        }
    }
`);

export const syncCustomPermissionsDocument = graphql(`
    mutation Sync {
        syncWishlist
    }
`);

export const crudReadDocument = graphql(`
    query CrudRead {
        wishlist
    }
`);

export const crudCreateDocument = graphql(`
    mutation CrudCreate {
        createWishlist
    }
`);

export const crudUpdateDocument = graphql(`
    mutation CrudUpdate {
        updateWishlist
    }
`);

export const crudDeleteDocument = graphql(`
    mutation CrudDelete {
        deleteWishlist
    }
`);

export const getTaxCategoryListDocument = graphql(`
    query GetTaxCategoryList {
        taxCategories {
            items {
                id
                name
                isDefault
            }
        }
    }
`);

export const getTaxCategoryDocument = graphql(`
    query GetTaxCategory($id: ID!) {
        taxCategory(id: $id) {
            id
            name
            isDefault
        }
    }
`);

export const createTaxCategoryDocument = graphql(`
    mutation CreateTaxCategory($input: CreateTaxCategoryInput!) {
        createTaxCategory(input: $input) {
            id
            name
            isDefault
        }
    }
`);

export const updateTaxCategoryDocument = graphql(`
    mutation UpdateTaxCategory($input: UpdateTaxCategoryInput!) {
        updateTaxCategory(input: $input) {
            id
            name
            isDefault
        }
    }
`);

export const deleteTaxCategoryDocument = graphql(`
    mutation DeleteTaxCategory($id: ID!) {
        deleteTaxCategory(id: $id) {
            result
            message
        }
    }
`);

export const getFulfillmentHandlersDocument = graphql(`
    query GetFulfillmentHandlers {
        fulfillmentHandlers {
            code
            description
            args {
                name
                type
                description
                label
                ui
            }
        }
    }
`);
