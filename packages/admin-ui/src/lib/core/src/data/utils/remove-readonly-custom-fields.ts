import { simpleDeepClone } from '@vendure/common/lib/simple-deep-clone';
import { DocumentNode, getOperationAST, NamedTypeNode, TypeNode } from 'graphql';

import { CustomFieldConfig } from '../../common/generated-types';

const CREATE_ENTITY_REGEX = /Create([A-Za-z]+)Input/;
const UPDATE_ENTITY_REGEX = /Update([A-Za-z]+)Input/;

/**
 * Checks the current documentNode for an operation with a variable named "Create<Entity>Input" or "Update<Entity>Input"
 * and if a match is found, returns the <Entity> name.
 */
export function isEntityCreateOrUpdateMutation(documentNode: DocumentNode): string | undefined {
    const operationDef = getOperationAST(documentNode, null);
    if (operationDef && operationDef.variableDefinitions) {
        for (const variableDef of operationDef.variableDefinitions) {
            const namedType = extractInputType(variableDef.type);
            const inputTypeName = namedType.name.value;

            const createMatch = inputTypeName.match(CREATE_ENTITY_REGEX);
            if (createMatch) {
                return createMatch[1];
            }
            const updateMatch = inputTypeName.match(UPDATE_ENTITY_REGEX);
            if (updateMatch) {
                return updateMatch[1];
            }
        }
    }
}

function extractInputType(type: TypeNode): NamedTypeNode {
    if (type.kind === 'NonNullType') {
        return extractInputType(type.type);
    }
    if (type.kind === 'ListType') {
        return extractInputType(type.type);
    }
    return type;
}

/**
 * Removes any `readonly` custom fields from an entity (including its translations).
 * To be used before submitting the entity for a create or update request.
 */
export function removeReadonlyCustomFields<T extends any = any>(
    variables: T,
    customFieldConfig: CustomFieldConfig[],
): T {
    const clone = simpleDeepClone(variables as any);
    if (clone.input) {
        removeReadonly(clone.input, customFieldConfig);
    }
    return removeReadonly(clone, customFieldConfig);
}

function removeReadonly(input: any, customFieldConfig: CustomFieldConfig[]) {
    for (const field of customFieldConfig) {
        if (field.readonly) {
            if (field.type === 'localeString') {
                if (hasTranslations(input)) {
                    for (const translation of input.translations) {
                        if (
                            hasCustomFields(translation) &&
                            translation.customFields[field.name] !== undefined
                        ) {
                            delete translation.customFields[field.name];
                        }
                    }
                }
            } else {
                if (hasCustomFields(input) && input.customFields[field.name] !== undefined) {
                    delete input.customFields[field.name];
                }
            }
        }
    }
    return input;
}

function hasCustomFields(input: any): input is { customFields: { [key: string]: any } } {
    return input != null && input.hasOwnProperty('customFields');
}

function hasTranslations(input: any): input is { translations: any[] } {
    return input != null && input.hasOwnProperty('translations');
}
