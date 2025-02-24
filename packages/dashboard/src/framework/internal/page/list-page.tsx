import { useComponentRegistry } from '@/framework/internal/component-registry/component-registry.js';
import { DataTable } from '@/framework/internal/data-table/data-table.js';
import {
    getListQueryFields,
    getQueryName,
} from '@/framework/internal/document-introspection/get-document-structure.js';
import { api } from '@/graphql/api.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useQuery } from '@tanstack/react-query';
import { AnyRouter, Route, useNavigate } from '@tanstack/react-router';
import { AnyRoute } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { ResultOf } from 'gql.tada';
import React from 'react';

type ListQueryFields<T extends TypedDocumentNode> = {
    [Key in keyof ResultOf<T>]: ResultOf<T>[Key] extends { items: infer U }
        ? U extends any[]
            ? U[number]
            : never
        : never;
}[keyof ResultOf<T>];

export type CustomizeColumnConfig<T extends TypedDocumentNode> = {
    [Key in keyof ListQueryFields<T>]?: {
        header: string;
    };
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
    const { data } = useQuery({
        queryFn: () =>
            api.query(listQuery, {
                options: {
                    take: pagination.itemsPerPage,
                    skip: (pagination.page - 1) * pagination.itemsPerPage,
                },
            }),
        queryKey: ['ListPage', route.id, pagination],
    });
    const fields = getListQueryFields(listQuery);
    const queryName = getQueryName(listQuery);
    const columnHelper = createColumnHelper();

    const columns = fields.map(field =>
        columnHelper.accessor(field.name as any, {
            header: customizeColumns?.[field.name as keyof ListQueryFields<T>]?.header ?? field.name,
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

                if (Cmp) {
                    return <Cmp value={value} />;
                }
                return value;
            },
        }),
    );

    return (
        <div className="m-4">
            <h1 className="text-2xl font-bold">{title}</h1>
            <DataTable
                columns={columns}
                data={(data as any)?.[queryName]?.items ?? []}
                page={pagination.page}
                itemsPerPage={pagination.itemsPerPage}
                totalItems={(data as any)?.[queryName]?.totalItems ?? 0}
                onPageChange={(page, perPage) => {
                    navigate({ search: () => ({ page, perPage }) as never });
                }}
            ></DataTable>
        </div>
    );
}
