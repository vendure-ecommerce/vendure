import gql from 'graphql-tag';

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
    }
`;
