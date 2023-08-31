import { Injectable, InjectionToken, Type } from '@angular/core';

import { FormInputComponent, InputComponentConfig } from '../../common/component-registry-types';

export const INPUT_COMPONENT_OPTIONS = new InjectionToken<{ component?: any }>('INPUT_COMPONENT_OPTIONS');

@Injectable({
    providedIn: 'root',
})
export class ComponentRegistryService {
    private inputComponentMap = new Map<string, { type: Type<FormInputComponent<any>>; options?: any }>();

    registerInputComponent(id: string, component: Type<FormInputComponent<any>>, options?: any) {
        if (this.inputComponentMap.has(id)) {
            throw new Error(
                `Cannot register an InputComponent with the id "${id}", as one with that id already exists`,
            );
        }
        this.inputComponentMap.set(id, { type: component, options });
    }

    getInputComponent(id: string): { type: Type<FormInputComponent<any>>; options?: any } | undefined {
        return this.inputComponentMap.get(id);
    }
}
