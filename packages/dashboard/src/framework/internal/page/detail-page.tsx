import { getQueryName } from '@/framework/internal/document-introspection/get-document-structure.js';
import { PageProps } from '@/framework/internal/page/page-types.js';
import { api } from '@/graphql/api.js';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { queryOptions } from '@tanstack/react-query';
import { Variables } from 'graphql-request';
import { DocumentNode } from 'graphql/index.js';
import React from 'react';

export function getDetailQueryOptions<T, V extends Variables = Variables>(
    document: TypedDocumentNode<T, V> | DocumentNode,
    variables: V,
) {
    const queryName = getQueryName(document);
    return queryOptions({
        queryKey: ['DetailPage', queryName, variables],
        queryFn: () => api.query(document, variables),
    });
}

export interface DetailPageProps extends PageProps {
    entity: any;
}

export function DetailPage({ title, entity }: DetailPageProps) {
    return (
        <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <pre className="max-w-lg overflow-scroll">{JSON.stringify(entity, null, 2)}</pre>
        </div>
    );
}
