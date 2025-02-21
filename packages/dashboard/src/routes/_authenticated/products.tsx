import { ListPage } from '@/framework/internal/page/list-page.js';
import { graphql } from '@/graphql/graphql.js';
import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_authenticated/products')({
    component: ProductListPage,
});

const productListDocument = graphql(`
    query ProductList($options: ProductListOptions) {
        products(options: $options) {
            items {
                id
                createdAt
                updatedAt
                name
                description
            }
        }
    }
`);

export function ProductListPage() {
    return (
        <ListPage
            title="Products"
            listQuery={productListDocument}
            customizeColumns={{
                id: { header: 'ID' },
                name: { header: 'Name' },
            }}
        />
    );
}
