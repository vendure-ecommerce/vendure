import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../../core/providers/auth/auth.service';

/**
 * This guard prevents loggen-in users from navigating to the login screen.
 */
@Injectable()
export class LoginGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        return this.authService.checkAuthenticatedStatus().pipe(
            map(authenticated => {
                if (authenticated) {
                    this.router.navigate(['/']);
                }
                return !authenticated;
            }),
        );
    }
}
