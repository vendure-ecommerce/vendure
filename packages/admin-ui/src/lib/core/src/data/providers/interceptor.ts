import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { DEFAULT_AUTH_TOKEN_HEADER_KEY } from '@vendure/common/lib/shared-constants';
import { AdminUiConfig } from '@vendure/common/lib/shared-types';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { getAppConfig } from '../../app.config';
import { AuthService } from '../../providers/auth/auth.service';
import { LocalStorageService } from '../../providers/local-storage/local-storage.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { DataService } from '../providers/data.service';

export const AUTH_REDIRECT_PARAM = 'redirectTo';

/**
 * The default interceptor examines all HTTP requests & responses and automatically updates the requesting state
 * and shows error notifications.
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
    private readonly tokenMethod: AdminUiConfig['tokenMethod'] = 'cookie';
    private readonly authTokenHeaderKey: string;

    constructor(
        private dataService: DataService,
        private injector: Injector,
        private authService: AuthService,
        private router: Router,
        private localStorageService: LocalStorageService,
    ) {
        this.tokenMethod = getAppConfig().tokenMethod;
        this.authTokenHeaderKey = getAppConfig().authTokenHeaderKey || DEFAULT_AUTH_TOKEN_HEADER_KEY;
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.dataService.client.startRequest().subscribe();
        return this.dataService.client.uiState().single$.pipe(
            switchMap(({ uiState }) => {
                const request = req.clone({
                    setParams: {
                        languageCode: uiState?.contentLanguage ?? '',
                    },
                });
                return next.handle(request);
            }),
            tap(
                event => {
                    if (event instanceof HttpResponse) {
                        this.checkForAuthToken(event);
                        this.notifyOnError(event);
                        this.dataService.client.completeRequest().subscribe();
                    }
                },
                err => {
                    if (err instanceof HttpErrorResponse) {
                        this.notifyOnError(err);
                        this.dataService.client.completeRequest().subscribe();
                    } else {
                        this.displayErrorNotification(err.message);
                    }
                },
            ),
        );
    }

    private notifyOnError(response: HttpResponse<any> | HttpErrorResponse) {
        if (response instanceof HttpErrorResponse) {
            if (response.status === 0) {
                const { apiHost, apiPort } = getAppConfig();
                this.displayErrorNotification(_(`error.could-not-connect-to-server`), {
                    url: `${apiHost}:${apiPort}`,
                });
            } else if (response.status === 503 && response.url?.endsWith('/health')) {
                this.displayErrorNotification(_(`error.health-check-failed`));
            } else {
                this.displayErrorNotification(this.extractErrorFromHttpResponse(response));
            }
        } else {
            // GraphQL errors still return 200 OK responses, but have the actual error message
            // inside the body of the response.
            const graqhQLErrors = response.body.errors;
            if (graqhQLErrors && Array.isArray(graqhQLErrors)) {
                const firstCode: string = graqhQLErrors[0]?.extensions?.code;
                if (firstCode === 'FORBIDDEN') {
                    this.authService.logOut().subscribe(() => {
                        if (!window.location.pathname.includes('login')) {
                            const path = graqhQLErrors[0].path.join(' > ');
                            this.displayErrorNotification(_(`error.403-forbidden`), { path });
                        }
                        this.router.navigate(['/login'], {
                            queryParams: {
                                [AUTH_REDIRECT_PARAM]: btoa(this.router.url),
                            },
                        });
                    });
                } else if (firstCode === 'CHANNEL_NOT_FOUND') {
                    const message = graqhQLErrors.map(err => err.message).join('\n');
                    this.displayErrorNotification(message);
                    this.localStorageService.remove('activeChannelToken');
                } else {
                    const message = graqhQLErrors.map(err => err.message).join('\n');
                    this.displayErrorNotification(message);
                }
            }
        }
    }

    private extractErrorFromHttpResponse(response: HttpErrorResponse): string {
        const errors = response.error.errors;
        if (Array.isArray(errors)) {
            return errors.map(e => e.message).join('\n');
        } else {
            return response.message;
        }
    }

    /**
     * We need to lazily inject the NotificationService since it depends on the I18nService which
     * eventually depends on the HttpClient (used to load messages from json files). If we were to
     * directly inject NotificationService into the constructor, we get a cyclic dependency.
     */
    private displayErrorNotification(message: string, vars?: Record<string, any>): void {
        const notificationService = this.injector.get<NotificationService>(NotificationService);
        notificationService.error(message, vars);
    }

    /**
     * If the server is configured to use the "bearer" tokenMethod, each response should be checked
     * for the existence of an auth token.
     */
    private checkForAuthToken(response: HttpResponse<any>) {
        if (this.tokenMethod === 'bearer') {
            const authToken = response.headers.get(this.authTokenHeaderKey);
            if (authToken) {
                this.localStorageService.set('authToken', authToken);
            }
        }
    }
}
