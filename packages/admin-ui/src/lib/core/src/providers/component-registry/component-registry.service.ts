import { Injectable, Type } from '@angular/core';

import { FormInputComponent, InputComponentConfig } from '../../common/component-registry-types';

@Injectable({
    providedIn: 'root',
})
export class ComponentRegistryService {
    private inputComponentMap = new Map<string, Type<FormInputComponent>>();

    registerInputComponent(id: string, component: Type<FormInputComponent>) {
        if (this.inputComponentMap.has(id)) {
            throw new Error(
                `Cannot register an InputComponent with the id "${id}", as one with that id already exists`,
            );
        }
        this.inputComponentMap.set(id, component);
    }

    getInputComponent(id: string): Type<FormInputComponent> | undefined {
        return this.inputComponentMap.get(id);
    }
}
