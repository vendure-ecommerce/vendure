import { ListPage } from '@/framework/internal/page/list-page.js';
import { graphql } from '@/graphql/graphql.js';
import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_authenticated/products')({
    component: ProductListPage,
});

const productFragment = graphql(`
    fragment ProductFragment on Product {
        id
        createdAt
        updatedAt
        featuredAsset {
            id
            preview
            focalPoint {
                x
                y
            }
        }
        name
        slug
        enabled
    }
`);

const productListDocument = graphql(
    `
        query ProductList($options: ProductListOptions) {
            products(options: $options) {
                items {
                    ...ProductFragment
                }
                totalItems
            }
        }
    `,
    [productFragment],
);

export function ProductListPage() {
    return (
        <ListPage
            title="Products"
            listQuery={productListDocument}
            customizeColumns={{
                name: { header: 'Product Name' },
                featuredAsset: {
                    header: 'Image',
                    enableSorting: false,
                },
            }}
            defaultColumnOrder={['id', 'featuredAsset', 'name']}
            defaultVisibility={{
                id: true,
            }}
            route={Route}
        />
    );
}
