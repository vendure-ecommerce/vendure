import { graphql } from '@/graphql/graphql.js';

export const facetValueFragment = graphql(`
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
            code
        }
    }
`);

export const facetWithValuesFragment = graphql(
    `
        fragment FacetWithValueList on Facet {
            id
            createdAt
            updatedAt
            name
            code
            languageCode
            isPrivate
            valueList(options: $facetValueListOptions) {
                totalItems
                items {
                    ...FacetValue
                }
            }
        }
    `,
    [facetValueFragment],
);

export const facetListDocument = graphql(
    `
        query FacetList($options: FacetListOptions, $facetValueListOptions: FacetValueListOptions) {
            facets(options: $options) {
                items {
                    ...FacetWithValueList
                }
                totalItems
            }
        }
    `,
    [facetWithValuesFragment],
);
