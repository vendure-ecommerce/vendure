import { buildSchema, extendSchema, parse, printSchema } from 'graphql';

import { CustomFieldConfig, CustomFields, CustomFieldType } from '../../../shared/shared-types';
import { assertNever } from '../../../shared/shared-utils';

/**
 * Given a CustomFields config object, generates an SDL string extending the built-in
 * types with a customFields property for all entities, translations and inputs for which
 * custom fields are defined.
 */
export function addGraphQLCustomFields(typeDefs: string, customFieldConfig?: CustomFields): string {
    const schema = buildSchema(typeDefs);

    if (!customFieldConfig) {
        return typeDefs;
    }

    let customFieldTypeDefs = '';

    for (const entityName of Object.keys(customFieldConfig)) {
        const customEntityFields = customFieldConfig[entityName as keyof CustomFields];

        if (customEntityFields) {
            const localeStringFields = customEntityFields.filter(field => field.type === 'localeString');
            const nonLocaleStringFields = customEntityFields.filter(field => field.type !== 'localeString');

            if (schema.getType(entityName)) {
                customFieldTypeDefs += `
                    type ${entityName}CustomFields {
                        ${mapToFields(customEntityFields)}
                    }

                    extend type ${entityName} {
                        customFields: ${entityName}CustomFields
                    }
                `;
            }

            if (localeStringFields.length && schema.getType(`${entityName}Translation`)) {
                customFieldTypeDefs += `
                    type ${entityName}TranslationCustomFields {
                         ${mapToFields(localeStringFields)}
                    }

                    extend type ${entityName}Translation {
                        customFields: ${entityName}TranslationCustomFields
                    }
                `;
            }

            if (schema.getType(`Create${entityName}Input`)) {
                customFieldTypeDefs += `
                    input Create${entityName}CustomFieldsInput {
                       ${mapToFields(nonLocaleStringFields)}
                    }

                    extend input Create${entityName}Input {
                        customFields: Create${entityName}CustomFieldsInput
                    }
                `;
            }

            if (schema.getType(`Update${entityName}Input`)) {
                customFieldTypeDefs += `
                    input Update${entityName}CustomFieldsInput {
                       ${mapToFields(nonLocaleStringFields)}
                    }

                    extend input Update${entityName}Input {
                        customFields: Update${entityName}CustomFieldsInput
                    }
                `;
            }

            if (localeStringFields && schema.getType(`${entityName}TranslationInput`)) {
                customFieldTypeDefs += `
                    input ${entityName}TranslationCustomFieldsInput {
                        ${mapToFields(localeStringFields)}
                    }

                    extend input ${entityName}TranslationInput {
                        customFields: ${entityName}TranslationCustomFieldsInput
                    }
                `;
            }
        }
    }

    return printSchema(extendSchema(schema, parse(customFieldTypeDefs)));
}

type GraphQLFieldType = 'String' | 'Int' | 'Float' | 'Boolean' | 'ID';

/**
 * Maps an array of CustomFieldConfig objects into a string of SDL fields.
 */
function mapToFields(fieldDefs: CustomFieldConfig[]): string {
    return fieldDefs.map(field => `${field.name}: ${getGraphQlType(field.type)}`).join('\n');
}

function getGraphQlType(type: CustomFieldType): GraphQLFieldType {
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
