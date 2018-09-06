import gql from 'graphql-tag';

export const CURRENT_USER_FRAGMENT = gql`
    fragment CurrentUser on CurrentUser {
        id
        identifier
        channelTokens
        roles
    }
`;
