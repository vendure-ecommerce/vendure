import { DataTable, FacetedFilter } from '@/vdb/components/data-table/data-table.js';
import {
    getObjectPathToPaginatedList
} from '@/vdb/framework/document-introspection/get-document-structure.js';
import { useListQueryFields } from '@/vdb/framework/document-introspection/hooks.js';
import { api } from '@/vdb/graphql/api.js';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';

import { BulkAction } from '@/vdb/framework/extension-api/types/index.js';
import { ResultOf } from '@/vdb/graphql/graphql.js';
import { useExtendedListQuery } from '@/vdb/hooks/use-extended-list-query.js';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
    ColumnFiltersState,
    ColumnSort,
    SortingState,
    Table
} from '@tanstack/react-table';
import { ColumnDef, Row, TableOptions, VisibilityState } from '@tanstack/table-core';
import React from 'react';
import { getColumnVisibility } from '../data-table/data-table-utils.js';
import { useGeneratedColumns } from '../data-table/use-generated-columns.js';

// Type that identifies a paginated list structure (has items array and totalItems)
type IsPaginatedList<T> = T extends { items: any[]; totalItems: number } ? true : false;

// Helper type to extract string keys from an object
type StringKeys<T> = T extends object ? Extract<keyof T, string> : never;

// Non-recursive approach to find paginated list paths with max 2 levels
// Level 0: Direct top-level check
type Level0PaginatedLists<T> = T extends object ? (IsPaginatedList<T> extends true ? '' : never) : never;

// Level 1: One level deep
type Level1PaginatedLists<T> = T extends object
    ? {
          [K in StringKeys<T>]: NonNullable<T[K]> extends object
              ? IsPaginatedList<NonNullable<T[K]>> extends true
                  ? K
                  : never
              : never;
      }[StringKeys<T>]
    : never;

// Level 2: Two levels deep
type Level2PaginatedLists<T> = T extends object
    ? {
          [K1 in StringKeys<T>]: NonNullable<T[K1]> extends object
              ? {
                    [K2 in StringKeys<NonNullable<T[K1]>>]: NonNullable<NonNullable<T[K1]>[K2]> extends object
                        ? IsPaginatedList<NonNullable<NonNullable<T[K1]>[K2]>> extends true
                            ? `${K1}.${K2}`
                            : never
                        : never;
                }[StringKeys<NonNullable<T[K1]>>]
              : never;
      }[StringKeys<T>]
    : never;

// Combine all levels
type FindPaginatedListPaths<T> = Level0PaginatedLists<T> | Level1PaginatedLists<T> | Level2PaginatedLists<T>;

// Extract all paths from a TypedDocumentNode
export type PaginatedListPaths<T extends TypedDocumentNode<any, any>> =
    FindPaginatedListPaths<ResultOf<T>> extends infer Paths ? (Paths extends '' ? never : Paths) : never;

export type PaginatedListItemFields<
    T extends TypedDocumentNode<any, any>,
    Path extends PaginatedListPaths<T> = PaginatedListPaths<T>,
> =
    // split the path by '.' if it exists
    Path extends `${infer First}.${infer Rest}`
        ? NonNullable<ResultOf<T>[First]>[Rest]['items'][number]
        : Path extends keyof ResultOf<T>
          ? ResultOf<T>[Path] extends { items: Array<infer Item> }
              ? ResultOf<T>[Path]['items'][number]
              : never
          : never;

export type PaginatedListKeys<
    T extends TypedDocumentNode<any, any>,
    Path extends PaginatedListPaths<T> = PaginatedListPaths<T>,
> = {
    [K in keyof PaginatedListItemFields<T, Path>]: K;
}[keyof PaginatedListItemFields<T, Path>];

// Utility types to include keys inside `customFields` object for typing purposes
export type CustomFieldKeysOfItem<Item> = Item extends { customFields?: infer CF }
    ? Extract<keyof CF, string>
    : never;

export type AllItemFieldKeys<T extends TypedDocumentNode<any, any>> =
    | keyof PaginatedListItemFields<T>
    | CustomFieldKeysOfItem<PaginatedListItemFields<T>>;

export type CustomizeColumnConfig<T extends TypedDocumentNode<any, any>> = {
    [Key in AllItemFieldKeys<T>]?: Partial<ColumnDef<PaginatedListItemFields<T>, any>>;
};

