import { assetFragment } from '@/graphql/fragments.js';
import { graphql } from '@/graphql/graphql.js';

export const productVariantListDocument = graphql(
    `
        query ProductVariantList {
            productVariants {
                items {
                    id
                    createdAt
                    updatedAt
                    featuredAsset {
                        ...Asset
                    }
                    name
                    sku
                    price
                    priceWithTax
                    stockLevels {
                        id
                        stockOnHand
                        stockAllocated
                    }
                }
            }
        }
    `,
    [assetFragment],
);
