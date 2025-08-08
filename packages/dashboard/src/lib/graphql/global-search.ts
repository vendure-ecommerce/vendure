import { gql } from 'graphql-tag';

// Note: These GraphQL definitions are placeholders for the frontend implementation.
// The actual backend GraphQL schema will be implemented separately according to
// the GLOBAL_SEARCH_IMPLEMENTATION_PLAN.md

export const GLOBAL_SEARCH_QUERY = gql`
    query GlobalSearch($input: GlobalSearchInput!) {
        globalSearch(input: $input) {
            id
            type
            title
            subtitle
            description
            url
            thumbnailUrl
            metadata
            relevanceScore
            lastModified
        }
    }
`;

// TypeScript types that match the expected GraphQL schema
export interface GlobalSearchInput {
    query: string;
    types?: string[];
    limit?: number;
    skip?: number;
    channelId?: string;
}

export interface GlobalSearchResult {
    id: string;
    type: string;
    title: string;
    subtitle?: string;
    description?: string;
    url: string;
    thumbnailUrl?: string;
    metadata?: Record<string, any>;
    relevanceScore?: number;
    lastModified?: string;
}
