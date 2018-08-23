import gql from 'graphql-tag';

import { FACET_WITH_VALUES_FRAGMENT } from '../fragments/facet-fragments';

export const CREATE_FACET = gql`
    mutation CreateFacet($input: CreateFacetInput) {
        createFacet(input: $input) {
            ...FacetWithValues
        }
    }
    ${FACET_WITH_VALUES_FRAGMENT}
`;

export const UPDATE_FACET = gql`
    mutation UpdateFacet($input: UpdateFacetInput) {
        updateFacet(input: $input) {
            ...FacetWithValues
        }
    }
    ${FACET_WITH_VALUES_FRAGMENT}
`;
