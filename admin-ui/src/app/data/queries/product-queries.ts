import gql from 'graphql-tag';

export const GET_PRODUCT_BY_ID = gql`
    query GetProductById($id: ID!, $languageCode: LanguageCode){
        product(languageCode: $languageCode, id: $id) {
            id
            languageCode
            name
            slug
            description
            translations {
                languageCode
                name
                slug
                description
            }
        }
    }
`;

export const GET_PRODUCT_LIST = gql`
    query GetProductList($take: Int, $skip: Int, $languageCode: LanguageCode){
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
