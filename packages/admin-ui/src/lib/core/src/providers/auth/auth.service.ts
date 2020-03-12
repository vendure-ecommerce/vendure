import { Injectable } from '@angular/core';
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { Observable, of } from 'rxjs';
import { catchError, mapTo, mergeMap, switchMap } from 'rxjs/operators';

import { CurrentUserChannel, CurrentUserFragment, SetAsLoggedIn } from '../../common/generated-types';
import { DataService } from '../../data/providers/data.service';
import { ServerConfigService } from '../../data/server-config';
import { LocalStorageService } from '../local-storage/local-storage.service';

/**
 * This service handles logic relating to authentication of the current user.
 */
@Injectable({
    providedIn: 'root',
})
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
                return this.serverConfigService.getServerConfig().then(() => response.login.user);
            }),
            switchMap(user => {
                const { id } = this.getActiveChannel(user.channels);
                return this.dataService.client.loginSuccess(username, id, user.channels);
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
        return this.dataService.auth.currentUser().single$.pipe(
            mergeMap(result => {
                if (!result.me) {
                    return of(false) as any;
                }
                this.setChannelToken(result.me.channels);
                const { id } = this.getActiveChannel(result.me.channels);
                return this.dataService.client.loginSuccess(result.me.identifier, id, result.me.channels);
            }),
            mapTo(true),
            catchError(err => of(false)),
        );
    }

    private getActiveChannel(userChannels: CurrentUserFragment['channels']) {
        const lastActiveChannelToken = this.localStorageService.get('activeChannelToken');
        if (lastActiveChannelToken) {
            const lastActiveChannel = userChannels.find(c => c.token === lastActiveChannelToken);
            if (lastActiveChannel) {
                return lastActiveChannel;
            }
        }
        const defaultChannel = userChannels.find(c => c.code === DEFAULT_CHANNEL_CODE);
        return defaultChannel || userChannels[0];
    }

    private setChannelToken(userChannels: CurrentUserFragment['channels']) {
        this.localStorageService.set('activeChannelToken', this.getActiveChannel(userChannels).token);
    }
}
