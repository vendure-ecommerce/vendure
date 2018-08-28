import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { LogIn } from 'shared/generated-types';

import { DataService } from '../../../data/providers/data.service';
import { LocalStorageService } from '../local-storage/local-storage.service';

/**
 * This service handles logic relating to authentication of the current user.
 */
@Injectable()
export class AuthService {
    constructor(private localStorageService: LocalStorageService, private dataService: DataService) {}

    /**
     * Attempts to log in via the REST login endpoint and updates the app
     * state on success.
     */
    logIn(username: string, password: string): Observable<LogIn> {
        return this.dataService.user.attemptLogin(username, password).pipe(
            switchMap(response => {
                this.localStorageService.set('authToken', response.token);
                return this.dataService.client.loginSuccess(username);
            }),
        );
    }

    /**
     * Update the user status to being logged out.
     */
    logOut(): void {
        this.dataService.client.logOut();
        this.localStorageService.remove('authToken');
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
        if (!this.localStorageService.get('authToken')) {
            return of(false);
        }

        return this.dataService.user.checkLoggedIn().pipe(
            map(result => {
                this.dataService.client.loginSuccess(result.identifier);
                return true;
            }),
            catchError(err => of(false)),
        );
    }
}
