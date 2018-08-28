import { GetNetworkStatus, GetUiState, GetUserStatus, LanguageCode } from 'shared/generated-types';

import { getDefaultLanguage } from '../../common/utilities/get-default-language';

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
