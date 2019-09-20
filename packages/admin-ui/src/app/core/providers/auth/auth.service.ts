import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, mapTo, mergeMap, switchMap } from 'rxjs/operators';
import { DEFAULT_CHANNEL_CODE } from 'shared/shared-constants';

import { CurrentUserChannel, CurrentUserFragment, SetAsLoggedIn } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';
import { ServerConfigService } from '../../../data/server-config';
import { LocalStorageService } from '../local-storage/local-storage.service';

/**
 * This service handles logic relating to authentication of the current user.
 */
@Injectable()
export class AuthService {
    constructor(
        private localStorageService: LocalStorageService,
        private dataService: DataService,
        private serverConfigService: ServerConfigService,
    ) {}

    /**
     * Attempts to log in via the REST login endpoint and updates the app
     * state on success.
     */
    logIn(username: string, password: string, rememberMe: boolean): Observable<SetAsLoggedIn.Mutation> {
        return this.dataService.auth.attemptLogin(username, password, rememberMe).pipe(
            switchMap(response => {
                this.setChannelToken(response.login.user.channels);
                return this.serverConfigService.getServerConfig();
            }),
            switchMap(() => {
                return this.dataService.client.loginSuccess(username);
            }),
        );
    }

    /**
     * Update the user status to being logged out.
     */
    logOut(): Observable<boolean> {
        return this.dataService.client.userStatus().single$.pipe(
            switchMap(status => {
                if (status.userStatus.isLoggedIn) {
                    return this.dataService.client
                        .logOut()
                        .pipe(mergeMap(() => this.dataService.auth.logOut()));
                } else {
                    return [];
                }
            }),
            mapTo(true),
        );
    }

    /**
     * Checks the app state to see if the user is already logged in,
     * and if not, attempts to validate any auth token found.
     */
    checkAuthenticatedStatus(): Observable<boolean> {
        return this.dataService.client.userStatus().single$.pipe(
            mergeMap(data => {
                if (!data.userStatus.isLoggedIn) {
                    return this.validateAuthToken();
                } else {
                    return of(true);
                }
            }),
        );
    }

    /**
     * Checks for an auth token and if found, attempts to validate
     * that token against the API.
     */
    validateAuthToken(): Observable<boolean> {
        return this.dataService.auth.checkLoggedIn().single$.pipe(
            mergeMap(result => {
                if (!result.me) {
                    return of(false) as any;
                }
                this.setChannelToken(result.me.channels);
                return this.dataService.client.loginSuccess(result.me.identifier);
            }),
            mapTo(true),
            catchError(err => of(false)),
        );
    }

    private setChannelToken(userChannels: CurrentUserFragment['channels']) {
        const defaultChannel = userChannels.find(c => c.code === DEFAULT_CHANNEL_CODE);
        this.localStorageService.set(
            'activeChannelToken',
            defaultChannel ? defaultChannel.token : userChannels[0].token,
        );
    }
}
