import { FormControl } from '@angular/forms';

/**
 * @description
 * This interface should be implemented by any component being used as a custom input. For example,
 * inputs for custom fields, or for configurable arguments.
 *
 * @docsCategory custom-input-components
 */
export interface FormInputComponent<C = InputComponentConfig> {
    /**
     * @description
     * Should be set to `true` if this component is designed to handle lists.
     * If `true` then the formControl value will be an array of all the
     * values in the list.
     */
    isListInput?: boolean;
    /**
     * @description
     * This is set by the Admin UI when consuming this component, indicating that the
     * component should be rendered in a read-only state.
     */
    readonly: boolean;
    /**
     * @description
     * This controls the actual value of the form item. The current value is available
     * as `this.formControl.value`, and an Observable stream of value changes is available
     * as `this.formControl.valueChanges`. To update the value, use `.setValue(val)` and then
     * `.markAsDirty()`.
     *
     * Full documentation can be found in the [Angular docs](https://angular.io/api/forms/FormControl).
     */
    formControl: FormControl;
    /**
     * @description
     * The `config` property contains the full configuration object of the custom field or configurable argument.
     */
    config: C;
}

export type InputComponentConfig = {
    [prop: string]: any;
};
