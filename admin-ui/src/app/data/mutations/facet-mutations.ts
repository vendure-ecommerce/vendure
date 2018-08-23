import gql from 'graphql-tag';

import { FACET_VALUE_FRAGMENT, FACET_WITH_VALUES_FRAGMENT } from '../fragments/facet-fragments';

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
