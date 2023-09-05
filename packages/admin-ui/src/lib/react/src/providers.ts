import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import { ComponentRegistryService } from '@vendure/admin-ui/core';
import { ElementType } from 'react';
import { ReactFormInputComponent } from './components/react-form-input.component';

export function registerReactFormInputComponent(id: string, component: ElementType): FactoryProvider {
    return {
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: (registry: ComponentRegistryService) => () => {
            registry.registerInputComponent(id, ReactFormInputComponent, { component });
        },
        deps: [ComponentRegistryService],
    };
}
