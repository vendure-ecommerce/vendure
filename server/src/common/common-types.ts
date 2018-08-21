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
export interface ListQueryOptions {
    take: number;
    skip: number;
    sort: SortParameter[];
    filter: FilterParameter[];
}

export interface SortParameter {
    field: string;
    order: 'asc' | 'desc';
}

export interface FilterParameter {
    field: string;
    operator: FilterOperator;
    value: string | number;
}

export type FilterOperator = 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'contains' | 'startsWith';