export type FacetedFilterConfig<T extends TypedDocumentNode<any, any>> = {
    [Key in AllItemFieldKeys<T>]?: FacetedFilter;
};

export type ListQueryFields<T extends TypedDocumentNode<any, any>> = {
    [Key in keyof ResultOf<T>]: ResultOf<T>[Key] extends { items: infer U }
        ? U extends any[]
            ? U[number]
            : never
        : never;
}[keyof ResultOf<T>];

export type ListQueryShape =
    | {
          [key: string]: {
              items: any[];
              totalItems: number;
          };
      }
    | {
          [key: string]: {
              [key: string]: {
                  items: any[];
                  totalItems: number;
              };
          };
      };

export type ListQueryOptionsShape = {
    options?: {
        skip?: number;
        take?: number;
        sort?: {
            [key: string]: 'ASC' | 'DESC';
        };
        filter?: any;
    };
    [key: string]: any;
};

export type AdditionalColumns<T extends TypedDocumentNode<any, any>> = {
    [key: string]: ColumnDef<PaginatedListItemFields<T>>;
};

export interface PaginatedListContext {
    refetchPaginatedList: () => void;
}

export const PaginatedListContext = React.createContext<PaginatedListContext | undefined>(undefined);

/**
 * @description
 * Returns the context for the paginated list data table. Must be used within a PaginatedListDataTable.
 *
 * @example
 * ```ts
 * const { refetchPaginatedList } = usePaginatedList();
 *
 * const mutation = useMutation({
 *     mutationFn: api.mutate(updateFacetValueDocument),
 *     onSuccess: () => {
 *         refetchPaginatedList();
 *     },
 * });
 * ```
 */
export function usePaginatedList() {
    const context = React.useContext(PaginatedListContext);
    if (!context) {
        throw new Error('usePaginatedList must be used within a PaginatedListDataTable');
    }
    return context;
}

export interface RowAction<T> {
    label: React.ReactNode;
    onClick?: (row: Row<T>) => void;
}

export type PaginatedListRefresherRegisterFn = (refreshFn: () => void) => void;

export interface PaginatedListDataTableProps<
    T extends TypedDocumentNode<U, V>,
    U extends ListQueryShape,
    V extends ListQueryOptionsShape,
    AC extends AdditionalColumns<T>,
> {
    listQuery: T;
    deleteMutation?: TypedDocumentNode<any, any>;
    transformQueryKey?: (queryKey: any[]) => any[];
    transformVariables?: (variables: V) => V;
    customizeColumns?: CustomizeColumnConfig<T>;
    additionalColumns?: AC;
    defaultColumnOrder?: (keyof ListQueryFields<T> | keyof AC | CustomFieldKeysOfItem<ListQueryFields<T>>)[];
    defaultVisibility?: Partial<Record<AllItemFieldKeys<T>, boolean>>;
    onSearchTermChange?: (searchTerm: string) => NonNullable<V['options']>['filter'];
    page: number;
    itemsPerPage: number;
    sorting: SortingState;
    columnFilters?: ColumnFiltersState;
    onPageChange: (table: Table<any>, page: number, perPage: number) => void;
    onSortChange: (table: Table<any>, sorting: SortingState) => void;
    onFilterChange: (table: Table<any>, filters: ColumnFiltersState) => void;
    onColumnVisibilityChange?: (table: Table<any>, columnVisibility: VisibilityState) => void;
    facetedFilters?: FacetedFilterConfig<T>;
    rowActions?: RowAction<PaginatedListItemFields<T>>[];
    bulkActions?: BulkAction[];
    disableViewOptions?: boolean;
    transformData?: (data: PaginatedListItemFields<T>[]) => PaginatedListItemFields<T>[];
    setTableOptions?: (table: TableOptions<any>) => TableOptions<any>;
    /**
     * Register a function that allows you to assign a refresh function for
     * this list. The function can be assigned to a ref and then called when
     * the list needs to be refreshed.
     */
    registerRefresher?: PaginatedListRefresherRegisterFn;
}

export const PaginatedListDataTableKey = 'PaginatedListDataTable';

