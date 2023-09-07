import { ReactDataTableComponentProps } from '@vendure/admin-ui/react';
import React from 'react';

export function SlugWithLink({ rowItem }: ReactDataTableComponentProps) {
    return (
        <a href={`https://example.com/products/${rowItem.slug}`} target="_blank">
            {rowItem.slug}
        </a>
    );
}
