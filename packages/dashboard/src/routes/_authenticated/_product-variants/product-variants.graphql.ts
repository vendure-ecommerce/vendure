import { assetFragment } from '@/graphql/fragments.js';
import { graphql } from '@/graphql/graphql.js';

export const productVariantListDocument = graphql(
    `
        query ProductVariantLis($options: ProductVariantListOptions) {
            productVariants(options: $options) {
                items {
                    id
                    createdAt
                    updatedAt
                    featuredAsset {
                        ...Asset
                    }
                    name
                    sku
                    currencyCode
                    price
                    priceWithTax
                    stockLevels {
                        id
                        stockOnHand
                        stockAllocated
                    }
                    customFields
                }
                totalItems
            }
        }
    `,
    [assetFragment],
);
