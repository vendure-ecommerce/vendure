import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import { ComponentRegistryService } from '@vendure/admin-ui/core';
import { ElementType } from 'react';
import {
    REACT_INPUT_COMPONENT_OPTIONS,
    ReactFormInputComponent,
} from './components/react-form-input.component';

/**
 * @description
 * Registers a React component to be used as a {@link FormInputComponent}.
 *
 * @docsCategory react-extensions
 */
export function registerReactFormInputComponent(id: string, component: ElementType): FactoryProvider {
    return {
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: (registry: ComponentRegistryService) => () => {
            registry.registerInputComponent(id, ReactFormInputComponent, [
                {
                    provide: REACT_INPUT_COMPONENT_OPTIONS,
                    useValue: {
                        component,
                    },
                },
            ]);
        },
        deps: [ComponentRegistryService],
    };
}
