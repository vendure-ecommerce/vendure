import { graphql } from '@/graphql/graphql.js';

export const stockLocationItem = graphql(`
    fragment StockLocationItem on StockLocation {
        id
        createdAt
        updatedAt
        name
        description
    }
`);

export const stockLocationListQuery = graphql(
    `
        query StockLocationList {
            stockLocations {
                items {
                    ...StockLocationItem
                }
                totalItems
            }
        }
    `,
    [stockLocationItem],
);
