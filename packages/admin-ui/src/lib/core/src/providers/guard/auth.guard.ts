import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

/**
 * This guard prevents unauthorized users from accessing any routes which require
 * authorization.
 */
@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        return this.authService.checkAuthenticatedStatus().pipe(
            tap(authenticated => {
                if (!authenticated) {
                    this.router.navigate(['/login']);
                }
            }),
        );
    }
}
