import { Observable } from 'rxjs';
import { AttemptLogin, AttemptLoginVariables, GetCurrentUser } from 'shared/generated-types';

import { ATTEMPT_LOGIN, GET_CURRENT_USER } from '../definitions/auth-definitions';
import { QueryResult } from '../query-result';

import { BaseDataService } from './base-data.service';

export class AuthDataService {
    constructor(private baseDataService: BaseDataService) {}

    checkLoggedIn(): QueryResult<GetCurrentUser> {
        return this.baseDataService.query<GetCurrentUser>(GET_CURRENT_USER);
    }

    attemptLogin(username: string, password: string): Observable<AttemptLogin> {
        return this.baseDataService.mutate<AttemptLogin, AttemptLoginVariables>(ATTEMPT_LOGIN, {
            username,
            password,
        });
    }
}
