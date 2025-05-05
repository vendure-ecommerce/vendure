import gql from 'graphql-tag';

export const adminApiExtensions = gql`
    type GlobalSearchResultItem {
        id: ID!
        name: String!
        data: JSON
        entityType: String!
        entityId: ID!
        entityCreatedAt: DateTime!
        entityUpdatedAt: DateTime!
        languageCode: LanguageCode!
    }

    type GlobalSearchResult {
        items: [GlobalSearchResultItem!]!
        totalItems: Int!
    }

    enum GlobalSearchSortField {
        id
        name
        entityCreatedAt
        entityUpdatedAt
    }

    enum GlobalSearchSortDirection {
        ASC
        DESC
    }

    input GlobalSearchInput {
        query: String
        enabledOnly: Boolean
        entityTypes: [String!]
        sortField: GlobalSearchSortField
        sortDirection: GlobalSearchSortDirection
        take: Int
        skip: Int
    }

    extend type Query {
        globalSearch(input: GlobalSearchInput!): GlobalSearchResult!
        globalSearchIndexableEntities: [String!]!
    }

    extend type Mutation {
        triggerGlobalSearchBuildIndex: Boolean!
        triggerGlobalSearchRebuildIndex: Boolean!
    }
`;
