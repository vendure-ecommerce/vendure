import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ADMIN_UI_VERSION, AuthService, AUTH_REDIRECT_PARAM, getAppConfig } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    username = '';
    password = '';
    rememberMe = false;
    version = ADMIN_UI_VERSION;
    errorMessage: string | undefined;
    brand = getAppConfig().brand;
    hideVendureBranding = getAppConfig().hideVendureBranding;
    hideVersion = getAppConfig().hideVersion;

    constructor(private authService: AuthService, private router: Router) {}

    logIn(): void {
        this.errorMessage = undefined;
        this.authService.logIn(this.username, this.password, this.rememberMe).subscribe(result => {
            switch (result.__typename) {
                case 'CurrentUser':
                    const redirect = this.getRedirectRoute();
                    this.router.navigateByUrl(redirect ? redirect : '/');
                    break;
                case 'InvalidCredentialsError':
                case 'NativeAuthStrategyError':
                    this.errorMessage = result.message;
                    break;
            }
        });
    }

    /**
     * Attempts to read a redirect param from the current url and parse it into a
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
