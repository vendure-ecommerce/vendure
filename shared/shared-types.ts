/**
 * A recursive implementation of the Partial<T> type.
 */
export type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };

// tslint:disable:ban-types
/**
 * A type representing the type rather than instance of a class.
 */
export type Type<T> = {
    new (): T;
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
