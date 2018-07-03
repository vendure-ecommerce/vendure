import gql from 'graphql-tag';

export const GET_NEWTORK_STATUS = gql`
    query GetNetworkStatus {
        networkStatus @client {
            inFlightRequests
        }
    }
`;

export const GET_USER_STATUS = gql`
    query GetUserStatus {
        userStatus @client {
            username
            isLoggedIn
            loginTime
        }
    }
`;
