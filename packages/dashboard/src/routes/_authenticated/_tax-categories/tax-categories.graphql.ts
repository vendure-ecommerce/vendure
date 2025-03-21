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
