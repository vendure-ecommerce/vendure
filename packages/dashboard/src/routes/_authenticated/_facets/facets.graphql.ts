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

export const facetDetailDocument = graphql(`
    query FacetDetail($id: ID!) {
        facet(id: $id) {
            id
            createdAt
            updatedAt
            name
            code
            languageCode
            isPrivate
            translations {
                id
                languageCode
                name
            }
            customFields
        }
    }
`);

export const createFacetDocument = graphql(`
    mutation CreateFacet($input: CreateFacetInput!) {
        createFacet(input: $input) {
            id
        }
    }
`);

export const updateFacetDocument = graphql(`
    mutation UpdateFacet($input: UpdateFacetInput!) {
        updateFacet(input: $input) {
            id
        }
    }
`);
