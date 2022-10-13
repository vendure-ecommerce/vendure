import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ADMIN_UI_VERSION, AuthService, AUTH_REDIRECT_PARAM, getAppConfig } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    imageCookieName = 'vendureLoginImage';
    username = '';
    password = '';
    rememberMe = false;
    version = ADMIN_UI_VERSION;
    errorMessage: string | undefined;
    brand = getAppConfig().brand;
    hideVendureBranding = getAppConfig().hideVendureBranding;
    hideVersion = getAppConfig().hideVersion;
    customImageUrl = getAppConfig().loginImage;
    imageUrl = '';
    imageLocation = '';
    imageCreator = '';

    constructor(private authService: AuthService, private router: Router, private httpClient: HttpClient) {
        if (this.customImageUrl) {
            this.imageUrl = this.customImageUrl;
        } else {
            this.loadImage();
        }
    }

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

    loadImage() {
        const dataFromCookie = this.getCookie(this.imageCookieName);

        if (dataFromCookie) {
            this.updateImage(JSON.parse(dataFromCookie));
            return;
        }

        this.httpClient
            .get('https://api.unsplash.com/photos/random', {
                params: new HttpParams()
                    .append('orientation', 'landscape')
                    .append('client_id', '55rhuvzXFasQaP2cVKBIrc5NhhwlYU2QlUwxVL78UkY'),
            })
            .toPromise()
            .then(res => {
                this.setCookie(this.imageCookieName, JSON.stringify(res), 2);
                this.updateImage(res);
            });
    }

    updateImage(res) {
        const user: any = (res as any).user;
        const location: any = (res as any).location;

        this.imageUrl = (res as any).urls.regular;
        this.imageCreator = user.name;
        this.imageLocation = location.name;
    }

    setCookie(name: string, value: string, days: number) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/';
    }

    getCookie(name: string) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let c of ca) {
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
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
