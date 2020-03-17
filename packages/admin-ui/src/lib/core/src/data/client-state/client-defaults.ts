import { GetNetworkStatus, GetUiState, GetUserStatus } from '../../common/generated-types';
import { getDefaultLanguage } from '../../common/utilities/get-default-language';

export const clientDefaults = {
    networkStatus: {
        inFlightRequests: 0,
        __typename: 'NetworkStatus',
    } as GetNetworkStatus.NetworkStatus,
    userStatus: {
        username: '',
        isLoggedIn: false,
        loginTime: '',
        activeChannelId: null,
        permissions: [],
        channels: [],
        __typename: 'UserStatus',
    } as GetUserStatus.UserStatus,
    uiState: {
        language: getDefaultLanguage(),
        __typename: 'UiState',
    } as GetUiState.UiState,
};
