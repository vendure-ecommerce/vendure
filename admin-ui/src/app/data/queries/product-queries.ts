import gql from 'graphql-tag';

import { PRODUCT_WITH_VARIANTS_FRAGMENT } from '../fragments/product-fragments';

export const GET_PRODUCT_WITH_VARIANTS = gql`
    query GetProductWithVariants($id: ID!, $languageCode: LanguageCode) {
        product(languageCode: $languageCode, id: $id) {
            ...ProductWithVariants
        }
    }
    ${PRODUCT_WITH_VARIANTS_FRAGMENT}
`;

export const GET_PRODUCT_LIST = gql`
    query GetProductList($options: ProductListOptions, $languageCode: LanguageCode) {
        products(languageCode: $languageCode, options: $options) {
            items {
                id
                languageCode
                name
                slug
                description
            }
            totalItems
        }
    }
`;

export const GET_PRODUCT_OPTION_GROUPS = gql`
    query GetProductOptionGroups($filterTerm: String, $languageCode: LanguageCode) {
        productOptionGroups(filterTerm: $filterTerm, languageCode: $languageCode) {
            id
            languageCode
            code
            name
            options {
                id
                languageCode
                code
                name
            }
        }
    }
`;
