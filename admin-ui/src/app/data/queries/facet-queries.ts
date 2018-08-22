import gql from 'graphql-tag';

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
