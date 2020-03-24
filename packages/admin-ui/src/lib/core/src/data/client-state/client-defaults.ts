import { GetNetworkStatus, GetUiState, GetUserStatus } from '../../common/generated-types';
import { getDefaultLanguage } from '../../common/utilities/get-default-language';
import { LocalStorageService } from '../../providers/local-storage/local-storage.service';

export function getClientDefaults(localStorageService: LocalStorageService) {
    const currentLanguage = localStorageService.get('uiLanguageCode') || getDefaultLanguage();
    return {
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
            language: currentLanguage,
            __typename: 'UiState',
        } as GetUiState.UiState,
    };
}
