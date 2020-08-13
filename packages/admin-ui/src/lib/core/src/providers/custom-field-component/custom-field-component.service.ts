import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { Type } from '@vendure/common/lib/shared-types';

import { FormInputComponent } from '../../common/component-registry-types';
import { CustomFields, CustomFieldsFragment } from '../../common/generated-types';
import { ComponentRegistryService } from '../component-registry/component-registry.service';

export type CustomFieldConfigType = CustomFieldsFragment;

export interface CustomFieldControl extends FormInputComponent<CustomFieldConfigType> {}

export type CustomFieldEntityName = Exclude<keyof CustomFields, '__typename'>;

/**
 * This service allows the registration of custom controls for customFields.
 */
@Injectable({
    providedIn: 'root',
})
export class CustomFieldComponentService {
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private componentRegistryService: ComponentRegistryService,
    ) {}

    /**
     * Register a CustomFieldControl component to be used with the specified customField and entity.
     */
    registerCustomFieldComponent(
        entity: CustomFieldEntityName,
        fieldName: string,
        component: Type<CustomFieldControl>,
    ) {
        const id = this.generateId(entity, fieldName, true);
        this.componentRegistryService.registerInputComponent(id, component);
    }

    /**
     * Checks whether a custom component is registered for the given entity custom field,
     * and if so returns the ID of that component.
     */
    customFieldComponentExists(entity: CustomFieldEntityName, fieldName: string): string | undefined {
        const id = this.generateId(entity, fieldName, true);
        return this.componentRegistryService.getInputComponent(id) ? id : undefined;
    }

    private generateId(entity: CustomFieldEntityName, fieldName: string, isCustomField: boolean) {
        let id = entity;
        if (isCustomField) {
            id += '-customFields';
        }
        id += '-' + fieldName;
        return id;
    }
}
