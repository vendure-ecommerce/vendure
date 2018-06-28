import gql from 'graphql-tag';

export const getProductById = gql`
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
