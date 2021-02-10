import { getGraphQlInputName } from '@vendure/common/lib/shared-utils';
import { simpleDeepClone } from '@vendure/common/lib/simple-deep-clone';

import { CustomFieldConfig } from '../../common/generated-types';

/**
 * Transforms any custom field "relation" type inputs into the corresponding `<name>Id` format,
 * as expected by the server.
 */
export function transformRelationCustomFieldInputs<T extends { input?: any } & Record<string, any> = any>(
    variables: T,
    customFieldConfig: CustomFieldConfig[],
): T {
    if (variables.input) {
        transformRelations(variables.input, customFieldConfig);
    }
    return transformRelations(variables, customFieldConfig);
}

/**
 * @description
 * When persisting custom fields, we need to send just the IDs of the relations,
 * rather than the objects themselves.
 */
function transformRelations(input: any, customFieldConfig: CustomFieldConfig[]) {
    for (const field of customFieldConfig) {
        if (field.type === 'relation') {
            if (hasCustomFields(input)) {
                const entityValue = input.customFields[field.name];
                if (input.customFields.hasOwnProperty(field.name)) {
                    delete input.customFields[field.name];
                    input.customFields[getGraphQlInputName(field)] =
                        field.list && Array.isArray(entityValue)
                            ? entityValue.map(v => v?.id)
                            : entityValue === null
                            ? null
                            : entityValue?.id;
                }
            }
        }
    }
    return input;
}

function hasCustomFields(input: any): input is { customFields: { [key: string]: any } } {
    return input != null && input.hasOwnProperty('customFields');
}
