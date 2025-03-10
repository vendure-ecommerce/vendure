import { DetailPage, getDetailQueryOptions } from '@/framework/internal/page/detail-page.js';
import { graphql } from '@/graphql/graphql.js';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_authenticated/products_/$id')({
    component: ProductDetailPage,
    loader: async ({ context, params }) => {
        const result = await context.queryClient.ensureQueryData(
            getDetailQueryOptions(productDetailDocument, { id: params.id }),
        );
        return { breadcrumb: [{ path: '/products', label: 'Products' }, result.product.name] };
    },
});

const productDetailDocument = graphql(`
    query ProductDetail($id: ID!) {
        product(id: $id) {
            id
            createdAt
            updatedAt
            enabled
            name
            slug
            description
            featuredAsset {
                id
                preview
            }
        }
    }
`);

export function ProductDetailPage() {
    const params = Route.useParams();
    const detailQuery = useSuspenseQuery(getDetailQueryOptions(productDetailDocument, { id: params.id }));
    const entity = detailQuery.data;
    return <DetailPage title={entity.product?.name ?? ''} route={Route} entity={entity}></DetailPage>;
}
