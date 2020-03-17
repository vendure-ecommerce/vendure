import { Injectable, OnDestroy } from '@angular/core';
import { ExtensionMesssage, MessageResponse } from '@vendure/common/lib/extension-host-types';
import { assertNever } from '@vendure/common/lib/shared-utils';
import { parse } from 'graphql';
import { merge, Observer, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { DataService } from '../../../data/providers/data.service';
import { NotificationService } from '../../../providers/notification/notification.service';

@Injectable()
export class ExtensionHostService implements OnDestroy {
    private extensionWindow: Window;
    private cancellationMessage$ = new Subject<string>();
    private destroyMessage$ = new Subject<void>();

    constructor(private dataService: DataService, private notificationService: NotificationService) {}

    init(extensionWindow: Window) {
        this.extensionWindow = extensionWindow;
        window.addEventListener('message', this.handleMessage);
    }

    destroy() {
        window.removeEventListener('message', this.handleMessage);
        this.destroyMessage$.next();
    }

    ngOnDestroy(): void {
        this.destroy();
    }

    private handleMessage = (message: MessageEvent) => {
        const { data, origin } = message;
        if (this.isExtensionMessage(data)) {
            const cancellation$ = this.cancellationMessage$.pipe(
                filter(requestId => requestId === data.requestId),
            );
            const end$ = merge(cancellation$, this.destroyMessage$);
            switch (data.type) {
                case 'cancellation': {
                    this.cancellationMessage$.next(data.requestId);
                    break;
                }
                case 'destroy': {
                    this.destroyMessage$.next();
                    break;
                }
                case 'graphql-query': {
                    const { document, variables, fetchPolicy } = data.data;
                    this.dataService
                        .query(parse(document), variables, fetchPolicy)
                        .stream$.pipe(takeUntil(end$))
                        .subscribe(this.createObserver(data.requestId, origin));
                    break;
                }
                case 'graphql-mutation': {
                    const { document, variables } = data.data;
                    this.dataService
                        .mutate(parse(document), variables)
                        .pipe(takeUntil(end$))
                        .subscribe(this.createObserver(data.requestId, origin));
                    break;
                }
                case 'notification': {
                    this.notificationService.notify(data.data);
                    break;
                }
                default:
                    assertNever(data);
            }
        }
    }

    private createObserver(requestId: string, origin: string): Observer<any> {
        return {
            next: data => this.sendMessage({ data, error: false, complete: false, requestId }, origin),
            error: err => this.sendMessage({ data: err, error: true, complete: false, requestId }, origin),
            complete: () => this.sendMessage({ data: null, error: false, complete: true, requestId }, origin),
        };
    }

    private sendMessage(response: MessageResponse, origin: string) {
        this.extensionWindow.postMessage(response, origin);
    }

    private isExtensionMessage(input: any): input is ExtensionMesssage {
        return (
            input.hasOwnProperty('type') && input.hasOwnProperty('data') && input.hasOwnProperty('requestId')
        );
    }
}
