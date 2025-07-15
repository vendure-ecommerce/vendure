import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { VariablesOf } from 'gql.tada';
import { FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useChannel } from '../../hooks/use-channel.js';
import { useServerConfig } from '../../hooks/use-server-config.js';
import { getOperationVariablesFields } from '../document-introspection/get-document-structure.js';
import { createFormSchemaFromFields, getDefaultValuesFromFields } from './form-schema-tools.js';
import { removeEmptyIdFields, transformRelationFields } from './utils.js';

export interface GeneratedFormOptions<
    T extends TypedDocumentNode<any, any>,
    VarName extends keyof VariablesOf<T> | undefined = 'input',
    E extends Record<string, any> = Record<string, any>,
> {
    document?: T;
    varName?: VarName;
    entity: E | null | undefined;
    setValues: (
        entity: NonNullable<E>,
    ) => VarName extends keyof VariablesOf<T> ? VariablesOf<T>[VarName] : VariablesOf<T>;
    onSubmit?: (
        values: VarName extends keyof VariablesOf<T> ? VariablesOf<T>[VarName] : VariablesOf<T>,
    ) => void;
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
    VarName extends keyof VariablesOf<T> | undefined,
    E extends Record<string, any> = Record<string, any>,
>(options: GeneratedFormOptions<T, VarName, E>) {
    const { document, entity, setValues, onSubmit, varName } = options;
    const { activeChannel } = useChannel();
    const availableLanguages = useServerConfig()?.availableLanguages || [];
    const updateFields = document ? getOperationVariablesFields(document, varName) : [];
    const schema = createFormSchemaFromFields(updateFields);
    const defaultValues = getDefaultValuesFromFields(updateFields, activeChannel?.defaultLanguageCode);
    const processedEntity = ensureTranslationsForAllLanguages(entity, availableLanguages, defaultValues);

    const form = useForm({
        resolver: async (values, context, options) => {
            const result = await zodResolver(schema)(values, context, options);
            if (Object.keys(result.errors).length > 0) {
                console.log('Zod form validation errors:', result.errors);
            }
            return result;
        },
        mode: 'onChange',
        defaultValues,
        values: processedEntity
            ? transformRelationFields(updateFields, setValues(processedEntity))
            : defaultValues,
    });
    let submitHandler = (event: FormEvent) => {
        event.preventDefault();
    };
    if (onSubmit) {
        submitHandler = (event: FormEvent) => {
            const onSubmitWrapper = (values: any) => {
                onSubmit(removeEmptyIdFields(values, updateFields));
            };
            form.handleSubmit(onSubmitWrapper)(event);
        };
    }

    return { form, submitHandler };
}

/**
 * Ensures that an entity with translations has entries for all available languages.
 * If a language is missing, it creates an empty translation based on the structure of existing translations
 * and the expected form structure from defaultValues.
 */
function ensureTranslationsForAllLanguages<E extends Record<string, any>>(
    entity: E | null | undefined,
    availableLanguages: string[] = [],
    expectedStructure?: Record<string, any>,
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

    // Get the expected translation structure from defaultValues or existing translations
    const existingTemplate = translations[0] || {};
    const expectedTranslationStructure = expectedStructure?.translations?.[0] || {};

    // Merge the structures to ensure we have all expected fields
    const templateStructure = {
        ...expectedTranslationStructure,
        ...existingTemplate,
    };

    // Add missing language translations
    for (const langCode of availableLanguages) {
        if (!existingLanguageCodes.has(langCode)) {
            const emptyTranslation: Record<string, any> = {
                languageCode: langCode,
            };

            // Add empty fields based on merged template structure (excluding languageCode)
            Object.keys(templateStructure).forEach(key => {
                if (key !== 'languageCode') {
                    if (typeof templateStructure[key] === 'object' && templateStructure[key] !== null) {
                        // For nested objects like customFields, create an empty object
                        emptyTranslation[key] = Array.isArray(templateStructure[key]) ? [] : {};
                    } else {
                        // For primitive values, use empty string as default
                        emptyTranslation[key] = '';
                    }
                }
            });

            translations.push(emptyTranslation);
        } else {
            // For existing translations, ensure they have all expected fields
            const existingTranslation = translations.find((t: any) => t.languageCode === langCode);
            if (existingTranslation) {
                Object.keys(expectedTranslationStructure).forEach(key => {
                    if (key !== 'languageCode' && !(key in existingTranslation)) {
                        if (
                            typeof expectedTranslationStructure[key] === 'object' &&
                            expectedTranslationStructure[key] !== null
                        ) {
                            existingTranslation[key] = Array.isArray(expectedTranslationStructure[key])
                                ? []
                                : {};
                        } else {
                            existingTranslation[key] = '';
                        }
                    }
                });
            }
        }
    }

    // Update the processed entity with complete translations
    processedEntity.translations = translations;

    return processedEntity as E;
}
