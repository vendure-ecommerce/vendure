import {
    CurrentUserChannel,
    CurrentUserChannelInput,
    GetNetworkStatus,
    GetUiState,
    GetUserStatus,
    LanguageCode,
    RequestCompleted,
    RequestStarted,
    SetActiveChannel,
    SetAsLoggedIn,
    SetContentLanguage,
    SetDisplayUiExtensionPoints,
    SetUiLanguage,
    SetUiLocale,
    SetUiTheme,
    UpdateUserChannels,
} from '../../common/generated-types';
import {
    GET_NEWTORK_STATUS,
    GET_UI_STATE,
    GET_USER_STATUS,
    REQUEST_COMPLETED,
    REQUEST_STARTED,
    SET_ACTIVE_CHANNEL,
    SET_AS_LOGGED_IN,
    SET_AS_LOGGED_OUT,
    SET_CONTENT_LANGUAGE,
    SET_DISPLAY_UI_EXTENSION_POINTS,
    SET_UI_LANGUAGE_AND_LOCALE,
    SET_UI_LOCALE,
    SET_UI_THEME,
    UPDATE_USER_CHANNELS,
} from '../definitions/client-definitions';

import { BaseDataService } from './base-data.service';

/**
 * Note: local queries all have a fetch-policy of "cache-first" explicitly specified due to:
 * https://github.com/apollographql/apollo-link-state/issues/236
 */
export class ClientDataService {
    constructor(private baseDataService: BaseDataService) {}

    startRequest() {
        return this.baseDataService.mutate<RequestStarted.Mutation>(REQUEST_STARTED);
    }

    completeRequest() {
        return this.baseDataService.mutate<RequestCompleted.Mutation>(REQUEST_COMPLETED);
    }

    getNetworkStatus() {
        return this.baseDataService.query<GetNetworkStatus.Query>(GET_NEWTORK_STATUS, {}, 'cache-first');
    }

    loginSuccess(username: string, activeChannelId: string, channels: CurrentUserChannel[]) {
        return this.baseDataService.mutate<SetAsLoggedIn.Mutation, SetAsLoggedIn.Variables>(
            SET_AS_LOGGED_IN,
            {
                input: {
                    username,
                    loginTime: Date.now().toString(),
                    activeChannelId,
                    channels,
                },
            },
        );
    }

    logOut() {
        return this.baseDataService.mutate(SET_AS_LOGGED_OUT);
    }

    userStatus() {
        return this.baseDataService.query<GetUserStatus.Query>(GET_USER_STATUS, {}, 'cache-first');
    }

    uiState() {
        return this.baseDataService.query<GetUiState.Query>(GET_UI_STATE, {}, 'cache-first');
    }

    setUiLanguage(languageCode: LanguageCode, locale?: string) {
        return this.baseDataService.mutate<SetUiLanguage.Mutation, SetUiLanguage.Variables>(
            SET_UI_LANGUAGE_AND_LOCALE,
            {
                languageCode,
                locale,
            },
        );
    }

    setUiLocale(locale: string | undefined) {
        return this.baseDataService.mutate<SetUiLocale.Mutation, SetUiLocale.Variables>(SET_UI_LOCALE, {
            locale,
        });
    }

    setContentLanguage(languageCode: LanguageCode) {
        return this.baseDataService.mutate<SetContentLanguage.Mutation, SetContentLanguage.Variables>(
            SET_CONTENT_LANGUAGE,
            {
                languageCode,
            },
        );
    }

    setUiTheme(theme: string) {
        return this.baseDataService.mutate<SetUiTheme.Mutation, SetUiTheme.Variables>(SET_UI_THEME, {
            theme,
        });
    }

    setDisplayUiExtensionPoints(display: boolean) {
        return this.baseDataService.mutate<
            SetDisplayUiExtensionPoints.Mutation,
            SetDisplayUiExtensionPoints.Variables
        >(SET_DISPLAY_UI_EXTENSION_POINTS, {
            display,
        });
    }

    setActiveChannel(channelId: string) {
        return this.baseDataService.mutate<SetActiveChannel.Mutation, SetActiveChannel.Variables>(
            SET_ACTIVE_CHANNEL,
            {
                channelId,
            },
        );
    }

    updateUserChannels(channels: CurrentUserChannelInput[]) {
        return this.baseDataService.mutate<UpdateUserChannels.Mutation, UpdateUserChannels.Variables>(
            UPDATE_USER_CHANNELS,
            {
                channels,
            },
        );
    }
}
