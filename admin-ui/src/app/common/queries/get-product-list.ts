import gql from 'graphql-tag';

export const getProductList = gql`
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
