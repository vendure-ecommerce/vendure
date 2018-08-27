import gql from 'graphql-tag';

import {
    PRODUCT_OPTION_GROUP_FRAGMENT,
    PRODUCT_VARIANT_FRAGMENT,
    PRODUCT_WITH_VARIANTS_FRAGMENT,
} from '../fragments/product-fragments';

export const UPDATE_PRODUCT = gql`
    mutation UpdateProduct($input: UpdateProductInput!) {
        updateProduct(input: $input) {
            ...ProductWithVariants
        }
    }
    ${PRODUCT_WITH_VARIANTS_FRAGMENT}
`;

export const CREATE_PRODUCT = gql`
    mutation CreateProduct($input: CreateProductInput!) {
        createProduct(input: $input) {
            ...ProductWithVariants
        }
    }
    ${PRODUCT_WITH_VARIANTS_FRAGMENT}
`;

export const GENERATE_PRODUCT_VARIANTS = gql`
    mutation GenerateProductVariants($productId: ID!, $defaultPrice: Int, $defaultSku: String) {
        generateVariantsForProduct(
            productId: $productId
            defaultPrice: $defaultPrice
            defaultSku: $defaultSku
        ) {
            ...ProductWithVariants
        }
    }
    ${PRODUCT_WITH_VARIANTS_FRAGMENT}
`;

export const UPDATE_PRODUCT_VARIANTS = gql`
    mutation UpdateProductVariants($input: [UpdateProductVariantInput!]!) {
        updateProductVariants(input: $input) {
            ...ProductVariant
        }
    }
    ${PRODUCT_VARIANT_FRAGMENT}
`;

export const CREATE_PRODUCT_OPTION_GROUP = gql`
    mutation CreateProductOptionGroup($input: CreateProductOptionGroupInput!) {
        createProductOptionGroup(input: $input) {
            ...ProductOptionGroup
        }
    }
    ${PRODUCT_OPTION_GROUP_FRAGMENT}
`;

export const ADD_OPTION_GROUP_TO_PRODUCT = gql`
    mutation AddOptionGroupToProduct($productId: ID!, $optionGroupId: ID!) {
        addOptionGroupToProduct(productId: $productId, optionGroupId: $optionGroupId) {
            id
            optionGroups {
                id
                code
                options {
                    id
                    code
                }
            }
        }
    }
`;

export const REMOVE_OPTION_GROUP_FROM_PRODUCT = gql`
    mutation RemoveOptionGroupFromProduct($productId: ID!, $optionGroupId: ID!) {
        removeOptionGroupFromProduct(productId: $productId, optionGroupId: $optionGroupId) {
            id
            optionGroups {
                id
                code
                options {
                    id
                    code
                }
            }
        }
    }
`;

export const APPLY_FACET_VALUE_TO_PRODUCT_VARIANTS = gql`
    mutation ApplyFacetValuesToProductVariants($facetValueIds: [ID!]!, $productVariantIds: [ID!]!) {
        applyFacetValuesToProductVariants(
            facetValueIds: $facetValueIds
            productVariantIds: $productVariantIds
        ) {
            ...ProductVariant
        }
    }
    ${PRODUCT_VARIANT_FRAGMENT}
`;
