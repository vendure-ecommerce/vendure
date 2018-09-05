import gql from 'graphql-tag';

import { CURRENT_USER_FRAGMENT } from '../fragments/auth-fragments';

export const ATTEMPT_LOGIN = gql`
    mutation AttemptLogin($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            user {
                ...CurrentUser
            }
            authToken
        }
    }
    ${CURRENT_USER_FRAGMENT}
`;
