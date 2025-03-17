import { NEW_ENTITY_PATH } from '@/constants.js';
import { api } from '@/graphql/api.js';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { ResultOf, VariablesOf } from 'gql.tada';
import { DocumentNode } from 'graphql';
import { Variables } from 'graphql-request';
import { useCallback } from 'react';

import { getMutationName, getQueryName } from '../document-introspection/get-document-structure.js';
import { useGeneratedForm } from '../form-engine/use-generated-form.js';

export interface DetailPageOptions<
    T extends TypedDocumentNode<any, any>,
    C extends TypedDocumentNode<any, any>,
    U extends TypedDocumentNode<any, any>,
    EntityField extends keyof ResultOf<T> = keyof ResultOf<T>,
    VarNameUpdate extends keyof VariablesOf<U> = 'input',
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
     * The document to create the entity.
     */
    createDocument: C;
    /**
     * @description
     * The document to update the entity.
     */
    updateDocument: U;
    /**
     * @description
     * The function to set the values for the update document.
     */
    setValuesForUpdate: (entity: NonNullable<ResultOf<T>[EntityField]>) => VariablesOf<U>[VarNameUpdate];
    /**
     * @description
     * The function to call when the update is successful.
     */
    onSuccess?: (entity: ResultOf<C>[keyof ResultOf<C>] | ResultOf<U>[keyof ResultOf<U>]) => void;
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
    C extends TypedDocumentNode<any, any>,
    U extends TypedDocumentNode<any, any>,
    EntityField extends keyof ResultOf<T> = keyof ResultOf<T>,
    VarNameUpdate extends keyof VariablesOf<U> = 'input',
    VarNameCreate extends keyof VariablesOf<C> = 'input',
>(options: DetailPageOptions<T, C, U, EntityField, VarNameUpdate>) {
    const {
        queryDocument,
        createDocument,
        updateDocument,
        setValuesForUpdate,
        params,
        entityField,
        onSuccess,
        onError,
    } = options;
    const isNew = params.id === NEW_ENTITY_PATH;
    const queryClient = useQueryClient();
    const detailQueryOptions = getDetailQueryOptions(queryDocument, { id: isNew ? '__NEW__' : params.id });
    const detailQuery = useSuspenseQuery(detailQueryOptions);
    const entity = detailQuery?.data[entityField];

    const createMutation = useMutation({
        mutationFn: api.mutate(createDocument),
        onSuccess: data => {
            const createMutationName = getMutationName(createDocument);
            onSuccess?.((data as any)[createMutationName]);
        },
    });

    const updateMutation = useMutation({
        mutationFn: api.mutate(updateDocument),
        onSuccess: data => {
            const updateMutationName = getMutationName(updateDocument);
            onSuccess?.((data as any)[updateMutationName]);
            void queryClient.invalidateQueries({ queryKey: detailQueryOptions.queryKey });
        },
        onError,
    });

    const { form, submitHandler } = useGeneratedForm({
        document: isNew ? createDocument : updateDocument,
        entity,
        setValues: setValuesForUpdate,
        onSubmit(values: any) {
            if (isNew) {
                createMutation.mutate({ input: values });
            } else {
                updateMutation.mutate({ input: values });
            }
        },
    });

    const refreshEntity = useCallback(() => {
        void queryClient.invalidateQueries({ queryKey: detailQueryOptions.queryKey });
    }, [queryClient, detailQueryOptions.queryKey]);

    return {
        form,
        submitHandler,
        entity,
        isPending: updateMutation.isPending || detailQuery?.isPending,
        refreshEntity,
    };
}
