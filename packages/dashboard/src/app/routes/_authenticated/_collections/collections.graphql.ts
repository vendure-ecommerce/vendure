import { api } from '@/graphql/api.js';
import {
    assetFragment,
    configurableOperationDefFragment,
    configurableOperationFragment,
} from '@/graphql/fragments.js';
import { graphql, ResultOf } from '@/graphql/graphql.js';
import { DefinedInitialDataOptions, queryOptions } from '@tanstack/react-query';

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
                    children {
                        id
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
                customFields
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

export const deleteCollectionDocument = graphql(`
    mutation DeleteCollection($id: ID!) {
        deleteCollection(id: $id) {
            result
            message
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

export const getCollectionFiltersQueryOptions = queryOptions({
    queryKey: ['getCollectionFilters'],
    queryFn: () => api.query(getCollectionFiltersDocument),
}) as DefinedInitialDataOptions<ResultOf<typeof getCollectionFiltersDocument>>;

export const assignCollectionToChannelDocument = graphql(`
    mutation AssignCollectionsToChannel($input: AssignCollectionsToChannelInput!) {
        assignCollectionsToChannel(input: $input) {
            id
        }
    }
`);

export const removeCollectionFromChannelDocument = graphql(`
    mutation RemoveCollectionsFromChannel($input: RemoveCollectionsFromChannelInput!) {
        removeCollectionsFromChannel(input: $input) {
            id
        }
    }
`);
