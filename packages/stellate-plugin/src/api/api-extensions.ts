import gql from 'graphql-tag';

export const shopApiExtensions = gql`
    """
    This type is here to allow us to easily purge the Stellate cache
    of any search results where the collectionSlug is used. We cannot rely on
    simply purging the SearchResult type, because in the case of an empty 'items'
    array, Stellate cannot know that that particular query now needs to be purged.
    """
    type SearchResponseCacheIdentifier {
        collectionSlug: String
    }

    extend type SearchResponse {
        cacheIdentifier: SearchResponseCacheIdentifier
    }
`;
