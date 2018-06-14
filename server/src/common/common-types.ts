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
