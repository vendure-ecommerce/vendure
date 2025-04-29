import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header.js';
import { DataTable, FacetedFilter } from '@/components/data-table/data-table.js';
import {
    FieldInfo,
    getObjectPathToPaginatedList,
    getTypeFieldInfo,
} from '@/framework/document-introspection/get-document-structure.js';
import { useListQueryFields } from '@/framework/document-introspection/hooks.js';
import { api } from '@/graphql/api.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';
import { DisplayComponent } from '@/framework/component-registry/dynamic-component.js';
import { ResultOf } from '@/graphql/graphql.js';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { Trans, useLingui } from '@/lib/trans.js';
import { useQuery } from '@tanstack/react-query';
import {
    ColumnFiltersState,
    ColumnSort,
    createColumnHelper,
    SortingState,
    Table,
} from '@tanstack/react-table';
import { AccessorKeyColumnDef, ColumnDef, Row, TableOptions, VisibilityState } from '@tanstack/table-core';
import { EllipsisIcon, TrashIcon } from 'lucide-react';
import React, { useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button.js';

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

export type CustomizeColumnConfig<T extends TypedDocumentNode<any, any>> = {
    [Key in keyof PaginatedListItemFields<T>]?: Partial<
        ColumnDef<PaginatedListItemFields<T>, PaginatedListItemFields<T>[Key]>
    >;
};

export type FacetedFilterConfig<T extends TypedDocumentNode<any, any>> = {
    [Key in keyof PaginatedListItemFields<T>]?: FacetedFilter;
};

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

export interface PaginatedListDataTableProps<
    T extends TypedDocumentNode<U, V>,
    U extends any,
    V extends ListQueryOptionsShape,
    AC extends AdditionalColumns<T>,
> {
    listQuery: T;
    deleteMutation?: TypedDocumentNode<any, any>;
    transformQueryKey?: (queryKey: any[]) => any[];
    transformVariables?: (variables: V) => V;
    customizeColumns?: CustomizeColumnConfig<T>;
    additionalColumns?: AC;
    defaultColumnOrder?: (keyof PaginatedListItemFields<T> | AC[number]['id'])[];
    defaultVisibility?: Partial<Record<keyof PaginatedListItemFields<T>, boolean>>;
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
    disableViewOptions?: boolean;
    transformData?: (data: PaginatedListItemFields<T>[]) => PaginatedListItemFields<T>[];
    setTableOptions?: (table: TableOptions<any>) => TableOptions<any>;
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
    disableViewOptions,
    setTableOptions,
    transformData,
}: PaginatedListDataTableProps<T, U, V, AC>) {
    const [searchTerm, setSearchTerm] = React.useState<string>('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const queryClient = useQueryClient();

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
        listQuery,
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

    const { data } = useQuery({
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
            return api.query(listQuery, transformedVariables);
        },
        queryKey,
    });

    const fields = useListQueryFields(listQuery);
    const paginatedListObjectPath = getObjectPathToPaginatedList(listQuery);

    let listData = data as any;
    for (const path of paginatedListObjectPath) {
        listData = listData?.[path];
    }

    const columnHelper = createColumnHelper<PaginatedListItemFields<T>>();

    const { columns, customFieldColumnNames } = useMemo(() => {
        const columnConfigs: Array<{ fieldInfo: FieldInfo; isCustomField: boolean }> = [];
        const customFieldColumnNames: string[] = [];

        columnConfigs.push(
            ...fields // Filter out custom fields
                .filter(field => field.name !== 'customFields' && !field.type.endsWith('CustomFields'))
                .map(field => ({ fieldInfo: field, isCustomField: false })),
        );

        const customFieldColumn = fields.find(field => field.name === 'customFields');
        if (customFieldColumn && customFieldColumn.type !== 'JSON') {
            const customFieldFields = getTypeFieldInfo(customFieldColumn.type);
            columnConfigs.push(
                ...customFieldFields.map(field => ({ fieldInfo: field, isCustomField: true })),
            );
            customFieldColumnNames.push(...customFieldFields.map(field => field.name));
        }

        const queryBasedColumns = columnConfigs.map(({ fieldInfo, isCustomField }) => {
            const customConfig = customizeColumns?.[fieldInfo.name as keyof PaginatedListItemFields<T>] ?? {};
            const { header, ...customConfigRest } = customConfig;
            const enableColumnFilter = fieldInfo.isScalar && !facetedFilters?.[fieldInfo.name];

            return columnHelper.accessor(fieldInfo.name as any, {
                id: fieldInfo.name,
                meta: { fieldInfo, isCustomField },
                enableColumnFilter,
                enableSorting: fieldInfo.isScalar,
                // Filtering is done on the server side, but we set this to 'equalsString' because
                // otherwise the TanStack Table with apply an "auto" function which somehow
                // prevents certain filters from working.
                filterFn: 'equalsString',
                cell: ({ cell, row }) => {
                    const value = !isCustomField
                        ? cell.getValue()
                        : (row.original as any)?.customFields?.[fieldInfo.name];
                    if (fieldInfo.list && Array.isArray(value)) {
                        return value.join(', ');
                    }
                    if (
                        (fieldInfo.type === 'DateTime' && typeof value === 'string') ||
                        value instanceof Date
                    ) {
                        return <DisplayComponent id="vendure:dateTime" value={value} />;
                    }
                    if (fieldInfo.type === 'Boolean') {
                        if (cell.column.id === 'enabled') {
                            return <DisplayComponent id="vendure:booleanBadge" value={value} />;
                        } else {
                            return <DisplayComponent id="vendure:booleanCheckbox" value={value} />;
                        }
                    }
                    if (fieldInfo.type === 'Asset') {
                        return <DisplayComponent id="vendure:asset" value={value} />;
                    }
                    if (value !== null && typeof value === 'object') {
                        return JSON.stringify(value);
                    }
                    return value;
                },
                header: headerContext => {
                    return (
                        <DataTableColumnHeader headerContext={headerContext} customConfig={customConfig} />
                    );
                },
                ...customConfigRest,
            });
        });

        let finalColumns = [...queryBasedColumns];

        for (const [id, column] of Object.entries(additionalColumns ?? {})) {
            if (!id) {
                throw new Error('Column id is required');
            }
            finalColumns.push(columnHelper.accessor(id as any, { ...column, id }));
        }

        if (defaultColumnOrder) {
            // ensure the columns with ids matching the items in defaultColumnOrder
            // appear as the first columns in sequence, and leave the remainder in the
            // existing order
            const orderedColumns = finalColumns
                .filter(column => column.id && defaultColumnOrder.includes(column.id))
                .sort((a, b) => defaultColumnOrder.indexOf(a.id) - defaultColumnOrder.indexOf(b.id));
            const remainingColumns = finalColumns.filter(
                column => !column.id || !defaultColumnOrder.includes(column.id),
            );
            finalColumns = [...orderedColumns, ...remainingColumns];
        }

        if (rowActions || deleteMutation) {
            const rowActionColumn = getRowActions(rowActions, deleteMutation);
            if (rowActionColumn) {
                finalColumns.push(rowActionColumn);
            }
        }

        return { columns: finalColumns, customFieldColumnNames };
    }, [fields, customizeColumns, rowActions]);

    const columnVisibility = getColumnVisibility(fields, defaultVisibility, customFieldColumnNames);
    const transformedData =
        typeof transformData === 'function' ? transformData(listData?.items ?? []) : (listData?.items ?? []);
    return (
        <PaginatedListContext.Provider value={{ refetchPaginatedList }}>
            <DataTable
                columns={columns}
                data={transformedData}
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
                setTableOptions={setTableOptions}
            />
        </PaginatedListContext.Provider>
    );
}

