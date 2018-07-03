import { Observable } from 'rxjs';
import { LOG_IN, LOG_OUT, REQUEST_COMPLETED, REQUEST_STARTED } from '../mutations/local-mutations';
import { GET_NEWTORK_STATUS, GET_USER_STATUS } from '../queries/local-queries';
import { GetNetworkStatus, GetUserStatus, LogIn, LogInVariables, LogOut, RequestCompleted, RequestStarted } from '../types/gql-generated-types';
import { QueryResult } from '../types/query-result';
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

    loginSuccess(username: string): Observable<LogIn> {
        return this.baseDataService.mutate<LogIn, LogInVariables>(LOG_IN, {
            username,
            loginTime: Date.now().toString(),
        });
    }

    logOut(): Observable<LogOut> {
        return this.baseDataService.mutate(LOG_OUT);
    }

    userStatus(): QueryResult<GetUserStatus> {
        return this.baseDataService.query<GetUserStatus>(GET_USER_STATUS);
    }

}
