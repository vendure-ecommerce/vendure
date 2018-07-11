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
        }
        optionGroups {
            id
            languageCode
            code
            name
        }
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

export const PRODUCT_OPTION_GROUP_FRAGMENT = gql`
    fragment ProductOptionGroup on ProductOptionGroup {
        id
        languageCode
        code
        name
        translations {
            name
        }
        options {
            id
            languageCode
            code
            translations {
                name
            }
        }
    }
`;
