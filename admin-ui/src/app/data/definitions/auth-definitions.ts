import gql from 'graphql-tag';

export const CURRENT_USER_FRAGMENT = gql`
    fragment CurrentUser on CurrentUser {
        id
        identifier
        channelTokens
        roles
    }
`;

export const ATTEMPT_LOGIN = gql`
    mutation AttemptLogin($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            user {
                ...CurrentUser
            }
        }
    }
    ${CURRENT_USER_FRAGMENT}
`;

export const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        me {
            ...CurrentUser
        }
    }
    ${CURRENT_USER_FRAGMENT}
`;
