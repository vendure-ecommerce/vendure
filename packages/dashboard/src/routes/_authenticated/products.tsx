import { ListPage } from '@/framework/internal/page/list-page.js';
import { graphql } from '@/graphql/graphql.js';
import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_authenticated/products')({
    component: ProductListPage,
    loader: () => ({
        breadcrumb: 'Products',
    }),
});

const productListDocument = graphql(`
    query ProductList($options: ProductListOptions) {
        products(options: $options) {
            items {
                id
                createdAt
                updatedAt
                featuredAsset {
                    id
                    preview
                }
                name
                slug
                enabled
            }
            totalItems
        }
    }
`);

export function ProductListPage() {
    return (
        <ListPage
            title="Products"
            customizeColumns={{
                name: { header: 'Product Name' },
            }}
            onSearchTermChange={searchTerm => {
                return {
                    name: { contains: searchTerm },
                };
            }}
            listQuery={productListDocument}
            route={Route}
        />
    );
}
