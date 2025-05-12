import { graphql } from '@/graphql/graphql.js';

export const taxCategoryItemFragment = graphql(`
    fragment TaxCategoryItem on TaxCategory {
        id
        createdAt
        updatedAt
        name
        isDefault
    }
`);

export const taxCategoryListQuery = graphql(
    `
        query TaxCategoryList {
            taxCategories {
                items {
                    ...TaxCategoryItem
                }
                totalItems
            }
        }
    `,
    [taxCategoryItemFragment],
);

export const taxCategoryDetailQuery = graphql(`
    query TaxCategoryDetail($id: ID!) {
        taxCategory(id: $id) {
            id
            createdAt
            updatedAt
            name
            isDefault
            customFields
        }
    }
`);

export const createTaxCategoryDocument = graphql(`
    mutation CreateTaxCategory($input: CreateTaxCategoryInput!) {
        createTaxCategory(input: $input) {
            id
        }
    }
`);

export const updateTaxCategoryDocument = graphql(`
    mutation UpdateTaxCategory($input: UpdateTaxCategoryInput!) {
        updateTaxCategory(input: $input) {
            id
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
