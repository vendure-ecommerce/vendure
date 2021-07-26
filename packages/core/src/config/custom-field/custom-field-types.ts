import {
    BooleanCustomFieldConfig as GraphQLBooleanCustomFieldConfig,
    CustomField,
    DateTimeCustomFieldConfig as GraphQLDateTimeCustomFieldConfig,
    FloatCustomFieldConfig as GraphQLFloatCustomFieldConfig,
    IntCustomFieldConfig as GraphQLIntCustomFieldConfig,
    LocaleStringCustomFieldConfig as GraphQLLocaleStringCustomFieldConfig,
    LocalizedString,
    RelationCustomFieldConfig as GraphQLRelationCustomFieldConfig,
    StringCustomFieldConfig as GraphQLStringCustomFieldConfig,
    TextCustomFieldConfig as GraphQLTextCustomFieldConfig,
} from '@vendure/common/lib/generated-types';
import { CustomFieldsObject, CustomFieldType, Type } from '@vendure/common/lib/shared-types';

import { Injector } from '../../common/injector';
import { VendureEntity } from '../../entity/base/base.entity';

// prettier-ignore
export type DefaultValueType<T extends CustomFieldType> =
    T extends 'string' | 'localeString' ? string :
        T extends 'int' | 'float' ? number :
            T extends 'boolean' ? boolean :
                T extends 'datetime' ? Date :
                    T extends 'relation' ? any : never;

export type BaseTypedCustomFieldConfig<T extends CustomFieldType, C extends CustomField> = Omit<
    C,
    '__typename' | 'list'
> & {
    type: T;
    /**
     * @description
     * Whether or not the custom field is available via the Shop API.
     * @default true
     */
    public?: boolean;
    nullable?: boolean;
};

/**
 * @description
 * Configures a custom field on an entity in the {@link CustomFields} config object.
 *
 * @docsCategory custom-fields
 */
export type TypedCustomSingleFieldConfig<
    T extends CustomFieldType,
    C extends CustomField
> = BaseTypedCustomFieldConfig<T, C> & {
    list?: false;
    defaultValue?: DefaultValueType<T>;
    validate?: (
        value: DefaultValueType<T>,
        injector: Injector,
    ) => string | LocalizedString[] | void | Promise<string | LocalizedString[] | void>;
};

export type TypedCustomListFieldConfig<
    T extends CustomFieldType,
    C extends CustomField
> = BaseTypedCustomFieldConfig<T, C> & {
    list?: true;
    defaultValue?: Array<DefaultValueType<T>>;
    validate?: (value: Array<DefaultValueType<T>>) => string | LocalizedString[] | void;
};

export type TypedCustomFieldConfig<
    T extends CustomFieldType,
    C extends CustomField
> = BaseTypedCustomFieldConfig<T, C> &
    (TypedCustomSingleFieldConfig<T, C> | TypedCustomListFieldConfig<T, C>);

export type StringCustomFieldConfig = TypedCustomFieldConfig<'string', GraphQLStringCustomFieldConfig>;
export type LocaleStringCustomFieldConfig = TypedCustomFieldConfig<
    'localeString',
    GraphQLLocaleStringCustomFieldConfig
>;
export type TextCustomFieldConfig = TypedCustomFieldConfig<'text', GraphQLTextCustomFieldConfig>;
export type IntCustomFieldConfig = TypedCustomFieldConfig<'int', GraphQLIntCustomFieldConfig>;
export type FloatCustomFieldConfig = TypedCustomFieldConfig<'float', GraphQLFloatCustomFieldConfig>;
export type BooleanCustomFieldConfig = TypedCustomFieldConfig<'boolean', GraphQLBooleanCustomFieldConfig>;
export type DateTimeCustomFieldConfig = TypedCustomFieldConfig<'datetime', GraphQLDateTimeCustomFieldConfig>;
export type RelationCustomFieldConfig = TypedCustomFieldConfig<
    'relation',
    Omit<GraphQLRelationCustomFieldConfig, 'entity' | 'scalarFields'>
> & { entity: Type<VendureEntity>; graphQLType?: string; eager?: boolean };

/**
 * @description
 * An object used to configure a custom field.
 *
 * @docsCategory custom-fields
 */
export type CustomFieldConfig =
    | StringCustomFieldConfig
    | LocaleStringCustomFieldConfig
    | TextCustomFieldConfig
    | IntCustomFieldConfig
    | FloatCustomFieldConfig
    | BooleanCustomFieldConfig
    | DateTimeCustomFieldConfig
    | RelationCustomFieldConfig;

