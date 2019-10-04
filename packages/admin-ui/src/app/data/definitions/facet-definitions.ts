import gql from 'graphql-tag';

export const FACET_VALUE_FRAGMENT = gql`
    fragment FacetValue on FacetValue {
        id
        createdAt
        updatedAt
        languageCode
        code
        name
        translations {
            id
            languageCode
            name
        }
        facet {
            id
            createdAt
            updatedAt
            name
        }
    }
`;

export const FACET_WITH_VALUES_FRAGMENT = gql`
    fragment FacetWithValues on Facet {
        id
        createdAt
        updatedAt
        languageCode
        isPrivate
        code
        name
        translations {
            id
            languageCode
            name
        }
        values {
            ...FacetValue
        }
    }
    ${FACET_VALUE_FRAGMENT}
`;

export const CREATE_FACET = gql`
    mutation CreateFacet($input: CreateFacetInput!) {
        createFacet(input: $input) {
            ...FacetWithValues
        }
    }
    ${FACET_WITH_VALUES_FRAGMENT}
`;

export const UPDATE_FACET = gql`
    mutation UpdateFacet($input: UpdateFacetInput!) {
        updateFacet(input: $input) {
            ...FacetWithValues
        }
    }
    ${FACET_WITH_VALUES_FRAGMENT}
`;

export const DELETE_FACET = gql`
    mutation DeleteFacet($id: ID!, $force: Boolean) {
        deleteFacet(id: $id, force: $force) {
            result
            message
        }
    }
`;

export const CREATE_FACET_VALUES = gql`
    mutation CreateFacetValues($input: [CreateFacetValueInput!]!) {
        createFacetValues(input: $input) {
            ...FacetValue
        }
    }
    ${FACET_VALUE_FRAGMENT}
`;

export const UPDATE_FACET_VALUES = gql`
    mutation UpdateFacetValues($input: [UpdateFacetValueInput!]!) {
        updateFacetValues(input: $input) {
            ...FacetValue
        }
    }
    ${FACET_VALUE_FRAGMENT}
`;

export const DELETE_FACET_VALUES = gql`
    mutation DeleteFacetValues($ids: [ID!]!, $force: Boolean) {
        deleteFacetValues(ids: $ids, force: $force) {
            result
            message
        }
    }
`;

export const GET_FACET_LIST = gql`
    query GetFacetList($options: FacetListOptions) {
        facets(options: $options) {
            items {
                ...FacetWithValues
            }
            totalItems
        }
    }
    ${FACET_WITH_VALUES_FRAGMENT}
`;

export const GET_FACET_WITH_VALUES = gql`
    query GetFacetWithValues($id: ID!) {
        facet(id: $id) {
            ...FacetWithValues
        }
    }
    ${FACET_WITH_VALUES_FRAGMENT}
`;
