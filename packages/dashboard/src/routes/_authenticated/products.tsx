import { DataTable } from '@/framework/internal/data-table/data-table.js';
import { getListQueryFields } from '@/framework/internal/document-introspection/get-document-structure.js';
import { api } from '@/graphql/api.js';
import { graphql } from '@/graphql/graphql.js';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { ResultOf } from 'gql.tada';
import React from 'react';

export const Route = createFileRoute('/_authenticated/products')({
    component: ProductListPage,
});

const productListDocument = graphql(`
    query ProductList($options: ProductListOptions) {
        products(options: $options) {
            items {
                id
                name
                slug
                enabled
                updatedAt
            }
        }
    }
`);

export function ProductListPage() {
    const { data } = useQuery({
        queryFn: () =>
            api.query(productListDocument, {
                options: {
                    take: 100,
                },
            }),
        queryKey: ['ProductList'],
    });
    const fields = getListQueryFields(productListDocument);
    const columnHelper =
        createColumnHelper<ResultOf<typeof productListDocument>['products']['items'][number]>();

    const columns = fields.map(field =>
        columnHelper.accessor(field.name as any, {
            header: field.name,
            meta: { type: field.type },
        }),
    );

    return <DataTable columns={columns} data={data?.products.items ?? []}></DataTable>;
}
