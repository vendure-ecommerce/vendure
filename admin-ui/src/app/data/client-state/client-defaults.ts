import { getDefaultLanguage } from '../../common/utilities/get-default-language';
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
        language: getDefaultLanguage(),
        __typename: 'UiState',
    },
};
