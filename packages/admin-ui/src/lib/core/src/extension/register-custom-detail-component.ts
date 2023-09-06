import { APP_INITIALIZER, Provider } from '@angular/core';
import { CustomDetailComponentConfig } from '../providers/custom-detail-component/custom-detail-component-types';
import { CustomDetailComponentService } from '../providers/custom-detail-component/custom-detail-component.service';

/**
 * @description
 * Registers a {@link CustomDetailComponent} to be placed in a given location. This allows you
 * to embed any type of custom Angular component in the entity detail pages of the Admin UI.
 *
 * @docsCategory custom-detail-components
 */
export function registerCustomDetailComponent(config: CustomDetailComponentConfig): Provider {
    return {
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: (customDetailComponentService: CustomDetailComponentService) => () => {
            customDetailComponentService.registerCustomDetailComponent(config);
        },
        deps: [CustomDetailComponentService],
    };
}
