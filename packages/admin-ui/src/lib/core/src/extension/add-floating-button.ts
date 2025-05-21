import { Provider } from '@angular/core';
import { APP_INITIALIZER } from '@angular/core';
import { FloatingButton } from '../providers/floating-button/floating-button-types';

import { FloatingButtonService } from '../providers/floating-button/floating-button.service';

export function addFloatingButton(config: Omit<FloatingButton, 'visible'>): Provider {
    return {
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: (floatingButtonService: FloatingButtonService) => () => {
            floatingButtonService.addFloatingButton(config);
        },
        deps: [FloatingButtonService],
    };
}
