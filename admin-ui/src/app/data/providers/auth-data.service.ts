import { Observable } from 'rxjs';
import { AttemptLogin, AttemptLoginVariables, GetCurrentUser } from 'shared/generated-types';

import { ATTEMPT_LOGIN } from '../mutations/auth-mutations';
import { GET_CURRENT_USER } from '../queries/auth-queries';
import { QueryResult } from '../types/query-result';

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