function getRowActions(
    rowActions?: RowAction<any>[],
    deleteMutation?: TypedDocumentNode<any, any>,
): AccessorKeyColumnDef<any> | undefined {
    return {
        id: 'actions',
        accessorKey: 'actions',
        header: 'Actions',
        enableColumnFilter: false,
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <EllipsisIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {rowActions?.map((action, index) => (
                            <DropdownMenuItem onClick={() => action.onClick?.(row)} key={index}>
                                {action.label}
                            </DropdownMenuItem>
                        ))}
                        {deleteMutation && (
                            <DeleteMutationRowAction deleteMutation={deleteMutation} row={row} />
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    };
}

function DeleteMutationRowAction({
    deleteMutation,
    row,
}: {
    deleteMutation: TypedDocumentNode<any, any>;
    row: Row<{ id: string }>;
}) {
    const { refetchPaginatedList } = usePaginatedList();
    const { i18n } = useLingui();
    const { mutate: deleteMutationFn } = useMutation({
        mutationFn: api.mutate(deleteMutation),
        onSuccess: (result: { [key: string]: { result: 'DELETED' | 'NOT_DELETED'; message: string } }) => {
            const unwrappedResult = Object.values(result)[0];
            if (unwrappedResult.result === 'DELETED') {
                refetchPaginatedList();
                toast.success(i18n.t('Deleted successfully'));
            } else {
                toast.error(i18n.t('Failed to delete'), {
                    description: unwrappedResult.message,
                });
            }
        },
        onError: (err: Error) => {
            toast.error(i18n.t('Failed to delete'), {
                description: err.message,
            });
        },
    });
    return (
        <DropdownMenuItem onClick={() => deleteMutationFn({ id: row.original.id })}>
            <div className="flex items-center gap-2 text-destructive">
                <TrashIcon className="w-4 h-4 text-destructive" />
                <Trans>Delete</Trans>
            </div>
        </DropdownMenuItem>
    );
}
/**
 * Returns the default column visibility configuration.
 */
function getColumnVisibility(
    fields: FieldInfo[],
    defaultVisibility?: Record<string, boolean | undefined>,
    customFieldColumnNames?: string[],
): Record<string, boolean> {
    const allDefaultsTrue = defaultVisibility && Object.values(defaultVisibility).every(v => v === true);
    const allDefaultsFalse = defaultVisibility && Object.values(defaultVisibility).every(v => v === false);
    return {
        id: false,
        createdAt: false,
        updatedAt: false,
        ...(allDefaultsTrue ? { ...Object.fromEntries(fields.map(f => [f.name, false])) } : {}),
        ...(allDefaultsFalse ? { ...Object.fromEntries(fields.map(f => [f.name, true])) } : {}),
        ...defaultVisibility,
        // Make custom fields hidden by default
        ...(customFieldColumnNames
            ? { ...Object.fromEntries(customFieldColumnNames.map(f => [f, false])) }
            : {}),
    };
}
