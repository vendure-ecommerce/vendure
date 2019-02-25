// tslint:disable:no-shadowed-variable
// prettier-ignore
/**
 * A recursive implementation of the Partial<T> type.
 * Source: https://stackoverflow.com/a/49936686/772859
 */
export type DeepPartial<T> = {
  [P in keyof T]?: null | (T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : DeepPartial<T[P]>)
};
// tslint:enable:no-shadowed-variable

/**
 * A type representing the type rather than instance of a class.
 */
export interface Type<T> extends Function {
    new (...args: any[]): T;
}

/**
 * A type describing the shape of a paginated list response
 */
export type PaginatedList<T> = {
    items: T[];
    totalItems: number;
};

/**
 * @description
 * An entity ID. Depending on the configured {@link EntityIdStrategy}, it will be either
 * a `string` or a `number`;
 *
 * @docsCategory entities
 * @docsWeight 0
 */
export type ID = string | number;

/**
 * @description
 * A data type for a custom field.
 *
 * @docsCategory custom-fields
 */
export type CustomFieldType = 'string' | 'localeString' | 'int' | 'float' | 'boolean' | 'datetime';

/**
 * @description
 * Configures a custom field on an entity in the {@link CustomFields} config object.
 *
 * @docsCategory custom-fields
 */
export interface CustomFieldConfig {
    name: string;
    type: CustomFieldType;
}

/**
 * @description
 * The certain entities can have additional fields added to them by defining an array of {@link CustomFieldConfig}
 * objects on against the corresponding key.
 *
 * @docsCategory custom-fields
 */
export interface CustomFields {
    Address?: CustomFieldConfig[];
    Customer?: CustomFieldConfig[];
    Facet?: CustomFieldConfig[];
    FacetValue?: CustomFieldConfig[];
    GlobalSettings?: CustomFieldConfig[];
    Product?: CustomFieldConfig[];
    ProductCategory?: CustomFieldConfig[];
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

export type MayHaveCustomFields = Partial<HasCustomFields>;

export type CustomFieldsObject = { [key: string]: any; };

/**
 * This interface describes the shape of the JSON config file used by the Admin UI.
 */
export interface AdminUiConfig {
    apiHost: string;
    apiPort: number;
    adminApiPath: string;
}
