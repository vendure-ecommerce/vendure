import { graphql } from '@/graphql/graphql.js';

export const stockLocationFragment = graphql(`
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
    [stockLocationFragment],
);

export const stockLocationDetailQuery = graphql(
    `
        query StockLocationDetail($id: ID!) {
            stockLocation(id: $id) {
                ...StockLocationItem
                customFields
            }
        }
    `,
    [stockLocationFragment],
);

export const createStockLocationDocument = graphql(`
    mutation CreateStockLocation($input: CreateStockLocationInput!) {
        createStockLocation(input: $input) {
            id
        }
    }
`);

export const updateStockLocationDocument = graphql(`
    mutation UpdateStockLocation($input: UpdateStockLocationInput!) {
        updateStockLocation(input: $input) {
            id
        }
    }
`);

export const deleteStockLocationDocument = graphql(`
    mutation DeleteStockLocation($id: ID!) {
        deleteStockLocation(input: { id: $id }) {
            result
            message
        }
    }
`);
