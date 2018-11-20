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
 * An entity ID
 */
export type ID = string | number;

export type CustomFieldType = 'string' | 'localeString' | 'int' | 'float' | 'boolean' | 'datetime';

export interface CustomFieldConfig {
    name: string;
    type: CustomFieldType;
}

export interface CustomFields {
    Address?: CustomFieldConfig[];
    Customer?: CustomFieldConfig[];
    Facet?: CustomFieldConfig[];
    FacetValue?: CustomFieldConfig[];
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

export type MayHaveCustomFields = Partial<HasCustomFields>;

export type CustomFieldsObject = { [key: string]: any; };
