import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header.js';
import { DataTable } from '@/components/data-table/data-table.js';
import { useComponentRegistry } from '@/framework/component-registry/component-registry.js';
import {
    FieldInfo,
    getQueryName,
    getTypeFieldInfo,
} from '@/framework/document-introspection/get-document-structure.js';
import { useListQueryFields } from '@/framework/document-introspection/hooks.js';
import { api } from '@/graphql/api.js';
import { useDebounce } from 'use-debounce';

import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useQuery } from '@tanstack/react-query';
import {
    ColumnFiltersState,
    ColumnSort,
    createColumnHelper,
    SortingState,
    Table,
} from '@tanstack/react-table';
import { ColumnDef } from '@tanstack/table-core';
import { ResultOf } from 'gql.tada';
import React, { useMemo } from 'react';
import { Delegate } from '@/framework/component-registry/delegate.js';

type ListQueryFields<T extends TypedDocumentNode<any, any>> = {
    [Key in keyof ResultOf<T>]: ResultOf<T>[Key] extends { items: infer U }
        ? U extends any[]
            ? U[number]
            : never
        : never;
}[keyof ResultOf<T>];

export type CustomizeColumnConfig<T extends TypedDocumentNode<any, any>> = {
    [Key in keyof ListQueryFields<T>]?: Partial<ColumnDef<any>>;
};

export type ListQueryShape = {
    [key: string]: {
        items: any[];
        totalItems: number;
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
};

export interface PaginatedListDataTableProps<
    T extends TypedDocumentNode<U, V>,
    U extends ListQueryShape,
    V extends ListQueryOptionsShape,
> {
    listQuery: T;
    transformVariables?: (variables: V) => V;
    customizeColumns?: CustomizeColumnConfig<T>;
    defaultVisibility?: Partial<Record<keyof ListQueryFields<T>, boolean>>;
    onSearchTermChange?: (searchTerm: string) => NonNullable<V['options']>['filter'];
    page: number;
    itemsPerPage: number;
    sorting: SortingState;
    columnFilters?: ColumnFiltersState;
    onPageChange: (table: Table<any>, page: number, perPage: number) => void;
    onSortChange: (table: Table<any>, sorting: SortingState) => void;
    onFilterChange: (table: Table<any>, filters: ColumnFiltersState) => void;
}

export function PaginatedListDataTable<
    T extends TypedDocumentNode<U, V>,
    U extends Record<string, any> = any,
    V extends ListQueryOptionsShape = {},
>({
    listQuery,
    transformVariables,
    customizeColumns,
    defaultVisibility,
    onSearchTermChange,
    page,
    itemsPerPage,
    sorting,
    columnFilters,
    onPageChange,
    onSortChange,
    onFilterChange,
}: PaginatedListDataTableProps<T, U, V>) {
    const { getComponent } = useComponentRegistry();
    const [searchTerm, setSearchTerm] = React.useState<string>('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    const sort = sorting?.reduce((acc: any, sort: ColumnSort) => {
        const direction = sort.desc ? 'DESC' : 'ASC';
        const field = sort.id;

        if (!field || !direction) {
            return acc;
        }
        return { ...acc, [field]: direction };
    }, {});

    const filter = columnFilters?.length
        ? { _and: columnFilters.map(f => ({ [f.id]: f.value })) }
        : undefined;

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
        queryKey: [
            'PaginatedListDataTable',
            listQuery,
            page,
            itemsPerPage,
            sorting,
            filter,
            debouncedSearchTerm,
        ],
    });

    const fields = useListQueryFields(listQuery);
    const queryName = getQueryName(listQuery);
    const columnHelper = createColumnHelper();

    const columns = useMemo(() => {
        const columnConfigs: Array<{ fieldInfo: FieldInfo; isCustomField: boolean }> = [];

        columnConfigs.push(
            ...fields // Filter out custom fields
                .filter(field => field.name !== 'customFields' && !field.type.endsWith('CustomFields'))
                .map(field => ({ fieldInfo: field, isCustomField: false })),
        );
        
        const customFieldColumn = fields.find(field => field.name === 'customFields');
        if (customFieldColumn) {
            const customFieldFields = getTypeFieldInfo(customFieldColumn.type);
            columnConfigs.push(
                ...customFieldFields.map(field => ({ fieldInfo: field, isCustomField: true })),
            );
        }

        return columnConfigs.map(({ fieldInfo, isCustomField }) => {
            const customConfig = customizeColumns?.[fieldInfo.name as keyof ListQueryFields<T>] ?? {};
            const { header, ...customConfigRest } = customConfig;
            return columnHelper.accessor(fieldInfo.name as any, {
                meta: { fieldInfo, isCustomField },
                enableColumnFilter: fieldInfo.isScalar,
                enableSorting: fieldInfo.isScalar,
                cell: ({ cell, row }) => {
                    const value = !isCustomField ? cell.getValue() : (row.original as any)?.customFields?.[fieldInfo.name];
                    if (fieldInfo.list && Array.isArray(value)) {
                        return value.join(', ');
                    }
                    if ((fieldInfo.type === 'DateTime' && typeof value === 'string') || value instanceof Date) {
                        return <Delegate component="dateTime.display" value={value} />;
                    }
                    if (fieldInfo.type === 'Boolean') {
                        return <Delegate component="boolean.display" value={value} />;
                    }
                    if (fieldInfo.type === 'Asset') {
                        return <Delegate component="asset.display" value={value} />;
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
    }, [fields, customizeColumns]);

    const columnVisibility = getColumnVisibility(fields, defaultVisibility);

    return (
        <DataTable
            columns={columns}
            data={(data as any)?.[queryName]?.items ?? []}
            page={page}
            itemsPerPage={itemsPerPage}
            sorting={sorting}
            columnFilters={columnFilters}
            totalItems={(data as any)?.[queryName]?.totalItems ?? 0}
            onPageChange={onPageChange}
            onSortChange={onSortChange}
            onFilterChange={onFilterChange}
            onSearchTermChange={onSearchTermChange ? term => setSearchTerm(term) : undefined}
            defaultColumnVisibility={columnVisibility}
        />
    );
}

/**
 * Returns the default column visibility configuration.
 */
function getColumnVisibility(
    fields: FieldInfo[],
    defaultVisibility?: Record<string, boolean | undefined>,
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
    };
}