export function PaginatedListDataTable<
    T extends TypedDocumentNode<U, V>,
    U extends Record<string, any> = any,
    V extends ListQueryOptionsShape = any,
    AC extends AdditionalColumns<T> = AdditionalColumns<T>,
>({
    listQuery,
    deleteMutation,
    transformQueryKey,
    transformVariables,
    customizeColumns,
    additionalColumns,
    defaultVisibility,
    defaultColumnOrder,
    onSearchTermChange,
    page,
    itemsPerPage,
    sorting,
    columnFilters,
    onPageChange,
    onSortChange,
    onFilterChange,
    onColumnVisibilityChange,
    facetedFilters,
    rowActions,
    bulkActions,
    disableViewOptions,
    setTableOptions,
    transformData,
    registerRefresher,
}: Readonly<PaginatedListDataTableProps<T, U, V, AC>>) {
    const [searchTerm, setSearchTerm] = React.useState<string>('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const queryClient = useQueryClient();
    const extendedListQuery = useExtendedListQuery(listQuery);

    const sort = sorting?.reduce((acc: any, sort: ColumnSort) => {
        const direction = sort.desc ? 'DESC' : 'ASC';
        const field = sort.id;

        if (!field || !direction) {
            return acc;
        }
        return { ...acc, [field]: direction };
    }, {});

    const filter = columnFilters?.length
        ? {
              _and: columnFilters.map(f => {
                  if (Array.isArray(f.value)) {
                      return { [f.id]: { in: f.value } };
                  }
                  return { [f.id]: f.value };
              }),
          }
        : undefined;

    const defaultQueryKey = [
        PaginatedListDataTableKey,
        extendedListQuery,
        page,
        itemsPerPage,
        sorting,
        filter,
        debouncedSearchTerm,
    ];
    const queryKey = transformQueryKey ? transformQueryKey(defaultQueryKey) : defaultQueryKey;

    function refetchPaginatedList() {
        queryClient.invalidateQueries({ queryKey });
    }

    registerRefresher?.(refetchPaginatedList);

    const { data, isFetching } = useQuery({
        queryFn: () => {
            const searchFilter = onSearchTermChange ? onSearchTermChange(debouncedSearchTerm) : {};
            const mergedFilter = { ...filter, ...searchFilter };
            const variables = {
                options: {
                    take: itemsPerPage,
                    skip: (page - 1) * itemsPerPage,
                    sort,
                    filter: mergedFilter,
                },
            } as V;

            const transformedVariables = transformVariables ? transformVariables(variables) : variables;
            return api.query(extendedListQuery, transformedVariables);
        },
        queryKey,
        placeholderData: keepPreviousData,
    });

    const fields = useListQueryFields(extendedListQuery);
    const paginatedListObjectPath = getObjectPathToPaginatedList(extendedListQuery);

    let listData = data as any;
    for (const path of paginatedListObjectPath) {
        listData = listData?.[path];
    }

    const { columns, customFieldColumnNames } = useGeneratedColumns({
        fields,
        customizeColumns,
        rowActions,
        deleteMutation,
        additionalColumns,
        defaultColumnOrder,
    });

    const columnVisibility = getColumnVisibility(fields, defaultVisibility, customFieldColumnNames);
    const transformedData =
        typeof transformData === 'function' ? transformData(listData?.items ?? []) : (listData?.items ?? []);
    return (
        <PaginatedListContext.Provider value={{ refetchPaginatedList }}>
            <DataTable
                columns={columns}
                data={transformedData}
                isLoading={isFetching}
                page={page}
                itemsPerPage={itemsPerPage}
                sorting={sorting}
                columnFilters={columnFilters}
                totalItems={listData?.totalItems ?? 0}
                onPageChange={onPageChange}
                onSortChange={onSortChange}
                onFilterChange={onFilterChange}
                onColumnVisibilityChange={onColumnVisibilityChange}
                onSearchTermChange={onSearchTermChange ? term => setSearchTerm(term) : undefined}
                defaultColumnVisibility={columnVisibility}
                facetedFilters={facetedFilters}
                disableViewOptions={disableViewOptions}
                bulkActions={bulkActions}
                setTableOptions={setTableOptions}
                onRefresh={refetchPaginatedList}
            />
        </PaginatedListContext.Provider>
    );
}

