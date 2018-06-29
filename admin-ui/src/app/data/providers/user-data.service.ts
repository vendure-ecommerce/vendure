import { Observable } from 'rxjs';

import { LoginResponse, UserResponse } from '../../common/types/response';

import { BaseDataService } from './base-data.service';

export class UserDataService {

    constructor(private baseDataService: BaseDataService) {}

    checkLoggedIn(): Observable<UserResponse> {
        return this.baseDataService.get('auth/me');
    }

    logIn(username: string, password: string): Observable<LoginResponse> {
        return this.baseDataService.post('auth/login', {
            username,
            password,
        });
    }

}
