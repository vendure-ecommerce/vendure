import { gql } from 'graphql-tag';

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

export const GLOBAL_SEARCH_INPUT_FRAGMENT = gql`
    input GlobalSearchInput {
        query: String!
        types: [SearchResultType!]
        limit: Int = 20
        skip: Int = 0
        channelId: String
    }
`;

export const SEARCH_RESULT_TYPE_ENUM = gql`
    enum SearchResultType {
        # Core Entities
        PRODUCT
        PRODUCT_VARIANT
        CUSTOMER
        ORDER
        COLLECTION
        ADMINISTRATOR
        CHANNEL
        ASSET
        FACET
        FACET_VALUE
        PROMOTION
        PAYMENT_METHOD
        SHIPPING_METHOD
        TAX_CATEGORY
        TAX_RATE
        COUNTRY
        ZONE
        ROLE
        CUSTOMER_GROUP
        STOCK_LOCATION
        TAG

        # Custom/Plugin Entities
        CUSTOM_ENTITY

        # Dashboard Content
        NAVIGATION
        SETTINGS
        QUICK_ACTION

        # External Content
        DOCUMENTATION
        BLOG_POST
        PLUGIN
        WEBSITE_CONTENT
    }
`;

export const GLOBAL_SEARCH_RESULT_FRAGMENT = gql`
    fragment GlobalSearchResult on GlobalSearchResult {
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
`;
