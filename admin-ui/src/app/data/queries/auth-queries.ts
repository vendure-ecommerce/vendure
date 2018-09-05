import gql from 'graphql-tag';

import { CURRENT_USER_FRAGMENT } from '../fragments/auth-fragments';

export const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        me {
            ...CurrentUser
        }
    }
    ${CURRENT_USER_FRAGMENT}
`;
