import { Observable } from 'rxjs';
import { AttemptLogin, AttemptLoginVariables, GetCurrentUser, LogOut } from 'shared/generated-types';

import { ATTEMPT_LOGIN, GET_CURRENT_USER, LOG_OUT } from '../definitions/auth-definitions';
import { QueryResult } from '../query-result';

import { BaseDataService } from './base-data.service';

export class AuthDataService {
    constructor(private baseDataService: BaseDataService) {}

    checkLoggedIn(): QueryResult<GetCurrentUser> {
        return this.baseDataService.query<GetCurrentUser>(GET_CURRENT_USER);
    }

    attemptLogin(username: string, password: string, rememberMe: boolean): Observable<AttemptLogin> {
        return this.baseDataService.mutate<AttemptLogin, AttemptLoginVariables>(ATTEMPT_LOGIN, {
            username,
            password,
            rememberMe,
        });
    }

    logOut(): Observable<LogOut> {
        return this.baseDataService.mutate<LogOut>(LOG_OUT);
    }
}
