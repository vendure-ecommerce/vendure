/**
 * A recursive implementation of the Partial<T> type.
 */
export type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };

// tslint:disable:ban-types
/**
 * A type representing the type rather than instance of a class.
 */
export type Type<T> = {
    new (...args: any[]): T;
} & Function;

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
