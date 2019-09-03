import {
    GetNetworkStatus,
    GetUiState,
    GetUserStatus,
    LanguageCode,
    RequestCompleted,
    RequestStarted,
    SetAsLoggedIn,
    SetUiLanguage,
} from '../../common/generated-types';
import {
    GET_NEWTORK_STATUS,
    GET_UI_STATE,
    GET_USER_STATUS,
    REQUEST_COMPLETED,
    REQUEST_STARTED,
    SET_AS_LOGGED_IN,
    SET_AS_LOGGED_OUT,
    SET_UI_LANGUAGE,
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

    loginSuccess(username: string) {
        return this.baseDataService.mutate<SetAsLoggedIn.Mutation, SetAsLoggedIn.Variables>(
            SET_AS_LOGGED_IN,
            {
                username,
                loginTime: Date.now().toString(),
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

    setUiLanguage(languageCode: LanguageCode) {
        return this.baseDataService.mutate<SetUiLanguage.Mutation, SetUiLanguage.Variables>(SET_UI_LANGUAGE, {
            languageCode,
        });
    }
}
