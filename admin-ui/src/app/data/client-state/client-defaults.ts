import { GetNetworkStatus, GetUiState, GetUserStatus, LanguageCode } from '../types/gql-generated-types';

export const clientDefaults: GetNetworkStatus & GetUserStatus & GetUiState = {
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
    uiState: {
        language: LanguageCode.en,
        __typename: 'UiState',
    },
};
