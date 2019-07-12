import { CustomFieldType } from '@vendure/common/lib/shared-types';
import { assertNever } from '@vendure/common/lib/shared-utils';
import { buildSchema, extendSchema, GraphQLInputObjectType, GraphQLSchema, parse } from 'graphql';

import { CustomFieldConfig, CustomFields } from '../../config/custom-field/custom-field-types';

/**
 * Given a CustomFields config object, generates an SDL string extending the built-in
 * types with a customFields property for all entities, translations and inputs for which
 * custom fields are defined.
 */
export function addGraphQLCustomFields(
    typeDefsOrSchema: string | GraphQLSchema,
    customFieldConfig: CustomFields,
): GraphQLSchema {
    const schema = typeof typeDefsOrSchema === 'string' ? buildSchema(typeDefsOrSchema) : typeDefsOrSchema;

    let customFieldTypeDefs = '';

    if (!schema.getType('JSON')) {
        customFieldTypeDefs += `
            scalar JSON
        `;
    }

    if (!schema.getType('DateTime')) {
        customFieldTypeDefs += `
            scalar DateTime
        `;
    }

    for (const entityName of Object.keys(customFieldConfig)) {
        const customEntityFields = customFieldConfig[entityName as keyof CustomFields] || [];

        const localeStringFields = customEntityFields.filter(field => field.type === 'localeString');
        const nonLocaleStringFields = customEntityFields.filter(field => field.type !== 'localeString');

        if (schema.getType(entityName)) {
            if (customEntityFields.length) {
                customFieldTypeDefs += `
                    type ${entityName}CustomFields {
                        ${mapToFields(customEntityFields, getGraphQlType)}
                    }

                    extend type ${entityName} {
                        customFields: ${entityName}CustomFields
                    }
                `;
            } else {
                customFieldTypeDefs += `
                    extend type ${entityName} {
                        customFields: JSON
                    }
                `;
            }
        }

        if (localeStringFields.length && schema.getType(`${entityName}Translation`)) {
            customFieldTypeDefs += `
                    type ${entityName}TranslationCustomFields {
                         ${mapToFields(localeStringFields, getGraphQlType)}
                    }

                    extend type ${entityName}Translation {
                        customFields: ${entityName}TranslationCustomFields
                    }
                `;
        }

        if (schema.getType(`Create${entityName}Input`)) {
            if (nonLocaleStringFields.length) {
                customFieldTypeDefs += `
                    input Create${entityName}CustomFieldsInput {
                       ${mapToFields(nonLocaleStringFields, getGraphQlType)}
                    }

                    extend input Create${entityName}Input {
                        customFields: Create${entityName}CustomFieldsInput
                    }
                `;
            } else {
                customFieldTypeDefs += `
                   extend input Create${entityName}Input {
                       customFields: JSON
                   }
               `;
            }
        }

        if (schema.getType(`Update${entityName}Input`)) {
            if (nonLocaleStringFields.length) {
                customFieldTypeDefs += `
                    input Update${entityName}CustomFieldsInput {
                       ${mapToFields(nonLocaleStringFields, getGraphQlType)}
                    }

                    extend input Update${entityName}Input {
                        customFields: Update${entityName}CustomFieldsInput
                    }
                `;
            } else {
                customFieldTypeDefs += `
                    extend input Update${entityName}Input {
                        customFields: JSON
                    }
                `;
            }
        }

        if (customEntityFields.length && schema.getType(`${entityName}SortParameter`)) {
            customFieldTypeDefs += `
                    extend input ${entityName}SortParameter {
                         ${mapToFields(customEntityFields, () => 'SortOrder')}
                    }
                `;
        }

        if (customEntityFields.length && schema.getType(`${entityName}FilterParameter`)) {
            customFieldTypeDefs += `
                    extend input ${entityName}FilterParameter {
                         ${mapToFields(customEntityFields, getFilterOperator)}
                    }
                `;
        }

        if (localeStringFields && schema.getType(`${entityName}TranslationInput`)) {
            if (localeStringFields.length) {
                customFieldTypeDefs += `
                    input ${entityName}TranslationCustomFieldsInput {
                        ${mapToFields(localeStringFields, getGraphQlType)}
                    }

                    extend input ${entityName}TranslationInput {
                        customFields: ${entityName}TranslationCustomFieldsInput
                    }
                `;
            } else {
                customFieldTypeDefs += `
                    extend input ${entityName}TranslationInput {
                        customFields: JSON
                    }
                `;
            }
        }
    }

    return extendSchema(schema, parse(customFieldTypeDefs));
}

