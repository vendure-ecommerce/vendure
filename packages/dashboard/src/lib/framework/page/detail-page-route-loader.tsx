import { NEW_ENTITY_PATH } from '@/constants.js';

import { PageBreadcrumb } from '@/components/layout/generated-breadcrumbs.js';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { FileBaseRouteOptions } from '@tanstack/react-router';
import { getQueryName, getQueryTypeFieldInfo } from '../document-introspection/get-document-structure.js';
import { DetailEntity } from './page-types.js';
import { getDetailQueryOptions } from './use-detail-page.js';
import { addCustomFields } from '../document-introspection/add-custom-fields.js';
export interface DetailPageRouteLoaderConfig<T extends TypedDocumentNode<any, any>> {
    queryDocument: T;
    breadcrumb: (isNew: boolean, entity: DetailEntity<T>) => Array<PageBreadcrumb | undefined>;
}

export function detailPageRouteLoader<T extends TypedDocumentNode<any, any>>({
    queryDocument,
    breadcrumb,
}: DetailPageRouteLoaderConfig<T>) {
    const loader: FileBaseRouteOptions<any, any>['loader'] = async ({
        context,
        params,
    }: {
        context: any;
        params: any;
    }) => {
        if (!params.id) {
            throw new Error('ID param is required');
        }
        const isNew = params.id === NEW_ENTITY_PATH;
        const result = isNew
            ? null
            : await context.queryClient.ensureQueryData(
                  getDetailQueryOptions(addCustomFields(queryDocument), { id: params.id }),
                  { id: params.id },
              );

        const entityField = getQueryName(queryDocument);
        const entityName = getQueryTypeFieldInfo(queryDocument)?.type;

        if (!isNew && !result[entityField]) {
            throw new Error(`${entityName} with the ID ${params.id} was not found`);
        }
        return {
            breadcrumb: breadcrumb(isNew, result?.[entityField]),
        };
    };
    return loader;
}
