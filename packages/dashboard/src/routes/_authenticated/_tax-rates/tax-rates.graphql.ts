import { graphql } from '@/graphql/graphql.js';

export const taxRateItemFragment = graphql(`
    fragment TaxRateItem on TaxRate {
        id
        createdAt
        updatedAt
        name
        enabled
        value
        category {
            id
            name
        }
        zone {
            id
            name
        }
        customerGroup {
            id
            name
        }
    }
`);

export const taxRateListQuery = graphql(
    `
        query TaxRateList {
            taxRates {
                items {
                    ...TaxRateItem
                }
                totalItems
            }
        }
    `,
    [taxRateItemFragment],
);
