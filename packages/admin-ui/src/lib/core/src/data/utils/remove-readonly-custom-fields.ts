import { simpleDeepClone } from '@vendure/common/lib/simple-deep-clone';
import { DocumentNode, getOperationAST, NamedTypeNode, TypeNode } from 'graphql';

import { CustomFieldConfig } from '../../common/generated-types';

const CREATE_ENTITY_REGEX = /Create([A-Za-z]+)Input/;
const UPDATE_ENTITY_REGEX = /Update([A-Za-z]+)Input/;

type InputWithOptionalCustomFields = Record<string, any> & {
    customFields?: Record<string, any>;
};
type InputWithCustomFields = Record<string, any> & {
    customFields: Record<string, any>;
};

type EntityInput = InputWithOptionalCustomFields & {
    translations?: InputWithOptionalCustomFields[];
};

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

            // special cases which don't follow the usual pattern
            if (inputTypeName === 'UpdateActiveAdministratorInput') {
                return 'Administrator';
            }
            if (inputTypeName === 'ModifyOrderInput') {
                return 'Order';
            }
            if (
                inputTypeName === 'AddItemToDraftOrderInput' ||
                inputTypeName === 'AdjustDraftOrderLineInput'
            ) {
                return 'OrderLine';
            }

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
export function removeReadonlyCustomFields(
    variables: { input?: EntityInput | EntityInput[] } | EntityInput | EntityInput[],
    customFieldConfig: CustomFieldConfig[],
): { input?: EntityInput | EntityInput[] } | EntityInput | EntityInput[] {
    if (!Array.isArray(variables)) {
        if (Array.isArray(variables.input)) {
            for (const input of variables.input) {
                removeReadonly(input, customFieldConfig);
            }
        } else {
            removeReadonly(variables.input, customFieldConfig);
        }
    } else {
        for (const input of variables) {
            removeReadonly(input, customFieldConfig);
        }
    }
    return removeReadonly(variables, customFieldConfig);
}

function removeReadonly(input: InputWithOptionalCustomFields, customFieldConfig: CustomFieldConfig[]) {
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

function hasCustomFields(input: any): input is InputWithCustomFields {
    return input != null && input.hasOwnProperty('customFields');
}

function hasTranslations(input: any): input is { translations: InputWithOptionalCustomFields[] } {
    return input != null && input.hasOwnProperty('translations');
}
