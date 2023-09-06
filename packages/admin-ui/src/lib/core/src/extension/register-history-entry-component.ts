import { APP_INITIALIZER, Provider } from '@angular/core';
import { HistoryEntryConfig } from '../providers/custom-history-entry-component/history-entry-component-types';
import { HistoryEntryComponentService } from '../providers/custom-history-entry-component/history-entry-component.service';

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
