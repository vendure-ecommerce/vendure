import { Injectable, OnDestroy } from '@angular/core';
import { DataService } from '@vendure/admin-ui/src/app/data/providers/data.service';
import { parse } from 'graphql';

import { ExtensionMesssage } from './extension-message-types';

@Injectable()
export class ExtensionHostService implements OnDestroy {
    private extensionWindow: Window;

    constructor(private dataService: DataService) {}

    init(extensionWindow: Window) {
        this.extensionWindow = extensionWindow;

        window.addEventListener('message', this.handleMessage);
    }

    ngOnDestroy(): void {
        window.removeEventListener('message', this.handleMessage);
    }

    private handleMessage = (message: MessageEvent) => {
        const { data, origin } = message;
        if (this.isExtensionMessage(data)) {
            switch (data.type) {
                case 'query': {
                    const { document, variables, fetchPolicy } = data.data;
                    this.dataService
                        .query(parse(document), variables, fetchPolicy)
                        .single$.subscribe(result => this.sendMessage(result, origin, data.requestId));
                    break;
                }
                case 'mutation': {
                    const { document, variables } = data.data;
                    this.dataService
                        .mutate(parse(document), variables)
                        .subscribe(result => this.sendMessage(result, origin, data.requestId));
                }
            }
        }
    };

    private sendMessage(message: any, origin, requestId: string) {
        this.extensionWindow.postMessage({ requestId, data: message }, origin);
    }

    private isExtensionMessage(input: any): input is ExtensionMesssage {
        return input.hasOwnProperty('type') && input.hasOwnProperty('data');
    }
}
