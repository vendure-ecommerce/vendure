import {
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    Injectable,
    Injector,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Type } from '@vendure/common/lib/shared-types';

import { CustomFields, CustomFieldsFragment } from '../../../common/generated-types';
export type CustomFieldConfig = CustomFieldsFragment;

export interface CustomFieldControl {
    formControl: FormControl;
    customFieldConfig: CustomFieldConfig;
}

export type CustomFieldEntityName = Exclude<keyof CustomFields, '__typename'>;

/**
 * This service allows the registration of custom controls for customFields.
 */
@Injectable()
export class CustomFieldComponentService {
    private registry: { [K in CustomFieldEntityName]?: { [name: string]: Type<CustomFieldControl> } } = {};

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private injector: Injector) {}

    /**
     * Register a CustomFieldControl component to be used with the specified customField and entity.
     */
    registerCustomFieldComponent(
        entity: CustomFieldEntityName,
        fieldName: string,
        component: Type<CustomFieldControl>,
    ) {
        if (!this.registry[entity]) {
            this.registry[entity] = {};
        }
        Object.assign(this.registry[entity], { [fieldName]: component });
    }

    getCustomFieldComponent(
        entity: CustomFieldEntityName,
        fieldName: string,
    ): ComponentFactory<CustomFieldControl> | undefined {
        const entityFields = this.registry[entity];
        const componentType = entityFields && entityFields[fieldName];
        if (componentType) {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
            return componentFactory;
        }
    }
}
