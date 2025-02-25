import { Button } from '@/components/ui/button.js';
import { useComponentRegistry } from '@/framework/internal/component-registry/component-registry.js';
import { DataTable } from '@/framework/internal/data-table/data-table.js';
import {
    getListQueryFields,
    getQueryName,
} from '@/framework/internal/document-introspection/get-document-structure.js';
import { api } from '@/graphql/api.js';

import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useQuery } from '@tanstack/react-query';
import { AnyRoute, AnyRouter, useNavigate } from '@tanstack/react-router';
import { createColumnHelper, SortingState, Table } from '@tanstack/react-table';
import { ColumnDef } from '@tanstack/table-core';
import { ResultOf } from 'gql.tada';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import React from 'react';

type ListQueryFields<T extends TypedDocumentNode> = {
    [Key in keyof ResultOf<T>]: ResultOf<T>[Key] extends { items: infer U }
        ? U extends any[]
            ? U[number]
            : never
        : never;
}[keyof ResultOf<T>];

export type CustomizeColumnConfig<T extends TypedDocumentNode> = {
    [Key in keyof ListQueryFields<T>]?: Partial<ColumnDef<any>>;
};

export type ListQueryShape = {
    [key: string]: {
        items: any[];
        totalItems: number;
    };
};

export interface ListPageProps<T extends TypedDocumentNode<U>, U extends ListQueryShape> {
    title: string;
    listQuery: T;
    customizeColumns?: CustomizeColumnConfig<T>;
    route: AnyRoute;
}

export function ListPage<T extends TypedDocumentNode<U>, U extends Record<string, any> = any>({
    title,
    listQuery,
    customizeColumns,
    route,
}: ListPageProps<T, U>) {
    const { getComponent } = useComponentRegistry();
    const routeSearch = route.useSearch();
    const navigate = useNavigate<AnyRouter>({ from: route.fullPath });
    const pagination = {
        page: routeSearch.page ? parseInt(routeSearch.page) : 1,
        itemsPerPage: routeSearch.perPage ? parseInt(routeSearch.perPage) : 10,
    };
    const sorting = routeSearch.sort;
    const sort = (sorting?.split(',') || [])?.reduce((acc: any, sort: string) => {
        const direction = sort.startsWith('-') ? 'DESC' : 'ASC';
        const field = sort.replace(/^-/, '');

        if (!field || !direction) {
            return acc;
        }
        return { ...acc, [field]: direction };
    }, {});
    const { data } = useQuery({
        queryFn: () =>
            api.query(listQuery, {
                options: {
                    take: pagination.itemsPerPage,
                    skip: (pagination.page - 1) * pagination.itemsPerPage,
                    sort,
                },
            }),
        queryKey: ['ListPage', route.id, pagination, sorting],
    });
    const fields = getListQueryFields(listQuery);
    const queryName = getQueryName(listQuery);
    const columnHelper = createColumnHelper();

    const columns = fields.map(field => {
        const customConfig = customizeColumns?.[field.name as keyof ListQueryFields<T>] ?? {};
        const { header, ...customConfigRest } = customConfig;
        return columnHelper.accessor(field.name as any, {
            meta: { type: field.type },
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
                const column = headerContext.column;
                // By default, we only enable sorting on scalar type fields,
                // unless explicitly configured otherwise.
                const isSortable = customConfig.enableSorting || field.isScalar;

                const customHeader = customConfig.header;
                let display = field.name;
                if (typeof customHeader === 'function') {
                    display = customHeader(headerContext);
                } else if (typeof customHeader === 'string') {
                    display = customHeader;
                }

                const columSort = column.getIsSorted();
                const nextSort = columSort === 'asc' ? true : columSort === 'desc' ? undefined : false;
                return (
                    <>
                        {display}
                        {isSortable && (
                            <Button variant="ghost" onClick={() => column.toggleSorting(nextSort)}>
                                {columSort === 'desc' ? (
                                    <ArrowUp />
                                ) : columSort === 'asc' ? (
                                    <ArrowDown />
                                ) : (
                                    <ArrowUpDown className="opacity-30" />
                                )}
                            </Button>
                        )}
                    </>
                );
            },
            ...customConfigRest,
        });
    });

    function persistListStateToUrl(
        table: Table<any>,
        listState: {
            page?: number;
            perPage?: number;
            sort?: SortingState;
        },
    ) {
        const tableState = table.getState();
        const page = listState.page || tableState.pagination.pageIndex + 1;
        const perPage = listState.perPage || tableState.pagination.pageSize;

        function sortToString(sortingStates?: SortingState) {
            return sortingStates?.map(s => `${s.desc ? '-' : ''}${s.id}`).join(',');
        }

        const sort = sortToString(listState.sort ?? tableState.sorting);
        navigate({
            search: () => ({ sort, page, perPage }) as never,
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
                totalItems={(data as any)?.[queryName]?.totalItems ?? 0}
                onPageChange={(table, page, perPage) => {
                    persistListStateToUrl(table, { page, perPage });
                }}
                onSortChange={(table, sorting) => {
                    persistListStateToUrl(table, { sort: sorting });
                }}
            ></DataTable>
        </div>
    );
}
