import { api } from '@/graphql/api.js';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { ResultOf, VariablesOf } from 'gql.tada';
import { DocumentNode } from 'graphql';
import { Variables } from 'graphql-request';

import { getQueryName } from '../document-introspection/get-document-structure.js';
import { useGeneratedForm } from '../form-engine/use-generated-form.js';

export interface DetailPageOptions<
    T extends TypedDocumentNode<any, any>,
    U extends TypedDocumentNode<any, any>,
    EntityField extends keyof ResultOf<T> = keyof ResultOf<T>,
    VarName extends keyof VariablesOf<U> = 'input',
> {
    /**
     * @description
     * The query document to fetch the entity.
     */
    queryDocument: T;
    /**
     * @description
     * The field of the query document that contains the entity.
     */
    entityField: EntityField;
    /**
     * @description
     * The parameters used to identify the entity.
     */
    params: {
        id: string;
    };
    /**
     * @description
     * The document to update the entity.
     */
    updateDocument: U;
    /**
     * @description
     * The function to set the values for the update document.
     */
    setValuesForUpdate: (entity: NonNullable<ResultOf<T>[EntityField]>) => VariablesOf<U>[VarName];
    /**
     * @description
     * The function to call when the update is successful.
     */
    onSuccess?: () => void;
    /**
     * @description
     * The function to call when the update is successful.
     */
    onError?: (error: unknown) => void;
}

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

/**
 * @description
 * This hook is used to create an entity detail page which can read
 * and update an entity.
 */
export function useDetailPage<
    T extends TypedDocumentNode<any, any>,
    U extends TypedDocumentNode<any, any>,
    EntityField extends keyof ResultOf<T> = keyof ResultOf<T>,
    VarName extends keyof VariablesOf<U> = 'input',
>(options: DetailPageOptions<T, U, EntityField, VarName>) {
    const { queryDocument, updateDocument, setValuesForUpdate, params, entityField, onSuccess, onError } =
        options;
    const queryClient = useQueryClient();
    const detailQueryOptions = getDetailQueryOptions(queryDocument, { id: params.id });
    const detailQuery = useSuspenseQuery(detailQueryOptions);
    const entity = detailQuery.data[entityField];

    const updateMutation = useMutation({
        mutationFn: api.mutate(updateDocument),
        onSuccess: () => {
            onSuccess?.();
            void queryClient.invalidateQueries({ queryKey: detailQueryOptions.queryKey });
        },
        onError,
    });

    const { form, submitHandler } = useGeneratedForm({
        document: updateDocument,
        entity,
        setValues: setValuesForUpdate,
        onSubmit(values: any) {
            updateMutation.mutate({ input: values });
        },
    });

    return { form, submitHandler, entity, isPending: updateMutation.isPending || detailQuery.isPending };
}
