import { addCustomFields } from '@/vdb/framework/document-introspection/add-custom-fields.js';
import { getObjectPathToPaginatedList } from '@/vdb/framework/document-introspection/get-document-structure.js';
import { useListQueryFields } from '@/vdb/framework/document-introspection/hooks.js';
import { includeOnlySelectedListFields } from '@/vdb/framework/document-introspection/include-only-selected-list-fields.js';
import { BulkAction } from '@/vdb/framework/extension-api/types/index.js';
import { api } from '@/vdb/graphql/api.js';
import { useExtendedListQuery } from '@/vdb/hooks/use-extended-list-query.js';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnFiltersState, ColumnSort, SortingState, Table } from '@tanstack/react-table';
import { TableOptions, VisibilityState } from '@tanstack/table-core';
import { useDebounce } from '@uidotdev/usehooks';
import React from 'react';
import { getColumnVisibility, getStandardizedDefaultColumnOrder } from '../data-table/data-table-utils.js';
import { DataTable } from '../data-table/data-table.js';
import { useGeneratedColumns } from '../data-table/use-generated-columns.js';
import {
    AdditionalColumns,
    AllItemFieldKeys,
    CustomizeColumnConfig,
    FacetedFilterConfig,
    ListQueryFields,
    ListQueryOptionsShape,
    ListQueryShape,
    PaginatedListContext,
    PaginatedListDataTableKey,
    PaginatedListItemFields,
    PaginatedListRefresherRegisterFn,
    RowAction,
} from './paginated-list-data-table.js';

/**
 * @description
 * Props to configure the {@link DraggablePaginatedListDataTable} component.
 *
 * @docsCategory list-views
 * @docsPage DraggablePaginatedListDataTable
 * @since 3.3.0
 */
export interface DraggablePaginatedListDataTableProps<
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
    defaultColumnOrder?: (keyof ListQueryFields<T> | keyof AC)[];
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
    registerRefresher?: PaginatedListRefresherRegisterFn;
    /**
     * @description
     * Callback when items are reordered via drag and drop.
     */
    onReorder?: (
        oldIndex: number,
        newIndex: number,
        item: PaginatedListItemFields<T>,
    ) => void | Promise<void>;
    /**
     * @description
     * When true, drag and drop will be disabled.
     */
    disableDragAndDrop?: boolean;
}

export const DraggablePaginatedListDataTableKey = 'DraggablePaginatedListDataTable';

/**
 * @description
 * A wrapper around the {@link DataTable} component, which automatically configures functionality common to
 * list queries that implement the `PaginatedList` interface, with drag-and-drop reordering capabilities.
 *
 * @docsCategory list-views
 * @docsPage DraggablePaginatedListDataTable
 * @since 3.3.0
 * @docsWeight 0
 */
export function DraggablePaginatedListDataTable<
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
    onReorder,
    disableDragAndDrop = false,
}: Readonly<DraggablePaginatedListDataTableProps<T, U, V, AC>>) {
    const [searchTerm, setSearchTerm] = React.useState<string>('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const queryClient = useQueryClient();
    const extendedListQuery = useExtendedListQuery(addCustomFields(listQuery));

    const sort = sorting?.reduce((acc: any, sort: ColumnSort) => {
        const direction = sort.desc ? 'DESC' : 'ASC';
        const field = sort.id;

        if (!field || !direction) {
            return acc;
        }
        return { ...acc, [field]: direction };
    }, {});

    function refetchPaginatedList() {
        queryClient.invalidateQueries({ queryKey });
    }

    registerRefresher?.(refetchPaginatedList);

    const fields = useListQueryFields(extendedListQuery);
    const paginatedListObjectPath = getObjectPathToPaginatedList(extendedListQuery);

    const { columns, customFieldColumnNames } = useGeneratedColumns({
        fields,
        customizeColumns,
        rowActions,
        bulkActions,
        deleteMutation,
        additionalColumns,
        defaultColumnOrder: getStandardizedDefaultColumnOrder(defaultColumnOrder),
    });
    const columnVisibility = getColumnVisibility(columns, defaultVisibility, customFieldColumnNames);

    const visibleColumns = columns
        .filter(c => columnVisibility[c.id as string] !== false || c.id === 'id')
        .map(c => ({
            name: c.id as string,
            isCustomField: (c.meta as any)?.isCustomField ?? false,
            dependencies: (c.meta as any)?.dependencies ?? [],
        }));
    const minimalListQuery = includeOnlySelectedListFields(extendedListQuery, visibleColumns);

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
        minimalListQuery,
        visibleColumns,
        page,
        itemsPerPage,
        sorting,
        filter,
        debouncedSearchTerm,
    ];
    const queryKey = transformQueryKey ? transformQueryKey(defaultQueryKey) : defaultQueryKey;

    const { data, isFetching } = useQuery({
        queryFn: () => {
            const searchFilter = onSearchTermChange ? onSearchTermChange(debouncedSearchTerm) : {};
            const mergedFilter = { ...filter, ...searchFilter };
            const variables = {
                options: {
                    take: Math.min(itemsPerPage, 100),
                    skip: (page - 1) * itemsPerPage,
                    sort,
                    filter: mergedFilter,
                },
            } as V;

            const transformedVariables = transformVariables ? transformVariables(variables) : variables;
            return api.query(minimalListQuery, transformedVariables);
        },
        queryKey,
        placeholderData: keepPreviousData,
    });
    let listData = data as any;
    for (const path of paginatedListObjectPath) {
        listData = listData?.[path];
    }

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
                onReorder={onReorder}
                disableDragAndDrop={disableDragAndDrop}
            />
        </PaginatedListContext.Provider>
    );
}
