import { AttemptLogin, GetCurrentUser, LogOut } from '../../common/generated-types';
import { ATTEMPT_LOGIN, GET_CURRENT_USER, LOG_OUT } from '../definitions/auth-definitions';

import { BaseDataService } from './base-data.service';

export class AuthDataService {
    constructor(private baseDataService: BaseDataService) {}

    currentUser() {
        return this.baseDataService.query<GetCurrentUser.Query>(GET_CURRENT_USER);
    }

    attemptLogin(username: string, password: string, rememberMe: boolean) {
        return this.baseDataService.mutate<AttemptLogin.Mutation, AttemptLogin.Variables>(ATTEMPT_LOGIN, {
            username,
            password,
            rememberMe,
        });
    }

    logOut() {
        return this.baseDataService.mutate<LogOut.Mutation>(LOG_OUT);
    }
}
