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
    filter: FilterParameter<T>;
}

export type SortOrder = 'ASC' | 'DESC';

// prettier-ignore
export type PrimitiveFields<T extends VendureEntity> = {
    [K in keyof T]: T[K] extends LocaleString | number | string | boolean | Date ? K : never
}[keyof T];

// prettier-ignore
export type SortParameter<T extends VendureEntity> = {
    [K in PrimitiveFields<T>]?: SortOrder
} & CustomFieldSortParameter;

// prettier-ignore
export type CustomFieldSortParameter = {
    [customField: string]: SortOrder;
};

// prettier-ignore
export type FilterParameter<T extends VendureEntity> = {
    [K in PrimitiveFields<T>]?: T[K] extends string | LocaleString ? StringOperators
        : T[K] extends number ? NumberOperators
            : T[K] extends boolean ? BooleanOperators
                : T[K] extends Date ? DateOperators : StringOperators;
};

export interface StringOperators {
    eq?: string;
    contains?: string;
}

export interface BooleanOperators {
    eq?: boolean;
}

export interface NumberRange {
    start: number;
    end: number;
}

export interface NumberOperators {
    eq?: number;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    between?: NumberRange;
}

export interface DateRange {
    start: string;
    end: string;
}

export interface DateOperators {
    eq?: string;
    before?: string;
    after?: string;
    between?: DateRange;
}
