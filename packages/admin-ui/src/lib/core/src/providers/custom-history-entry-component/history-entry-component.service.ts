import { APP_INITIALIZER, Injectable, Provider, Type } from '@angular/core';

import { HistoryEntryComponent, HistoryEntryConfig } from './history-entry-component-types';

/**
 * @description
 * Registers a {@link HistoryEntryComponent} for displaying history entries in the Order/Customer
 * history timeline.
 *
 * @since 1.9.0
 * @docsCategory custom-history-entry-components
 */
export function registerHistoryEntryComponent(config: HistoryEntryConfig): Provider {
    return {
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: (customHistoryEntryComponentService: HistoryEntryComponentService) => () => {
            customHistoryEntryComponentService.registerComponent(config);
        },
        deps: [HistoryEntryComponentService],
    };
}

@Injectable({
    providedIn: 'root',
})
export class HistoryEntryComponentService {
    private customEntryComponents = new Map<string, HistoryEntryConfig>();

    registerComponent(config: HistoryEntryConfig) {
        this.customEntryComponents.set(config.type, config);
    }

    getComponent(type: string): Type<HistoryEntryComponent> | undefined {
        return this.customEntryComponents.get(type)?.component;
    }
}
