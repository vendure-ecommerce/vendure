import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/providers/auth/auth.service';
import { AUTH_REDIRECT_PARAM } from '../../../data/providers/interceptor';

@Component({
    selector: 'vdr-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    username = '';
    password = '';
    rememberMe = false;

    constructor(private authService: AuthService, private router: Router) {}

    logIn(): void {
        this.authService.logIn(this.username, this.password, this.rememberMe).subscribe(
            () => {
                const redirect = this.getRedirectRoute();
                this.router.navigateByUrl(redirect ? redirect : '/');
            },
            err => {
                /* error handled by http interceptor */
            },
        );
    }

    /**
     * Attemps to read a redirect param from the current url and parse it into a
     * route from which the user was redirected after a 401 error.
     */
    private getRedirectRoute(): string | undefined {
        let redirectTo: string | undefined;
        const re = new RegExp(`${AUTH_REDIRECT_PARAM}=(.*)`);
        try {
            const redirectToParam = window.location.search.match(re);
            if (redirectToParam && 1 < redirectToParam.length) {
                redirectTo = atob(decodeURIComponent(redirectToParam[1]));
            }
        } catch (e) {
            // ignore
        }
        return redirectTo;
    }
}
