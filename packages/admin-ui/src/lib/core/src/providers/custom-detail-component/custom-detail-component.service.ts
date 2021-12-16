import { APP_INITIALIZER, Injectable, Provider } from '@angular/core';

import { CustomDetailComponentConfig } from './custom-detail-component-types';

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

@Injectable({
    providedIn: 'root',
})
export class CustomDetailComponentService {
    private customDetailComponents = new Map<string, CustomDetailComponentConfig[]>();

    registerCustomDetailComponent(config: CustomDetailComponentConfig) {
        if (this.customDetailComponents.has(config.locationId)) {
            this.customDetailComponents.get(config.locationId)?.push(config);
        } else {
            this.customDetailComponents.set(config.locationId, [config]);
        }
    }

    getCustomDetailComponentsFor(locationId: string): CustomDetailComponentConfig[] {
        return this.customDetailComponents.get(locationId) ?? [];
    }
}
