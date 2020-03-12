import {
    APP_INITIALIZER,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    Injectable,
    Injector,
    Provider,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Type } from '@vendure/common/lib/shared-types';

import { CustomFields, CustomFieldsFragment } from '../../common/generated-types';
export type CustomFieldConfigType = CustomFieldsFragment;

export interface CustomFieldControl {
    formControl: FormControl;
    customFieldConfig: CustomFieldConfigType;
}

export type CustomFieldEntityName = Exclude<keyof CustomFields, '__typename'>;

/**
 * @description
 * Registers a custom component to act as the form input control for the given custom field.
 * This should be used in the NgModule `providers` array of your ui extension module.
 *
 * @example
 * ```TypeScript
 * \@NgModule({
 *   imports: [SharedModule],
 *   declarations: [MyCustomFieldControl],
 *   providers: [
 *       registerCustomFieldComponent('Product', 'someCustomField', MyCustomFieldControl),
 *   ],
 * })
 * export class MyUiExtensionModule {}
 * ```
 */
export function registerCustomFieldComponent(
    entity: CustomFieldEntityName,
    fieldName: string,
    component: Type<CustomFieldControl>,
): Provider {
    return {
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: (customFieldComponentService: CustomFieldComponentService) => () => {
            customFieldComponentService.registerCustomFieldComponent(entity, fieldName, component);
        },
        deps: [CustomFieldComponentService],
    };
}

/**
 * This service allows the registration of custom controls for customFields.
 */
@Injectable({
    providedIn: 'root',
})
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
