import { GetNetworkStatus, GetUserStatus } from '../types/gql-generated-types';

export const clientDefaults: GetNetworkStatus & GetUserStatus = {
    networkStatus: {
        inFlightRequests: 0,
        __typename: 'NetworkStatus',
    },
    userStatus: {
        username: '',
        isLoggedIn: false,
        loginTime: '',
        __typename: 'UserStatus',
    },
};
