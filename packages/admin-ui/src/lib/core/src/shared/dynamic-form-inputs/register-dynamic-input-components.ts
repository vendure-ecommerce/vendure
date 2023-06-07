import { APP_INITIALIZER, FactoryProvider, Provider, Type } from '@angular/core';

import { FormInputComponent } from '../../common/component-registry-types';
import { ComponentRegistryService } from '../../providers/component-registry/component-registry.service';
import {
    CustomFieldComponentService,
    CustomFieldControl,
    CustomFieldEntityName,
} from '../../providers/custom-field-component/custom-field-component.service';

import { BooleanFormInputComponent } from './boolean-form-input/boolean-form-input.component';
import { HtmlEditorFormInputComponent } from './code-editor-form-input/html-editor-form-input.component';
import { JsonEditorFormInputComponent } from './code-editor-form-input/json-editor-form-input.component';
import { CombinationModeFormInputComponent } from './combination-mode-form-input/combination-mode-form-input.component';
import { CurrencyFormInputComponent } from './currency-form-input/currency-form-input.component';
import { CustomerGroupFormInputComponent } from './customer-group-form-input/customer-group-form-input.component';
import { DateFormInputComponent } from './date-form-input/date-form-input.component';
import { FacetValueFormInputComponent } from './facet-value-form-input/facet-value-form-input.component';
import { NumberFormInputComponent } from './number-form-input/number-form-input.component';
import { PasswordFormInputComponent } from './password-form-input/password-form-input.component';
import { ProductMultiSelectorFormInputComponent } from './product-multi-selector-form-input/product-multi-selector-form-input.component';
import { ProductSelectorFormInputComponent } from './product-selector-form-input/product-selector-form-input.component';
import { RelationFormInputComponent } from './relation-form-input/relation-form-input.component';
import { RichTextFormInputComponent } from './rich-text-form-input/rich-text-form-input.component';
import { SelectFormInputComponent } from './select-form-input/select-form-input.component';
import { TextFormInputComponent } from './text-form-input/text-form-input.component';
import { TextareaFormInputComponent } from './textarea-form-input/textarea-form-input.component';

export const defaultFormInputs = [
    BooleanFormInputComponent,
    CurrencyFormInputComponent,
    DateFormInputComponent,
    FacetValueFormInputComponent,
    NumberFormInputComponent,
    SelectFormInputComponent,
    TextFormInputComponent,
    ProductSelectorFormInputComponent,
    CustomerGroupFormInputComponent,
    PasswordFormInputComponent,
    RelationFormInputComponent,
    TextareaFormInputComponent,
    RichTextFormInputComponent,
    JsonEditorFormInputComponent,
    HtmlEditorFormInputComponent,
    ProductMultiSelectorFormInputComponent,
    CombinationModeFormInputComponent,
];

/**
 * @description
 * Registers a custom FormInputComponent which can be used to control the argument inputs
 * of a {@link ConfigurableOperationDef} (e.g. CollectionFilter, ShippingMethod etc) or for
 * a custom field.
 *
 * @example
 * ```TypeScript
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
 * ```TypeScript
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
 * ```TypeScript
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

/**
 * Registers the default form input components.
 */
export function registerDefaultFormInputs(): FactoryProvider[] {
    return defaultFormInputs.map(cmp => registerFormInputComponent(cmp.id, cmp));
}
