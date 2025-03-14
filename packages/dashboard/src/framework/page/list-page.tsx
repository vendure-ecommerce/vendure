import {
    FieldInfo
} from '@/framework/document-introspection/get-document-structure.js';
import { PageProps } from '@/framework/page/page-types.js';

import { CustomizeColumnConfig, ListQueryOptionsShape, ListQueryShape, PaginatedListDataTable } from '@/components/shared/paginated-list-data-table.js';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { AnyRouter, useNavigate } from '@tanstack/react-router';
import {
    ColumnFiltersState,
    SortingState,
    Table
} from '@tanstack/react-table';
import { ResultOf } from 'gql.tada';

type ListQueryFields<T extends TypedDocumentNode<any, any>> = {
    [Key in keyof ResultOf<T>]: ResultOf<T>[Key] extends { items: infer U }
        ? U extends any[]
            ? U[number]
            : never
        : never;
}[keyof ResultOf<T>];

export interface ListPageProps<
    T extends TypedDocumentNode<U, V>,
    U extends ListQueryShape,
    V extends ListQueryOptionsShape,
> extends PageProps {
    listQuery: T;
    onSearchTermChange?: (searchTerm: string) => NonNullable<V['options']>['filter'];
    customizeColumns?: CustomizeColumnConfig<T>;
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
    route: routeOrFn,
    defaultVisibility,
    onSearchTermChange,
}: ListPageProps<T, U, V>) {
    const route = typeof routeOrFn === 'function' ? routeOrFn() : routeOrFn;
    const routeSearch = route.useSearch();
    const navigate = useNavigate<AnyRouter>({ from: route.fullPath });

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
            <PaginatedListDataTable
                listQuery={listQuery}
                customizeColumns={customizeColumns}
                defaultVisibility={defaultVisibility}
                onSearchTermChange={onSearchTermChange}
                page={pagination.page}
                itemsPerPage={pagination.itemsPerPage}
                sorting={sorting}
                columnFilters={routeSearch.filters}
                onPageChange={(table, page, perPage) => {
                    persistListStateToUrl(table, { page, perPage });
                }}
                onSortChange={(table, sorting) => {
                    persistListStateToUrl(table, { sort: sorting });
                }}
                onFilterChange={(table, filters) => {
                    persistListStateToUrl(table, { filters });
                }}
            />
        </div>
    );
}
