import gql from 'graphql-tag';

export const CURRENT_USER_FRAGMENT = gql`
    fragment CurrentUser on CurrentUser {
        id
        identifier
        channels {
            id
            code
            token
            permissions
        }
    }
`;

export const ATTEMPT_LOGIN = gql`
    mutation AttemptLogin($username: String!, $password: String!, $rememberMe: Boolean!) {
        login(username: $username, password: $password, rememberMe: $rememberMe) {
            user {
                ...CurrentUser
            }
        }
    }
    ${CURRENT_USER_FRAGMENT}
`;

export const LOG_OUT = gql`
    mutation LogOut {
        logout
    }
`;

export const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        me {
            ...CurrentUser
        }
    }
    ${CURRENT_USER_FRAGMENT}
`;
