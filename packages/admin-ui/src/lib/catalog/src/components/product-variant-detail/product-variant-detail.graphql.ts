import { ASSET_FRAGMENT, PRODUCT_OPTION_FRAGMENT } from '@vendure/admin-ui/core';
import { gql } from 'apollo-angular';

export const GET_PRODUCT_VARIANT_DETAIL = gql`
    query GetProductVariantDetail($id: ID!) {
        productVariant(id: $id) {
            id
            createdAt
            updatedAt
            enabled
            languageCode
            name
            price
            currencyCode
            priceWithTax
            stockOnHand
            stockAllocated
            trackInventory
            outOfStockThreshold
            useGlobalOutOfStockThreshold
            taxRateApplied {
                id
                name
                value
            }
            taxCategory {
                id
                name
            }
            sku
            options {
                ...ProductOption
            }
            stockLevels {
                id
                createdAt
                updatedAt
                stockOnHand
                stockAllocated
                stockLocationId
                stockLocation {
                    id
                    createdAt
                    updatedAt
                    name
                }
            }
            facetValues {
                id
                code
                name
                facet {
                    id
                    name
                }
            }
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
            }
            channels {
                id
                code
            }
            product {
                id
                name
            }
        }
        stockLocations(options: { take: 100 }) {
            items {
                id
                createdAt
                updatedAt
                name
                description
            }
        }
        taxCategories(options: { take: 100 }) {
            items {
                id
                createdAt
                updatedAt
                name
                isDefault
            }
            totalItems
        }
    }
    ${PRODUCT_OPTION_FRAGMENT}
    ${ASSET_FRAGMENT}
`;
