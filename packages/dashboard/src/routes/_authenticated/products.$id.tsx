import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/_authenticated/products/$id')({
    component: ProductDetailPage,
});

export function ProductDetailPage() {
    return <div>Product Detail Page</div>;
}
