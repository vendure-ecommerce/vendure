import { CustomFieldConfig as GraphQLCustomFieldConfig } from '@vendure/common/lib/generated-types';
import { CustomFieldsObject, CustomFieldType } from '@vendure/common/src/shared-types';

/**
 * @description
 * Configures a custom field on an entity in the {@link CustomFields} config object.
 *
 * @docsCategory custom-fields
 */
export interface CustomFieldConfig extends Omit<GraphQLCustomFieldConfig, '__typename'> {
    type: CustomFieldType;
}

/**
 * @description
 * Most entities can have additional fields added to them by defining an array of {@link CustomFieldConfig}
 * objects on against the corresponding key.
 *
 * @example
 * ```TypeScript
 * bootstrap({
 *     // ...
 *     customFields: {
 *         Product: [
 *             { name: 'infoUrl', type: 'string' },
 *             { name: 'downloadable', type: 'boolean' },
 *             { name: 'shortName', type: 'localeString' },
 *         ],
 *         User: [
 *             { name: 'socialLoginToken', type: 'string' },
 *         ],
 *     },
 * })
 * ```
 *
 * @docsCategory custom-fields
 */
export interface CustomFields {
    Address?: CustomFieldConfig[];
    Collection?: CustomFieldConfig[];
    Customer?: CustomFieldConfig[];
    Facet?: CustomFieldConfig[];
    FacetValue?: CustomFieldConfig[];
    GlobalSettings?: CustomFieldConfig[];
    OrderLine?: CustomFieldConfig[];
    Product?: CustomFieldConfig[];
    ProductOption?: CustomFieldConfig[];
    ProductOptionGroup?: CustomFieldConfig[];
    ProductVariant?: CustomFieldConfig[];
    User?: CustomFieldConfig[];
}

/**
 * This interface should be implemented by any entity which can be extended
 * with custom fields.
 */
export interface HasCustomFields {
    customFields: CustomFieldsObject;
}
