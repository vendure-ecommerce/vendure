import { useComponentRegistry } from '@/framework/internal/component-registry/component-registry.js';
import { DataTableColumnHeader } from '@/framework/internal/data-table/data-table-column-header.js';
import { DataTable } from '@/framework/internal/data-table/data-table.js';
import {
    getListQueryFields,
    getQueryName,
} from '@/framework/internal/document-introspection/get-document-structure.js';
import { useListQueryFields } from '@/framework/internal/document-introspection/hooks.js';
import { api } from '@/graphql/api.js';
import { useDebounce } from 'use-debounce';

import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useQuery } from '@tanstack/react-query';
import { AnyRoute, AnyRouter, useNavigate } from '@tanstack/react-router';
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

export interface ListPageProps<
    T extends TypedDocumentNode<U, V>,
    U extends ListQueryShape,
    V extends ListQueryOptionsShape,
> {
    title: string;
    listQuery: T;
    onSearchTermChange?: (searchTerm: string) => NonNullable<V['options']>['filter'];
    route: AnyRoute;
    customizeColumns?: CustomizeColumnConfig<T>;
    // TODO: not yet implemented
    defaultColumnOrder?: (keyof ListQueryFields<T>)[];
    defaultVisibility?: Partial<Record<keyof ListQueryFields<T>, boolean>>;
}

export function ListPage<
    T extends TypedDocumentNode<U, V>,
    U extends Record<string, any> = any,
    V extends ListQueryOptionsShape = {},
>({
    title,
    listQuery,
    customizeColumns,
    route,
    defaultVisibility,
    onSearchTermChange,
}: ListPageProps<T, U, V>) {
    const { getComponent } = useComponentRegistry();
    const routeSearch = route.useSearch();
    const navigate = useNavigate<AnyRouter>({ from: route.fullPath });
    const [searchTerm, setSearchTerm] = React.useState<string>('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const pagination = {
        page: routeSearch.page ? parseInt(routeSearch.page) : 1,
        itemsPerPage: routeSearch.perPage ? parseInt(routeSearch.perPage) : 10,
    };
    const sorting: SortingState = (routeSearch.sort ?? '').split(',').map((s: string) => {
        return {
            id: s.replace(/^-/, ''),
            desc: s.startsWith('-'),
        };
    });
    const sort = sorting?.reduce((acc: any, sort: ColumnSort) => {
        const direction = sort.desc ? 'DESC' : 'ASC';
        const field = sort.id;

        if (!field || !direction) {
            return acc;
        }
        return { ...acc, [field]: direction };
    }, {});

    const columnFilters = routeSearch.filters;
    const filter = columnFilters?.length
        ? { _and: (routeSearch.filters as ColumnFiltersState).map(f => ({ [f.id]: f.value })) }
        : undefined;

    const { data } = useQuery({
        queryFn: () => {
            const searchFilter = onSearchTermChange ? onSearchTermChange(debouncedSearchTerm) : {};
            const mergedFilter = { ...filter, ...searchFilter };
            return api.query(listQuery, {
                options: {
                    take: pagination.itemsPerPage,
                    skip: (pagination.page - 1) * pagination.itemsPerPage,
                    sort,
                    filter: mergedFilter,
                },
            } as unknown as V);
        },
        queryKey: ['ListPage', route.id, pagination, sorting, filter, debouncedSearchTerm],
    });
    const fields = useListQueryFields(listQuery);
    const queryName = getQueryName(listQuery);
    const columnHelper = createColumnHelper();

    const columns = useMemo(() => {
        return fields.map(field => {
            const customConfig = customizeColumns?.[field.name as keyof ListQueryFields<T>] ?? {};
            const { header, ...customConfigRest } = customConfig;
            return columnHelper.accessor(field.name as any, {
                meta: { field },
                enableColumnFilter: field.isScalar,
                enableSorting: field.isScalar,
                cell: ({ cell }) => {
                    const value = cell.getValue();
                    if (field.list && Array.isArray(value)) {
                        return value.join(', ');
                    }
                    let Cmp: React.ComponentType<{ value: any }> | undefined = undefined;
                    if ((field.type === 'DateTime' && typeof value === 'string') || value instanceof Date) {
                        Cmp = getComponent('dateTime.display');
                    }
                    if (field.type === 'Boolean') {
                        Cmp = getComponent('boolean.display');
                    }
                    if (field.type === 'Asset') {
                        Cmp = getComponent('asset.display');
                    }

                    if (Cmp) {
                        return <Cmp value={value} />;
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

    const columnVisibility = {
        id: false,
        createdAt: false,
        updatedAt: false,
        ...(defaultVisibility ?? {}),
    };

    function sortToString(sortingStates?: SortingState) {
        return sortingStates?.map(s => `${s.desc ? '-' : ''}${s.id}`).join(',');
    }

    function persistListStateToUrl(
        table: Table<any>,
        listState: {
            page?: number;
            perPage?: number;
            sort?: SortingState;
            filters?: ColumnFiltersState;
        },
    ) {
        const tableState = table.getState();
        const page = listState.page || tableState.pagination.pageIndex + 1;
        const perPage = listState.perPage || tableState.pagination.pageSize;
        const sort = sortToString(listState.sort ?? tableState.sorting);
        const filters = listState.filters ?? tableState.columnFilters;
        navigate({
            search: () => ({ sort, page, perPage, filters: filters.length ? filters : undefined }) as never,
        });
    }

    return (
        <div className="m-4">
            <h1 className="text-2xl font-bold">{title}</h1>
            <DataTable
                columns={columns}
                data={(data as any)?.[queryName]?.items ?? []}
                page={pagination.page}
                itemsPerPage={pagination.itemsPerPage}
                sorting={sorting}
                columnFilters={columnFilters}
                totalItems={(data as any)?.[queryName]?.totalItems ?? 0}
                onPageChange={(table, page, perPage) => {
                    persistListStateToUrl(table, { page, perPage });
                }}
                onSortChange={(table, sorting) => {
                    persistListStateToUrl(table, { sort: sorting });
                }}
                onFilterChange={(table, filters) => {
                    persistListStateToUrl(table, { filters });
                }}
                onSearchTermChange={onSearchTermChange ? term => setSearchTerm(term) : undefined}
                defaultColumnVisibility={columnVisibility}
            ></DataTable>
        </div>
    );
}