export function addServerConfigCustomFields(
    typeDefsOrSchema: string | GraphQLSchema,
    customFieldConfig: CustomFields,
) {
    const schema = typeof typeDefsOrSchema === 'string' ? buildSchema(typeDefsOrSchema) : typeDefsOrSchema;
    const customFieldTypeDefs = `
            type CustomFields {
                ${Object.keys(customFieldConfig).reduce(
                    (output, name) => output + name + `: [CustomFieldConfig!]!\n`,
                    '',
                )}
            }

            extend type ServerConfig {
                customFieldConfig: CustomFields!
            }
        `;

    return extendSchema(schema, parse(customFieldTypeDefs));
}

/**
 * If CustomFields are defined on the OrderLine entity, then an extra `customFields` argument
 * must be added to the `addItemToOrder` and `adjustOrderLine` mutations.
 */
export function addOrderLineCustomFieldsInput(
    typeDefsOrSchema: string | GraphQLSchema,
    orderLineCustomFields: CustomFieldConfig[],
): GraphQLSchema {
    const schema = typeof typeDefsOrSchema === 'string' ? buildSchema(typeDefsOrSchema) : typeDefsOrSchema;
    if (!orderLineCustomFields || orderLineCustomFields.length === 0) {
        return schema;
    }
    const schemaConfig = schema.toConfig();
    const mutationType = schemaConfig.mutation;
    if (!mutationType) {
        return schema;
    }
    const addItemToOrderMutation = mutationType.getFields().addItemToOrder;
    const adjustOrderLineMutation = mutationType.getFields().adjustOrderLine;
    if (!addItemToOrderMutation || !adjustOrderLineMutation) {
        return schema;
    }
    const input = new GraphQLInputObjectType({
        name: 'OrderLineCustomFieldsInput',
        fields: orderLineCustomFields.reduce((fields, field) => {
            return { ...fields, [field.name]: { type: schema.getType(getGraphQlType(field.type)) } };
        }, {}),
    });

    schemaConfig.types.push(input);
    addItemToOrderMutation.args.push({
        name: 'customFields',
        type: input,
    });
    adjustOrderLineMutation.args.push({
        name: 'customFields',
        type: input,
    });

    return new GraphQLSchema(schemaConfig);
}

type GraphQLFieldType = 'DateTime' | 'String' | 'Int' | 'Float' | 'Boolean' | 'ID';

/**
 * Maps an array of CustomFieldConfig objects into a string of SDL fields.
 */
function mapToFields(
    fieldDefs: CustomFieldConfig[],
    typeFn: (fieldType: CustomFieldType) => string,
    prefix: string = '',
): string {
    return fieldDefs.map(field => `${prefix}${field.name}: ${typeFn(field.type)}`).join('\n');
}

function getFilterOperator(type: CustomFieldType): string {
    switch (type) {
        case 'datetime':
            return 'DateOperators';
        case 'string':
        case 'localeString':
            return 'StringOperators';
        case 'boolean':
            return 'BooleanOperators';
        case 'int':
        case 'float':
            return 'NumberOperators';
        default:
            assertNever(type);
    }
    return 'String';
}

function getGraphQlType(type: CustomFieldType): GraphQLFieldType {
    switch (type) {
        case 'string':
        case 'localeString':
            return 'String';
        case 'datetime':
            return 'DateTime';
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
