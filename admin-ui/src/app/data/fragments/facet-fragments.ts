import gql from 'graphql-tag';

export const FACET_VALUE_FRAGMENT = gql`
    fragment FacetValue on FacetValue {
        id
        languageCode
        code
        name
        translations {
            id
            languageCode
            name
        }
    }
`;

export const FACET_WITH_VALUES_FRAGMENT = gql`
    fragment FacetWithValues on Facet {
        id
        languageCode
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
