import { NEW_ENTITY_PATH } from '@/constants.js';
import { api, Variables } from '@/graphql/api.js';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
    DefinedInitialDataOptions,
    queryOptions,
    useMutation,
    useQueryClient,
    useSuspenseQuery,
} from '@tanstack/react-query';
import { ResultOf, VariablesOf } from 'gql.tada';
import { DocumentNode } from 'graphql';
import { FormEvent } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { addCustomFields } from '../document-introspection/add-custom-fields.js';
import { getMutationName, getQueryName } from '../document-introspection/get-document-structure.js';
import { useGeneratedForm } from '../form-engine/use-generated-form.js';

import { DetailEntityPath } from './page-types.js';

// Utility type to remove null from a type union
type RemoveNull<T> = T extends null ? never : T;

type RemoveNullFields<T> = {
    [K in keyof T]: RemoveNull<T[K]>;
};

export interface DetailPageOptions<
    T extends TypedDocumentNode<any, any>,
    C extends TypedDocumentNode<any, any>,
    U extends TypedDocumentNode<any, any>,
    EntityField extends keyof ResultOf<T> = DetailEntityPath<T>,
    VarNameCreate extends keyof VariablesOf<C> = 'input',
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
    entityField?: EntityField;
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
    createDocument?: C;
    /**
     * @description
     * The document to update the entity.
     */
    updateDocument?: U;
    /**
     * @description
     * The function to set the values for the update document.
     */
    setValuesForUpdate: (entity: NonNullable<ResultOf<T>[EntityField]>) => VariablesOf<U>[VarNameUpdate];
    transformCreateInput?: (input: VariablesOf<C>[VarNameCreate]) => VariablesOf<C>[VarNameCreate];
    transformUpdateInput?: (input: VariablesOf<U>[VarNameUpdate]) => VariablesOf<U>[VarNameUpdate];
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
): DefinedInitialDataOptions {
    const queryName = getQueryName(document);
    return queryOptions({
        queryKey: ['DetailPage', queryName, variables],
        queryFn: () => api.query(document, variables),
    }) as DefinedInitialDataOptions;
}

/**
 * @description
 * Adds a "customFields" property to the translations if the entity has translations.
 */
export type DetailPageTranslations<
    T extends TypedDocumentNode<any, any>,
    EntityField extends keyof ResultOf<T>,
> = 'translations' extends keyof NonNullable<ResultOf<T>[EntityField]>
    ? Array<NonNullable<ResultOf<T>[EntityField]>['translations'][number] & { customFields?: any }>
    : undefined;

/**
 * @description
 * Adds a "customFields" property to the entity and a "translations" property to the entity.
 */
export type DetailPageEntity<
    T extends TypedDocumentNode<any, any>,
    EntityField extends keyof ResultOf<T>,
> = ResultOf<T>[EntityField] & {
    customFields?: any;
    translations: DetailPageTranslations<T, EntityField>;
};

export interface UseDetailPageResult<
    T extends TypedDocumentNode<any, any>,
    C extends TypedDocumentNode<any, any>,
    U extends TypedDocumentNode<any, any>,
    EntityField extends keyof ResultOf<T>,
> {
    form: UseFormReturn<RemoveNullFields<VariablesOf<U>['input']>>;
    submitHandler: (event: FormEvent<HTMLFormElement>) => void;
    entity?: DetailPageEntity<T, EntityField>;
    isPending: boolean;
    refreshEntity: () => void;
    resetForm: () => void;
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
>(
    options: DetailPageOptions<T, C, U, EntityField, VarNameCreate, VarNameUpdate>,
): UseDetailPageResult<T, C, U, EntityField> {
    const {
        queryDocument,
        createDocument,
        updateDocument,
        setValuesForUpdate,
        transformCreateInput,
        transformUpdateInput,
        params,
        entityField,
        onSuccess,
        onError,
    } = options;
    const isNew = params.id === NEW_ENTITY_PATH;
    const queryClient = useQueryClient();
    const detailQueryOptions = getDetailQueryOptions(addCustomFields(queryDocument), {
        id: isNew ? '__NEW__' : params.id,
    });
    const detailQuery = useSuspenseQuery(detailQueryOptions);
    const entityQueryField = entityField ?? getQueryName(queryDocument);
    const entity = (detailQuery?.data as any)[entityQueryField] as
        | DetailPageEntity<T, EntityField>
        | undefined;

    const resetForm = () => {
        form.reset(form.getValues());
    };

    const createMutation = useMutation({
        mutationFn: createDocument ? api.mutate(createDocument) : undefined,
        onSuccess: data => {
            if (createDocument) {
                const createMutationName = getMutationName(createDocument);
                onSuccess?.((data as any)[createMutationName]);
            }
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateDocument ? api.mutate(updateDocument) : undefined,
        onSuccess: data => {
            if (updateDocument) {
                const updateMutationName = getMutationName(updateDocument);
                onSuccess?.((data as any)[updateMutationName]);
                void queryClient.invalidateQueries({ queryKey: detailQueryOptions.queryKey });
            }
        },
        onError,
    });

    const document = isNew ? (createDocument ?? updateDocument) : updateDocument;
    const { form, submitHandler } = useGeneratedForm({
        document,
        entity,
        setValues: setValuesForUpdate,
        onSubmit(values: any) {
            if (isNew) {
                createMutation.mutate({ input: transformCreateInput?.(values) ?? values });
            } else {
                updateMutation.mutate({ input: transformUpdateInput?.(values) ?? values });
            }
        },
    });

    return {
        form: form as any,
        submitHandler,
        entity,
        isPending: updateMutation.isPending || detailQuery?.isPending,
        refreshEntity: detailQuery.refetch,
        resetForm,
    };
}
