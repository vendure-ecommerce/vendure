import { getListQueryFields } from '@/framework/internal/document-introspection/get-document-structure.js';
import { createFileRoute } from '@tanstack/react-router';
import { graphql } from '@/graphql/graphql.js';
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
            }
        }
    }
`);

const productFragment = graphql(`
    fragment ProductFragment on Product {
        id
        name
        slug
        enabled
    }
`);

const productListDocument2 = graphql(
    `
        query ProductList($options: ProductListOptions) {
            products(options: $options) {
                items {
                    ...ProductFragment
                }
            }
        }
    `,
    [productFragment],
);

export function ProductListPage() {
    console.log('regular', getListQueryFields(productListDocument));
    console.log('with fragment', getListQueryFields(productListDocument2));
    return <div>Product List Page</div>;
}
