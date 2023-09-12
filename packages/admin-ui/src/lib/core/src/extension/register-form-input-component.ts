import { APP_INITIALIZER, FactoryProvider, Type } from '@angular/core';
import { FormInputComponent } from '../common/component-registry-types';
import { ComponentRegistryService } from '../providers/component-registry/component-registry.service';

/**
 * @description
 * Registers a custom FormInputComponent which can be used to control the argument inputs
 * of a {@link ConfigurableOperationDef} (e.g. CollectionFilter, ShippingMethod etc) or for
 * a custom field.
 *
 * @example
 * ```ts
 * \@NgModule({
 *   imports: [SharedModule],
 *   declarations: [MyCustomFieldControl],
 *   providers: [
 *       registerFormInputComponent('my-custom-input', MyCustomFieldControl),
 *   ],
 * })
 * export class MyUiExtensionModule {}
 * ```
 *
 * This input component can then be used in a custom field:
 *
 * @example
 * ```ts
 * const config = {
 *   // ...
 *   customFields: {
 *     ProductVariant: [
 *       {
 *         name: 'rrp',
 *         type: 'int',
 *         ui: { component: 'my-custom-input' },
 *       },
 *     ]
 *   }
 * }
 * ```
 *
 * or with an argument of a {@link ConfigurableOperationDef}:
 *
 * @example
 * ```ts
 * args: {
 *   rrp: { type: 'int', ui: { component: 'my-custom-input' } },
 * }
 * ```
 *
 * @docsCategory custom-input-components
 */
export function registerFormInputComponent(id: string, component: Type<FormInputComponent>): FactoryProvider {
    return {
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: (registry: ComponentRegistryService) => () => {
            registry.registerInputComponent(id, component);
        },
        deps: [ComponentRegistryService],
    };
}
