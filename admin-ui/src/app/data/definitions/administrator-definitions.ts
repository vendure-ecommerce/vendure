import gql from 'graphql-tag';

export const ADMINISTRATOR_FRAGMENT = gql`
    fragment Administrator on Administrator {
        id
        firstName
        lastName
        emailAddress
        user {
            id
            identifier
            lastLogin
            roles {
                code
                description
                permissions
            }
        }
    }
`;

export const GET_ADMINISTRATORS = gql`
    query GetAdministrators($options: AdministratorListOptions) {
        administrators(options: $options) {
            items {
                ...Administrator
            }
            totalItems
        }
    }
    ${ADMINISTRATOR_FRAGMENT}
`;
