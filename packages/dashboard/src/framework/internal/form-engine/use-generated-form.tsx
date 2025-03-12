import { getOperationVariablesFields } from '@/framework/internal/document-introspection/get-document-structure.js';
import {
    createFormSchemaFromFields,
    getDefaultValuesFromFields,
} from '@/framework/internal/form-engine/form-schema-tools.js';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { VariablesOf } from 'gql.tada';
import { FormEvent } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';

type FormField = 'FormField';

type MapToFormField<T> =
    T extends Array<infer U>
        ? Array<MapToFormField<U>>
        : T extends object
          ? { [K in keyof Required<T>]: MapToFormField<NonNullable<T[K]>> }
          : FormField;
// Define InputFormField that takes a TypedDocumentNode and the name of the input variable
type InputFormField<
    T extends TypedDocumentNode<any, any>,
    VarName extends keyof VariablesOf<T> = 'input',
> = MapToFormField<NonNullable<VariablesOf<T>[VarName]>>;

export function useGeneratedForm<
    T extends TypedDocumentNode<any, any>,
    VarName extends keyof VariablesOf<T> = 'input',
    E = Record<string, any>,
>(options: {
    document: T;
    entity: E | null | undefined;
    setValues: (entity: NonNullable<E>) => VariablesOf<T>[VarName];
    onSubmit?: (values: VariablesOf<T>[VarName]) => void;
}): {
    form: UseFormReturn<VariablesOf<T>[VarName]>;
    submitHandler: (event: FormEvent) => (values: VariablesOf<T>[VarName]) => void;
} {
    const { document, entity, setValues, onSubmit } = options;
    const updateFields = getOperationVariablesFields(document);
    const schema = createFormSchemaFromFields(updateFields);
    const defaultValues = getDefaultValuesFromFields(updateFields);
    console.log(`defaultValues`, defaultValues);
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues,
        values: entity ? setValues(entity) : defaultValues,
    });
    let submitHandler = (event: FormEvent) => {
        event.preventDefault();
    };
    if (onSubmit) {
        submitHandler = (event: FormEvent) => {
            form.handleSubmit(onSubmit)(event);
        };
    }

    return { form, submitHandler };
}
