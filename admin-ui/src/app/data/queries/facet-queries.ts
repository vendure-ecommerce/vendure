import gql from 'graphql-tag';

import { FACET_WITH_VALUES_FRAGMENT } from '../fragments/facet-fragments';

export const GET_FACET_LIST = gql`
    query GetFacetList($options: FacetListOptions, $languageCode: LanguageCode) {
        facets(languageCode: $languageCode, options: $options) {
            items {
                id
                languageCode
                code
                name
            }
            totalItems
        }
    }
`;

export const GET_FACET_WITH_VALUES = gql`
    query GetFacetWithValues($id: ID!, $languageCode: LanguageCode) {
        facet(id: $id, languageCode: $languageCode) {
            ...FacetWithValues
        }
    }
    ${FACET_WITH_VALUES_FRAGMENT}
`;
