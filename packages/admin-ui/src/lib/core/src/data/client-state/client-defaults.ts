import { getAppConfig } from '../../app.config';
import { GetNetworkStatus, GetUiState, GetUserStatus } from '../../common/generated-types';
import { getDefaultUiLanguage } from '../../common/utilities/get-default-ui-language';
import { LocalStorageService } from '../../providers/local-storage/local-storage.service';

export function getClientDefaults(localStorageService: LocalStorageService) {
    const currentLanguage = localStorageService.get('uiLanguageCode') || getDefaultUiLanguage();
    const currentContentLanguage = localStorageService.get('contentLanguageCode') || getDefaultUiLanguage();
    const activeTheme = localStorageService.get('activeTheme') || 'default';
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
            contentLanguage: currentContentLanguage,
            theme: activeTheme,
            __typename: 'UiState',
        } as GetUiState.UiState,
    };
}
