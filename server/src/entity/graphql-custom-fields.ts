import { assertNever } from '../../../shared/shared-utils';
import { CustomFields, CustomFieldType } from '../config/vendure-config';

/**
 * Given a CustomFields config object, generates an SDL string extending the built-in
 * types with a customFields property.
 */
export function generateGraphQlCustomFieldsTypes(customFieldConfig?: CustomFields): string {
    if (!customFieldConfig) {
        return '';
    }

    let customFieldTypeDefs = '';
    for (const entityName of Object.keys(customFieldConfig)) {
        const customEntityFields = customFieldConfig[entityName as keyof CustomFields];

        if (customEntityFields) {
            customFieldTypeDefs += `
            type ${entityName}CustomFields {
                ${customEntityFields.map(field => `${field.name}: ${getGraphQlType(field.type)}`).join('\n')}
            }

            extend type ${entityName} {
                customFields: ${entityName}CustomFields
            }
        `;
        }
    }

    return customFieldTypeDefs;
}

type GraphQLSDLType = 'String' | 'Int' | 'Float' | 'Boolean' | 'ID';

function getGraphQlType(type: CustomFieldType): GraphQLSDLType {
    switch (type) {
        case 'string':
        case 'datetime':
        case 'localeString':
            return 'String';
        case 'boolean':
            return 'Boolean';
        case 'int':
            return 'Int';
        case 'float':
            return 'Float';
        default:
            assertNever(type);
    }
    return 'String';
}
