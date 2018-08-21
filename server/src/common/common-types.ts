import { VendureEntity } from '../entity/base/base.entity';
import { LocaleString } from '../locale/locale-types';

/**
 * Creates a type based on T, but with all properties non-optional
 * and readonly.
 */
export type ReadOnlyRequired<T> = { +readonly [K in keyof T]-?: T[K] };

/**
 * Given an array type e.g. Array<string>, return the inner type e.g. string.
 */
export type UnwrappedArray<T extends any[]> = T[number];

/**
 * Parameters for list queries
 */
export interface ListQueryOptions<T extends VendureEntity> {
    take: number;
    skip: number;
    sort: SortParameter<T>;
}

export type SortOrder = 'ASC' | 'DESC';

export type PrimitiveFields<T extends VendureEntity> = {
    [K in keyof T]: T[K] extends LocaleString | number | string ? K : never
}[keyof T];

export type SortParameter<T extends VendureEntity> = { [K in PrimitiveFields<T>]?: SortOrder } &
    CustomFieldSortParameter;

export type CustomFieldSortParameter = {
    [customField: string]: SortOrder;
};
