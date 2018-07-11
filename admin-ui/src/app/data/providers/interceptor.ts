/** Pass untouched request through to the next request handler. */
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { NotificationService } from '../../core/providers/notification/notification.service';

import { DataService } from './data.service';

/**
 * The default interceptor examines all HTTP requests & responses and automatically updates the requesting state
 * and shows error notifications.
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
    constructor(private dataService: DataService, private notification: NotificationService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.dataService.client.startRequest().subscribe();
        return next.handle(req).pipe(
            tap(
                event => {
                    if (event instanceof HttpResponse) {
                        this.notifyOnGraphQLErrors(event);
                        this.dataService.client.completeRequest().subscribe();
                    }
                },
                err => {
                    if (err instanceof HttpErrorResponse) {
                        this.notification.error(err.message);
                        this.dataService.client.completeRequest().subscribe();
                    }
                },
            ),
        );
    }

    /**
     * GraphQL errors still return 200 OK responses, but have the actual error message
     * inside the body of the response.
     */
    private notifyOnGraphQLErrors(response: HttpResponse<any>): void {
        const graqhQLErrors = response.body.errors;
        if (graqhQLErrors && Array.isArray(graqhQLErrors)) {
            const message = graqhQLErrors.map(err => err.message).join('\n');
            this.notification.error(message);
        }
    }
}
