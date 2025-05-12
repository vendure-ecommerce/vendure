import { graphql } from '@/graphql/graphql.js';

export const countryItemFragment = graphql(`
    fragment CountryItem on Country {
        id
        name
        code
        enabled
        customFields
    }
`);

export const countriesListQuery = graphql(
    `
        query CountriesList($options: CountryListOptions) {
            countries(options: $options) {
                items {
                    ...CountryItem
                }
                totalItems
            }
        }
    `,
    [countryItemFragment],
);

export const countryDetailQuery = graphql(`
    query CountryDetail($id: ID!) {
        country(id: $id) {
            id
            name
            code
            enabled
            translations {
                id
                createdAt
                updatedAt
                languageCode
                name
            }
            customFields
        }
    }
`);

export const createCountryDocument = graphql(`
    mutation CreateCountry($input: CreateCountryInput!) {
        createCountry(input: $input) {
            id
        }
    }
`);

export const updateCountryDocument = graphql(`
    mutation UpdateCountry($input: UpdateCountryInput!) {
        updateCountry(input: $input) {
            id
        }
    }
`);

export const deleteCountryDocument = graphql(`
    mutation DeleteCountry($id: ID!) {
        deleteCountry(id: $id) {
            result
            message
        }
    }
`);
