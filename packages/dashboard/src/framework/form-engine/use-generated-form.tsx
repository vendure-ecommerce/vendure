import { getOperationVariablesFields } from '@/framework/document-introspection/get-document-structure.js';
import {
    createFormSchemaFromFields,
    getDefaultValuesFromFields,
} from '@/framework/form-engine/form-schema-tools.js';
import { useChannel } from '@/hooks/use-channel.js';
import { useServerConfig } from '@/hooks/use-server-config.js';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { VariablesOf } from 'gql.tada';
import { FormEvent } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';

export interface GeneratedFormOptions<
    T extends TypedDocumentNode<any, any>,
    VarName extends keyof VariablesOf<T> = 'input',
    E extends Record<string, any> = Record<string, any>,
> {
    document: T;
    entity: E | null | undefined;
    setValues: (entity: NonNullable<E>) => VariablesOf<T>[VarName];
    onSubmit?: (values: VariablesOf<T>[VarName]) => void;
}

/**
 * @description
 * This hook is used to create a form from a document and an entity.
 * It will create a form with the fields defined in the document's input type.
 * It will also create a submit handler that will submit the form to the server.
 * 
 */
export function useGeneratedForm<
    T extends TypedDocumentNode<any, any>,
    VarName extends keyof VariablesOf<T> = 'input',
    E extends Record<string, any> = Record<string, any>,
>(options: GeneratedFormOptions<T, VarName, E>) {
    const { document, entity, setValues, onSubmit } = options;
    const { activeChannel } = useChannel();
    const availableLanguages = useServerConfig()?.availableLanguages || [];
    const updateFields = document ? getOperationVariablesFields(document) : [];
    const schema = createFormSchemaFromFields(updateFields);
    const defaultValues = getDefaultValuesFromFields(updateFields, activeChannel?.defaultLanguageCode);
    const processedEntity = ensureTranslationsForAllLanguages(entity, availableLanguages);

    const form = useForm({
        resolver: async (values, context, options) => {
            const result = await zodResolver(schema)(values, context, options);
            if (Object.keys(result.errors).length > 0) {
                console.log('Zod form validation errors:', result.errors);
            }
            return result;
        },
        defaultValues,
        values: processedEntity ? setValues(processedEntity) : defaultValues,
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

/**
 * Ensures that an entity with translations has entries for all available languages.
 * If a language is missing, it creates an empty translation based on the structure of existing translations.
 */
function ensureTranslationsForAllLanguages<E extends Record<string, any>>(
    entity: E | null | undefined,
    availableLanguages: string[] = [],
): E | null | undefined {
    if (
        !entity ||
        !('translations' in entity) ||
        !Array.isArray((entity as any).translations) ||
        !availableLanguages.length
    ) {
        return entity;
    }

    // Create a deep copy of the entity to avoid mutation
    const processedEntity = { ...entity } as any;
    const translations = [...(processedEntity.translations || [])];

    // Get existing language codes
    const existingLanguageCodes = new Set(translations.map((t: any) => t.languageCode));

    // Add missing language translations
    for (const langCode of availableLanguages) {
        if (!existingLanguageCodes.has(langCode)) {
            // Find a translation to use as template for field structure
            const template = translations[0] || {};
            const emptyTranslation: Record<string, any> = {
                languageCode: langCode,
            };

            // Add empty fields based on template (excluding languageCode)
            Object.keys(template).forEach(key => {
                if (key !== 'languageCode') {
                    emptyTranslation[key] = '';
                }
            });

            translations.push(emptyTranslation);
        }
    }

    // Update the processed entity with complete translations
    processedEntity.translations = translations;

    return processedEntity as E;
}
