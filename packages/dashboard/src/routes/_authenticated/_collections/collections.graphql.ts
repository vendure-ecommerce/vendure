import {
    assetFragment,
    configurableOperationDefFragment,
    configurableOperationFragment,
} from '@/graphql/fragments.js';
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

export const collectionDetailDocument = graphql(
    `
        query CollectionDetail($id: ID!) {
            collection(id: $id) {
                id
                createdAt
                updatedAt
                name
                slug
                description
                isPrivate
                languageCode
                breadcrumbs {
                    id
                    name
                    slug
                }
                featuredAsset {
                    ...Asset
                }
                assets {
                    ...Asset
                }
                inheritFilters
                filters {
                    ...ConfigurableOperation
                }
                translations {
                    id
                    languageCode
                    name
                    slug
                    description
                }
                parent {
                    id
                    name
                }
                children {
                    id
                    name
                }
            }
        }
    `,
    [assetFragment, configurableOperationFragment],
);

export const createCollectionDocument = graphql(`
    mutation CreateCollection($input: CreateCollectionInput!) {
        createCollection(input: $input) {
            id
        }
    }
`);

export const updateCollectionDocument = graphql(`
    mutation UpdateCollection($input: UpdateCollectionInput!) {
        updateCollection(input: $input) {
            id
        }
    }
`);

export const getCollectionFiltersDocument = graphql(
    `
        query GetCollectionFilters {
            collectionFilters {
                ...ConfigurableOperationDef
            }
        }
    `,
    [configurableOperationDefFragment],
);
