import { ASSET_FRAGMENT } from '@vendure/admin-ui/core';
import { gql } from 'apollo-angular';

export const GET_PRODUCT_VARIANTS_FOR_MULTI_SELECTOR = gql`
    query GetProductVariantsForMultiSelector($options: ProductVariantListOptions!) {
        productVariants(options: $options) {
            items {
                id
                createdAt
                updatedAt
                productId
                enabled
                languageCode
                name
                price
                currencyCode
                priceWithTax
                trackInventory
                outOfStockThreshold
                stockLevels {
                    id
                    createdAt
                    updatedAt
                    stockLocationId
                    stockOnHand
                    stockAllocated
                    stockLocation {
                        id
                        createdAt
                        updatedAt
                        name
                    }
                }
                useGlobalOutOfStockThreshold
                sku
                featuredAsset {
                    ...Asset
                }
            }
            totalItems
        }
    }
    ${ASSET_FRAGMENT}
`;
