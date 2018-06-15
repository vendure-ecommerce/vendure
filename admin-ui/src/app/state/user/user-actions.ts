import {Injectable} from '@angular/core';

import { StateStore } from '../state-store.service';

import {Actions} from './user-state';
import { DataService } from '../../core/providers/data/data.service';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LocalStorageService } from '../../core/providers/local-storage/local-storage.service';
import { handleError } from '../handle-error';

@Injectable()
export class UserActions {

    constructor(private store: StateStore,
                private localStorageService: LocalStorageService,
                private dataService: DataService) {}

    checkAuth(): Observable<boolean> {
        if (!this.localStorageService.get('authToken')) {
            return of(false);
        }

        this.store.dispatch(new Actions.Login());

        return this.dataService.user.checkLoggedIn().pipe(
            map(result => {
                this.store.dispatch(new Actions.LoginSuccess({
                    username: result.identifier,
                    loginTime: Date.now(),
                }));
                return true;
            }),
            catchError(err => of(false)),
        );
    }

    logIn(username: string, password: string): Observable<any> {
        this.store.dispatch(new Actions.Login());

        return this.dataService.user.logIn(username, password).pipe(
            map(result => {
                this.store.dispatch(new Actions.LoginSuccess({
                    username,
                    loginTime: Date.now(),
                }));
                this.localStorageService.set('authToken', result.token);
            }),
            catchError(err => {
                this.store.dispatch(new Actions.LoginError(err));
                return throwError(err);
            }),
        );
    }

    logOut(): void {
        this.store.dispatch(new Actions.Logout());
    }

}
