import { graphql } from '@/vdb/graphql/graphql.js';

export const productOptionFragment = graphql(`
    fragment ProductOption on ProductOption {
        id
        createdAt
        updatedAt
        languageCode
        code
        name
        translations {
            id
            languageCode
            name
        }
        group {
            id
            createdAt
            updatedAt
            name
            code
        }
    }
`);

export const productOptionGroupWithOptionsFragment = graphql(
    `
        fragment ProductOptionGroupWithOptionsList on ProductOptionGroup {
            id
            createdAt
            updatedAt
            name
            code
            languageCode
            optionList(options: $productOptionListOptions) {
                totalItems
                items {
                    ...ProductOption
                }
            }
        }
    `,
    [productOptionFragment],
);

export const productOptionGroupListDocument = graphql(
    `
        query ProductOptionGroupList(
            $options: ProductOptionGroupListOptions
            $productOptionListOptions: ProductOptionListOptions
        ) {
            productOptionGroups(options: $options) {
                items {
                    ...ProductOptionGroupWithOptionsList
                }
                totalItems
            }
        }
    `,
    [productOptionGroupWithOptionsFragment],
);

export const productOptionGroupDetailDocument = graphql(`
    query ProductOptionGroupDetail($id: ID!) {
        productOptionGroup(id: $id) {
            id
            createdAt
            updatedAt
            name
            code
            languageCode
            translations {
                id
                languageCode
                name
            }
            customFields
        }
    }
`);

export const createProductOptionGroupDocument = graphql(`
    mutation CreateProductOptionGroup($input: CreateProductOptionGroupInput!) {
        createProductOptionGroup(input: $input) {
            id
        }
    }
`);

export const updateProductOptionGroupDocument = graphql(`
    mutation UpdateProductOptionGroup($input: UpdateProductOptionGroupInput!) {
        updateProductOptionGroup(input: $input) {
            id
        }
    }
`);

export const deleteProductOptionGroupDocument = graphql(`
    mutation DeleteProductOptionGroup($id: ID!) {
        deleteProductOptionGroup(id: $id) {
            result
            message
        }
    }
`);

export const assignProductOptionGroupsToChannelDocument = graphql(`
    mutation AssignProductOptionGroupsToChannel($input: AssignProductOptionGroupsToChannelInput!) {
        assignProductOptionGroupsToChannel(input: $input) {
            id
        }
    }
`);

export const removeProductOptionGroupsFromChannelDocument = graphql(`
    mutation RemoveProductOptionGroupsFromChannel($input: RemoveProductOptionGroupsFromChannelInput!) {
        removeProductOptionGroupsFromChannel(input: $input) {
            ... on ProductOptionGroup {
                id
            }
            ... on ErrorResult {
                message
            }
        }
    }
`);

export const deleteProductOptionGroupsDocument = graphql(`
    mutation DeleteProductOptionGroups($ids: [ID!]!) {
        deleteProductOptionGroups(ids: $ids) {
            result
            message
        }
    }
`);

export const deleteProductOptionsDocument = graphql(`
    mutation DeleteProductOptions($ids: [ID!]!) {
        deleteProductOptions(ids: $ids) {
            result
            message
        }
    }
`);
