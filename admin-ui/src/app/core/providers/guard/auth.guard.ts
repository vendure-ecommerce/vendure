import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { StateStore } from '../../../state/state-store.service';
import { flatMap, mergeMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UserActions } from '../../../state/user/user-actions';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
                private userActions: UserActions,
                private store: StateStore) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {

        return this.store.select(state => state.user.isLoggedIn).pipe(
            mergeMap(loggedIn => {
                if (!loggedIn) {
                    return this.userActions.checkAuth();
                } else {
                    return of(true);
                }
            }),
            tap(authenticated => {
                if (authenticated) {
                    return true;
                } else {
                    this.router.navigate(['/login']);
                    return false;
                }
            }),
        );
    }
}
