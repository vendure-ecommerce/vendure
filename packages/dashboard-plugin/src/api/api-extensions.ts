import gql from 'graphql-tag';

export const adminApiExtensions = gql`
    type GlobalSearchResultItem {
        id: ID!
        name: String!
        description: String
        metadata: JSON
    }

    type GlobalSearchResult {
        items: [GlobalSearchResultItem!]!
        totalItems: Int!
    }

    enum GlobalSearchSortField {
        ID
        NAME
        CREATED_AT
        UPDATED_AT
    }

    enum GlobalSearchSortDirection {
        ASC
        DESC
    }

    input GlobalSearchInput {
        query: String!
        enabledOnly: Boolean
        entityTypes: [String!]
        sortField: GlobalSearchSortField
        sortDirection: GlobalSearchSortDirection
        take: Int
        skip: Int
    }

    extend type Query {
        globalSearch(input: GlobalSearchInput!): GlobalSearchResult!
    }
`;
