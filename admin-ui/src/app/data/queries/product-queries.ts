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
    query GetProductList($take: Int, $skip: Int, $languageCode: LanguageCode) {
        products(languageCode: $languageCode, take: $take, skip: $skip) {
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
