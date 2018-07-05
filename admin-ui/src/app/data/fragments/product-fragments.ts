import gql from 'graphql-tag';

export const PRODUCT_WITH_VARIANTS_FRAGMENT = gql`
    fragment ProductWithVariants on Product {
        id
        languageCode
        name
        slug
        image
        description
        translations {
            languageCode
            name
            slug
            description
        },
        variants {
            id
            languageCode
            name
            price
            sku
            image
            options {
                id
                code
                languageCode
                name
            }
            translations {
                id
                languageCode
                name
            }
        }
    }
`;
