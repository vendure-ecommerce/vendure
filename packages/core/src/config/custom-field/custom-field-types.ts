import {
    BooleanCustomFieldConfig as GraphQLBooleanCustomFieldConfig,
    CustomField,
    DateTimeCustomFieldConfig as GraphQLDateTimeCustomFieldConfig,
    FloatCustomFieldConfig as GraphQLFloatCustomFieldConfig,
    IntCustomFieldConfig as GraphQLIntCustomFieldConfig,
    LocaleStringCustomFieldConfig as GraphQLLocaleStringCustomFieldConfig,
    LocaleTextCustomFieldConfig as GraphQLLocaleTextCustomFieldConfig,
    LocalizedString,
    Permission,
    RelationCustomFieldConfig as GraphQLRelationCustomFieldConfig,
    StringCustomFieldConfig as GraphQLStringCustomFieldConfig,
    TextCustomFieldConfig as GraphQLTextCustomFieldConfig,
} from '@vendure/common/lib/generated-types';
import {
    CustomFieldsObject,
    CustomFieldType,
    DefaultFormComponentId,
    Type,
    UiComponentConfig,
} from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { Injector } from '../../common/injector';
import { VendureEntity } from '../../entity/base/base.entity';

// prettier-ignore
export type DefaultValueType<T extends CustomFieldType> =
    T extends 'string' | 'localeString' | 'text' | 'localeText' ? string :
        T extends 'int' | 'float' ? number :
            T extends 'boolean' ? boolean :
                T extends 'datetime' ? Date :
                    T extends 'relation' ? any : never;

export type BaseTypedCustomFieldConfig<T extends CustomFieldType, C extends CustomField> = Omit<
    C,
    '__typename' | 'list' | 'requiresPermission'
> & {
    type: T;
    /**
     * @description
     * Whether the custom field is available via the Shop API.
     * @default true
     */
    public?: boolean;
    nullable?: boolean;
    unique?: boolean;
    /**
     * @description
     * The permission(s) required to read or write to this field.
     * If the user has at least one of these permissions, they will be
     * able to access the field.
     *
     * @since 2.2.0
     */
    requiresPermission?: Array<Permission | string> | Permission | string;
    ui?: UiComponentConfig<DefaultFormComponentId | string>;
};

/**
 * @description
 * Configures a custom field on an entity in the {@link CustomFields} config object.
 *
 * @docsCategory custom-fields
 */
export type TypedCustomSingleFieldConfig<
    T extends CustomFieldType,
    C extends CustomField,
> = BaseTypedCustomFieldConfig<T, C> & {
    list?: false;
    defaultValue?: DefaultValueType<T>;
    validate?: (
        value: DefaultValueType<T>,
        injector: Injector,
        ctx: RequestContext,
    ) => string | LocalizedString[] | void | Promise<string | LocalizedString[] | void>;
};

export type TypedCustomListFieldConfig<
    T extends CustomFieldType,
    C extends CustomField,
> = BaseTypedCustomFieldConfig<T, C> & {
    list?: true;
    defaultValue?: Array<DefaultValueType<T>>;
    validate?: (value: Array<DefaultValueType<T>>) => string | LocalizedString[] | void;
};

export type TypedCustomFieldConfig<
    T extends CustomFieldType,
    C extends CustomField,
> = BaseTypedCustomFieldConfig<T, C> &
    (TypedCustomSingleFieldConfig<T, C> | TypedCustomListFieldConfig<T, C>);

export type StringCustomFieldConfig = TypedCustomFieldConfig<'string', GraphQLStringCustomFieldConfig>;
export type LocaleStringCustomFieldConfig = TypedCustomFieldConfig<
    'localeString',
    GraphQLLocaleStringCustomFieldConfig
>;
export type TextCustomFieldConfig = TypedCustomFieldConfig<'text', GraphQLTextCustomFieldConfig>;
export type LocaleTextCustomFieldConfig = TypedCustomFieldConfig<
    'localeText',
    GraphQLLocaleTextCustomFieldConfig
>;
export type IntCustomFieldConfig = TypedCustomFieldConfig<'int', GraphQLIntCustomFieldConfig>;
export type FloatCustomFieldConfig = TypedCustomFieldConfig<'float', GraphQLFloatCustomFieldConfig>;
export type BooleanCustomFieldConfig = TypedCustomFieldConfig<'boolean', GraphQLBooleanCustomFieldConfig>;
export type DateTimeCustomFieldConfig = TypedCustomFieldConfig<'datetime', GraphQLDateTimeCustomFieldConfig>;
export type RelationCustomFieldConfig = TypedCustomFieldConfig<
    'relation',
    Omit<GraphQLRelationCustomFieldConfig, 'entity' | 'scalarFields'>
> & {
    entity: Type<VendureEntity>;
    graphQLType?: string;
    eager?: boolean;
    inverseSide?: string | ((object: any) => any);
};

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
    | LocaleTextCustomFieldConfig
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
 * @example
 * ```ts
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
export type CustomFields = {
    Address?: CustomFieldConfig[];
    Administrator?: CustomFieldConfig[];
    Asset?: CustomFieldConfig[];
    Channel?: CustomFieldConfig[];
    Collection?: CustomFieldConfig[];
    Customer?: CustomFieldConfig[];
    CustomerGroup?: CustomFieldConfig[];
    Facet?: CustomFieldConfig[];
    FacetValue?: CustomFieldConfig[];
    Fulfillment?: CustomFieldConfig[];
    GlobalSettings?: CustomFieldConfig[];
    Order?: CustomFieldConfig[];
    OrderLine?: CustomFieldConfig[];
    PaymentMethod?: CustomFieldConfig[];
    Product?: CustomFieldConfig[];
    ProductOption?: CustomFieldConfig[];
    ProductOptionGroup?: CustomFieldConfig[];
    ProductVariant?: CustomFieldConfig[];
    ProductVariantPrice?: CustomFieldConfig[];
    Promotion?: CustomFieldConfig[];
    Region?: CustomFieldConfig[];
    Seller?: CustomFieldConfig[];
    ShippingMethod?: CustomFieldConfig[];
    StockLocation?: CustomFieldConfig[];
    TaxCategory?: CustomFieldConfig[];
    TaxRate?: CustomFieldConfig[];
    User?: CustomFieldConfig[];
    Zone?: CustomFieldConfig[];
} & { [entity: string]: CustomFieldConfig[] };

/**
 * This interface should be implemented by any entity which can be extended
 * with custom fields.
 */
export interface HasCustomFields {
    customFields: CustomFieldsObject;
}
