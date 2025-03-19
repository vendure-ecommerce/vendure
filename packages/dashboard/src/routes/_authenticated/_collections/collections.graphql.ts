import { assetFragment } from '@/graphql/fragments.js';
import { graphql } from '@/graphql/graphql.js';

export const collectionListDocument = graphql(
    `
        query CollectionList($options: CollectionListOptions) {
            collections(options: $options) {
                items {
                    id
                    createdAt
                    updatedAt
                    featuredAsset {
                        ...Asset
                    }
                    name
                    slug
                    breadcrumbs {
                        id
                        name
                        slug
                    }
                    position
                    isPrivate
                    parentId
                    productVariants {
                        totalItems
                    }
                }
                totalItems
            }
        }
    `,
    [assetFragment],
);
