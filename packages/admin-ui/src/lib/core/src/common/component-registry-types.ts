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

/**
 * @description
 * The valid locationIds for registering action bar items.
 *
 * @docsCategory action-bar
 */
export type ActionBarLocationId =
    | 'administrator-detail'
    | 'administrator-list'
    | 'asset-detail'
    | 'asset-list'
    | 'channel-detail'
    | 'channel-list'
    | 'collection-detail'
    | 'collection-list'
    | 'country-detail'
    | 'country-list'
    | 'customer-detail'
    | 'customer-list'
    | 'customer-group-list'
    | 'facet-detail'
    | 'facet-list'
    | 'global-setting-detail'
    | 'system-status'
    | 'job-list'
    | 'order-detail'
    | 'order-list'
    | 'payment-method-detail'
    | 'payment-method-list'
    | 'product-detail'
    | 'product-list'
    | 'promotion-detail'
    | 'promotion-list'
    | 'role-detail'
    | 'role-list'
    | 'shipping-method-detail'
    | 'shipping-method-list'
    | 'tax-category-detail'
    | 'tax-category-list'
    | 'tax-rate-detail'
    | 'tax-rate-list'
    | 'zone-list';

/**
 * @description
 * The valid locations for embedding a {@link CustomDetailComponent}.
 *
 * @docsCategory custom-detail-components
 */
export type CustomDetailComponentLocationId =
    | 'administrator-detail'
    | 'channel-detail'
    | 'collection-detail'
    | 'country-detail'
    | 'customer-detail'
    | 'facet-detail'
    | 'global-settings-detail'
    | 'order-detail'
    | 'payment-method-detail'
    | 'product-detail'
    | 'promotion-detail'
    | 'shipping-method-detail'
    | 'tax-category-detail'
    | 'tax-rate-detail';

export type UIExtensionLocationId = ActionBarLocationId | CustomDetailComponentLocationId;
