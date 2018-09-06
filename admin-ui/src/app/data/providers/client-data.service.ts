import { Observable } from 'rxjs';
import {
    GetNetworkStatus,
    GetUiState,
    GetUserStatus,
    LanguageCode,
    RequestCompleted,
    RequestStarted,
    SetAsLoggedIn,
    SetAsLoggedInVariables,
    SetAsLoggedOut,
    SetUiLanguage,
    SetUiLanguageVariables,
} from 'shared/generated-types';

import {
    GET_NEWTORK_STATUS,
    GET_UI_STATE,
    GET_USER_STATUS,
    REQUEST_COMPLETED,
    REQUEST_STARTED,
    SET_AS_LOGGED_IN,
    SET_AS_LOGGED_OUT,
    SET_UI_LANGUAGE,
} from '../definitions/local-definitions';
import { QueryResult } from '../query-result';

import { BaseDataService } from './base-data.service';

export class ClientDataService {
    constructor(private baseDataService: BaseDataService) {}

    startRequest(): Observable<RequestStarted> {
        return this.baseDataService.mutate<RequestStarted>(REQUEST_STARTED);
    }

    completeRequest(): Observable<RequestCompleted> {
        return this.baseDataService.mutate<RequestCompleted>(REQUEST_COMPLETED);
    }

    getNetworkStatus(): QueryResult<GetNetworkStatus> {
        return this.baseDataService.query<GetNetworkStatus>(GET_NEWTORK_STATUS);
    }

    loginSuccess(username: string): Observable<SetAsLoggedIn> {
        return this.baseDataService.mutate<SetAsLoggedIn, SetAsLoggedInVariables>(SET_AS_LOGGED_IN, {
            username,
            loginTime: Date.now().toString(),
        });
    }

    logOut(): Observable<SetAsLoggedOut> {
        return this.baseDataService.mutate(SET_AS_LOGGED_OUT);
    }

    userStatus(): QueryResult<GetUserStatus> {
        return this.baseDataService.query<GetUserStatus>(GET_USER_STATUS);
    }

    uiState(): QueryResult<GetUiState> {
        return this.baseDataService.query<GetUiState>(GET_UI_STATE);
    }

    setUiLanguage(languageCode: LanguageCode): Observable<SetUiLanguage> {
        return this.baseDataService.mutate<SetUiLanguage, SetUiLanguageVariables>(SET_UI_LANGUAGE, {
            languageCode,
        });
    }
}
