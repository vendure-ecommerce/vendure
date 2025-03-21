import { graphql } from '@/graphql/graphql.js';
import { gql } from 'graphql-tag';

export const countryItemFragment = graphql(`
    fragment CountryItem on Country {
        id
        name
        code
        enabled
    }
`);

export const countriesListQuery = graphql(
    `
        query CountriesList {
            countries {
                items {
                    ...CountryItem
                }
                totalItems
            }
        }
    `,
    [countryItemFragment],
);
