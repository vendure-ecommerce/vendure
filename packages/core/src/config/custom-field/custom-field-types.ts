import {
    BooleanCustomFieldConfig as GraphQLBooleanCustomFieldConfig,
    CustomField,
    DateTimeCustomFieldConfig as GraphQLDateTimeCustomFieldConfig,
    FloatCustomFieldConfig as GraphQLFloatCustomFieldConfig,
    IntCustomFieldConfig as GraphQLIntCustomFieldConfig,
    LocaleStringCustomFieldConfig as GraphQLLocaleStringCustomFieldConfig,
    LocalizedString,
    StringCustomFieldConfig as GraphQLStringCustomFieldConfig,
} from '@vendure/common/lib/generated-types';
import { CustomFieldsObject, CustomFieldType } from '@vendure/common/src/shared-types';

// prettier-ignore
export type DefaultValueType<T extends CustomFieldType> =
    T extends 'string' | 'localeString' ? string :
        T extends 'int' | 'float' ? number :
            T extends 'boolean' ? boolean :
                T extends 'datetime' ? Date : never;

/**
 * @description
 * Configures a custom field on an entity in the {@link CustomFields} config object.
 *
 * @docsCategory custom-fields
 */
export type TypedCustomFieldConfig<T extends CustomFieldType, C extends CustomField> = Omit<
    C,
    '__typename'
> & {
    type: T;
    /**
     * Whether or not the custom field is available via the Shop API.
     * @default true
     */
    public?: boolean;
    defaultValue?: DefaultValueType<T>;
    nullable?: boolean;
    validate?: (value: DefaultValueType<T>) => string | LocalizedString[] | void;
};
export type StringCustomFieldConfig = TypedCustomFieldConfig<'string', GraphQLStringCustomFieldConfig>;
export type LocaleStringCustomFieldConfig = TypedCustomFieldConfig<'localeString', GraphQLLocaleStringCustomFieldConfig>;
export type IntCustomFieldConfig = TypedCustomFieldConfig<'int', GraphQLIntCustomFieldConfig>;
export type FloatCustomFieldConfig = TypedCustomFieldConfig<'float', GraphQLFloatCustomFieldConfig>;
export type BooleanCustomFieldConfig = TypedCustomFieldConfig<'boolean', GraphQLBooleanCustomFieldConfig>;
export type DateTimeCustomFieldConfig = TypedCustomFieldConfig<'datetime', GraphQLDateTimeCustomFieldConfig>;

export type CustomFieldConfig =
    | StringCustomFieldConfig
    | LocaleStringCustomFieldConfig
    | IntCustomFieldConfig
    | FloatCustomFieldConfig
    | BooleanCustomFieldConfig
    | DateTimeCustomFieldConfig;

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