/**
 * @description
 * Most entities can have additional fields added to them by defining an array of {@link CustomFieldConfig}
 * objects on against the corresponding key.
 *
 * ### Configuration options
 *
 * All custom fields share some common properties:
 *
 * * `name: string`: The name of the field
 * * `type: string`: A string of type {@link CustomFieldType}
 * * `list: boolean`: If set to `true`, then the field will be an array of the specified type
 * * `label?: LocalizedString[]`: An array of localized labels for the field.
 * * `description?: LocalizedString[]`: An array of localized descriptions for the field.
 * * `public?: boolean`: Whether or not the custom field is available via the Shop API. Defaults to `true`
 * * `readonly?: boolean`: Whether or not the custom field can be updated via the GraphQL APIs. Defaults to `false`
 * * `internal?: boolean`: Whether or not the custom field is exposed at all via the GraphQL APIs. Defaults to `false`
 * * `defaultValue?: any`: The default value when an Entity is created with this field.
 * * `nullable?: boolean`: Whether the field is nullable in the database. If set to `false`, then a `defaultValue` should be provided.
 * * `validate?: (value: any) => string | LocalizedString[] | void`: A custom validation function. If the value is valid, then
 *     the function should not return a value. If a string or LocalizedString array is returned, this is interpreted as an error message.
 *
 * The `LocalizedString` type looks like this:
 *
 * ```TypeScript
 * type LocalizedString = {
 *   languageCode: LanguageCode;
 *   value: string;
 * };
 * ```
 *
 * In addition to the common properties, the following field types have some type-specific properties:
 *
 * #### `string` type
 *
 * * `pattern?: string`: A regex pattern which the field value must match
 * * `options?: { value: string; label?: LocalizedString[]; };`: An array of pre-defined options for the field.
 * * `length?: number`: The max length of the varchar created in the database. Defaults to 255. Maximum is 65,535.
 *
 * #### `localeString` type
 *
 * * `pattern?: string`: A regex pattern which the field value must match
 * * `length?: number`: The max length of the varchar created in the database. Defaults to 255. Maximum is 65,535.
 *
 * #### `int` & `float` type
 *
 * * `min?: number`: The minimum permitted value
 * * `max?: number`: The maximum permitted value
 * * `step?: number`: The step value
 *
 * #### `datetime` type
 *
 * The min, max & step properties for datetime fields are intended to be used as described in
 * [the datetime-local docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#Additional_attributes)
 *
 * * `min?: string`: The earliest permitted date
 * * `max?: string`: The latest permitted date
 * * `step?: string`: The step value
 *
 * #### `relation` type
 *
 * * `entity: VendureEntity`: The entity which this custom field is referencing
 * * `eager?: boolean`: Whether to [eagerly load](https://typeorm.io/#/eager-and-lazy-relations) the relation. Defaults to false.
 * * `graphQLType?: string`: The name of the GraphQL type that corresponds to the entity.
 *     Can be omitted if it is the same, which is usually the case.
 *
 * @example
 * ```TypeScript
 * bootstrap({
 *     // ...
 *     customFields: {
 *         Product: [
 *             { name: 'infoUrl', type: 'string' },
 *             { name: 'downloadable', type: 'boolean', defaultValue: false },
 *             { name: 'shortName', type: 'localeString' },
 *         ],
 *         User: [
 *             { name: 'socialLoginToken', type: 'string', public: false },
 *         ],
 *     },
 * })
 * ```
 *
 * @docsCategory custom-fields
 */
export interface CustomFields {
    Address?: CustomFieldConfig[];
    Administrator?: CustomFieldConfig[];
    Asset?: CustomFieldConfig[];
    Channel?: CustomFieldConfig[];
    Collection?: CustomFieldConfig[];
    Customer?: CustomFieldConfig[];
    Facet?: CustomFieldConfig[];
    FacetValue?: CustomFieldConfig[];
    Fulfillment?: CustomFieldConfig[];
    GlobalSettings?: CustomFieldConfig[];
    Order?: CustomFieldConfig[];
    OrderLine?: CustomFieldConfig[];
    Product?: CustomFieldConfig[];
    ProductOption?: CustomFieldConfig[];
    ProductOptionGroup?: CustomFieldConfig[];
    ProductVariant?: CustomFieldConfig[];
    User?: CustomFieldConfig[];
    ShippingMethod?: CustomFieldConfig[];
}

/**
 * This interface should be implemented by any entity which can be extended
 * with custom fields.
 */
export interface HasCustomFields {
    customFields: CustomFieldsObject;
}
