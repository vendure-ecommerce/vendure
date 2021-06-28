import { CustomFieldType } from '@vendure/common/lib/shared-types';
import { assertNever, getGraphQlInputName } from '@vendure/common/lib/shared-utils';
import {
    buildSchema,
    extendSchema,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLSchema,
    InputObjectTypeDefinitionNode,
    ObjectTypeDefinitionNode,
    parse,
} from 'graphql';

import { CustomFieldConfig, CustomFields } from '../../config/custom-field/custom-field-types';

/**
 * Given a CustomFields config object, generates an SDL string extending the built-in
 * types with a customFields property for all entities, translations and inputs for which
 * custom fields are defined.
 */
export function addGraphQLCustomFields(
    typeDefsOrSchema: string | GraphQLSchema,
    customFieldConfig: CustomFields,
    publicOnly: boolean,
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
        const customEntityFields = (customFieldConfig[entityName as keyof CustomFields] || []).filter(
            config => {
                return !config.internal && (publicOnly === true ? config.public !== false : true);
            },
        );

        for (const fieldDef of customEntityFields) {
            if (fieldDef.type === 'relation') {
                if (!schema.getType(fieldDef.graphQLType || fieldDef.entity.name)) {
                    throw new Error(
                        `The GraphQL type "${fieldDef.graphQLType}" specified by the ${entityName}.${fieldDef.name} custom field does not exist`,
                    );
                }
            }
        }

        const localeStringFields = customEntityFields.filter(field => field.type === 'localeString');
        const nonLocaleStringFields = customEntityFields.filter(field => field.type !== 'localeString');
        const writeableLocaleStringFields = localeStringFields.filter(field => !field.readonly);
        const writeableNonLocaleStringFields = nonLocaleStringFields.filter(field => !field.readonly);
        const filterableFields = customEntityFields.filter(field => field.type !== 'relation');

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
            if (writeableNonLocaleStringFields.length) {
                customFieldTypeDefs += `
                    input Create${entityName}CustomFieldsInput {
                       ${mapToFields(
                           writeableNonLocaleStringFields,
                           getGraphQlInputType,
                           getGraphQlInputName,
                       )}
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
            if (writeableNonLocaleStringFields.length) {
                customFieldTypeDefs += `
                    input Update${entityName}CustomFieldsInput {
                       ${mapToFields(
                           writeableNonLocaleStringFields,
                           getGraphQlInputType,
                           getGraphQlInputName,
                       )}
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

        if (filterableFields.length && schema.getType(`${entityName}FilterParameter`)) {
            customFieldTypeDefs += `
                    extend input ${entityName}FilterParameter {
                         ${mapToFields(filterableFields, getFilterOperator)}
                    }
                `;
        }

        if (writeableLocaleStringFields) {
            const translationInputs = [
                `${entityName}TranslationInput`,
                `Create${entityName}TranslationInput`,
                `Update${entityName}TranslationInput`,
            ];
            for (const inputName of translationInputs) {
                if (schema.getType(inputName)) {
                    if (writeableLocaleStringFields.length) {
                        customFieldTypeDefs += `
                            input ${inputName}CustomFields {
                                ${mapToFields(writeableLocaleStringFields, getGraphQlType)}
                            }

                            extend input ${inputName} {
                                customFields: ${inputName}CustomFields
                            }
                        `;
                    } else {
                        customFieldTypeDefs += `
                            extend input ${inputName} {
                                customFields: JSON
                            }
                        `;
                    }
                }
            }
        }
    }

    if (customFieldConfig.Address?.length) {
        // For custom fields on the Address entity, we also extend the OrderAddress
        // type (which is used to store address snapshots on Orders)
        if (schema.getType('OrderAddress')) {
            customFieldTypeDefs += `
                extend type OrderAddress {
                    customFields: AddressCustomFields
                }
            `;
        }
    } else {
        if (schema.getType('OrderAddress')) {
            customFieldTypeDefs += `
                extend type OrderAddress {
                    customFields: JSON
                }
        `;
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

export function addActiveAdministratorCustomFields(
    typeDefsOrSchema: string | GraphQLSchema,
    administratorCustomFields: CustomFieldConfig[],
) {
    const schema = typeof typeDefsOrSchema === 'string' ? buildSchema(typeDefsOrSchema) : typeDefsOrSchema;
    const extension = `
        extend input UpdateActiveAdministratorInput {
            customFields: ${
                0 < administratorCustomFields?.length ? 'UpdateAdministratorCustomFieldsInput' : 'JSON'
            }
        }
    `;
    return extendSchema(schema, parse(extension));
}

/**
 * If CustomFields are defined on the Customer entity, then an extra `customFields` field is added to
 * the `RegisterCustomerInput` so that public writable custom fields can be set when a new customer
 * is registered.
 */
export function addRegisterCustomerCustomFieldsInput(
    typeDefsOrSchema: string | GraphQLSchema,
    customerCustomFields: CustomFieldConfig[],
): GraphQLSchema {
    const schema = typeof typeDefsOrSchema === 'string' ? buildSchema(typeDefsOrSchema) : typeDefsOrSchema;
    if (!customerCustomFields || customerCustomFields.length === 0) {
        return schema;
    }
    const publicWritableCustomFields = customerCustomFields.filter(fieldDef => {
        return fieldDef.public !== false && !fieldDef.readonly && !fieldDef.internal;
    });
    if (publicWritableCustomFields.length < 1) {
        return schema;
    }
    const customFieldTypeDefs = `
        input RegisterCustomerCustomFieldsInput {
            ${mapToFields(publicWritableCustomFields, getGraphQlInputType, getGraphQlInputName)}
        }

        extend input RegisterCustomerInput {
            customFields: RegisterCustomerCustomFieldsInput
        }
    `;
    return extendSchema(schema, parse(customFieldTypeDefs));
}

/**
 * If CustomFields are defined on the Order entity, we add a `customFields` field to the ModifyOrderInput
 * type.
 */
export function addModifyOrderCustomFields(
    typeDefsOrSchema: string | GraphQLSchema,
    orderCustomFields: CustomFieldConfig[],
): GraphQLSchema {
    const schema = typeof typeDefsOrSchema === 'string' ? buildSchema(typeDefsOrSchema) : typeDefsOrSchema;
    if (!orderCustomFields || orderCustomFields.length === 0) {
        return schema;
    }
    if (schema.getType('ModifyOrderInput') && schema.getType('UpdateOrderCustomFieldsInput')) {
        const customFieldTypeDefs = `
                extend input ModifyOrderInput {
                    customFields: UpdateOrderCustomFieldsInput
                }
            `;

        return extendSchema(schema, parse(customFieldTypeDefs));
    }
    return schema;
}

/**
 * If CustomFields are defined on the OrderLine entity, then an extra `customFields` argument
 * must be added to the `addItemToOrder` and `adjustOrderLine` mutations, as well as the related
 * fields in the `ModifyOrderInput` type.
 */
export function addOrderLineCustomFieldsInput(
    typeDefsOrSchema: string | GraphQLSchema,
    orderLineCustomFields: CustomFieldConfig[],
): GraphQLSchema {
    const schema = typeof typeDefsOrSchema === 'string' ? buildSchema(typeDefsOrSchema) : typeDefsOrSchema;
    const publicCustomFields = orderLineCustomFields.filter(f => f.public !== false);
    if (!publicCustomFields || publicCustomFields.length === 0) {
        return schema;
    }
    const schemaConfig = schema.toConfig();
    const mutationType = schemaConfig.mutation;
    if (!mutationType) {
        return schema;
    }
    const input = new GraphQLInputObjectType({
        name: 'OrderLineCustomFieldsInput',
        fields: publicCustomFields.reduce((fields, field) => {
            const name = getGraphQlInputName(field);
            // tslint:disable-next-line:no-non-null-assertion
            const primitiveType = schema.getType(getGraphQlInputType(field))!;
            const type = field.list === true ? new GraphQLList(primitiveType) : primitiveType;
            return { ...fields, [name]: { type } };
        }, {}),
    });
    schemaConfig.types.push(input);

    const addItemToOrderMutation = mutationType.getFields().addItemToOrder;
    const adjustOrderLineMutation = mutationType.getFields().adjustOrderLine;
    if (addItemToOrderMutation) {
        addItemToOrderMutation.args.push({
            name: 'customFields',
            type: input,
            description: null,
            defaultValue: null,
            extensions: null,
            astNode: null,
            deprecationReason: null,
        });
    }
    if (adjustOrderLineMutation) {
        adjustOrderLineMutation.args.push({
            name: 'customFields',
            type: input,
            description: null,
            defaultValue: null,
            extensions: null,
            astNode: null,
            deprecationReason: null,
        });
    }

    let extendedSchema = new GraphQLSchema(schemaConfig);
    if (schema.getType('AddItemInput')) {
        const customFieldTypeDefs = `
            extend input AddItemInput {
                customFields: OrderLineCustomFieldsInput
            }
        `;

        extendedSchema = extendSchema(extendedSchema, parse(customFieldTypeDefs));
    }
    if (schema.getType('AdjustOrderLineInput')) {
        const customFieldTypeDefs = `
            extend input AdjustOrderLineInput {
                customFields: OrderLineCustomFieldsInput
            }
        `;

        extendedSchema = extendSchema(extendedSchema, parse(customFieldTypeDefs));
    }

    return extendedSchema;
}

/**
 * Maps an array of CustomFieldConfig objects into a string of SDL fields.
 */
function mapToFields(
    fieldDefs: CustomFieldConfig[],
    typeFn: (def: CustomFieldConfig) => string | undefined,
    nameFn?: (def: Pick<CustomFieldConfig, 'name' | 'type' | 'list'>) => string,
): string {
    const res = fieldDefs
        .map(field => {
            const primitiveType = typeFn(field);
            if (!primitiveType) {
                return;
            }
            const finalType = field.list ? `[${primitiveType}!]` : primitiveType;
            const name = nameFn ? nameFn(field) : field.name;
            return `${name}: ${finalType}`;
        })
        .filter(x => x != null);
    return res.join('\n');
}

function getFilterOperator(config: CustomFieldConfig): string | undefined {
    switch (config.type) {
        case 'datetime':
            return 'DateOperators';
        case 'string':
        case 'localeString':
        case 'text':
            return 'StringOperators';
        case 'boolean':
            return 'BooleanOperators';
        case 'int':
        case 'float':
            return 'NumberOperators';
        case 'relation':
            return undefined;
        default:
            assertNever(config);
    }
    return 'String';
}

function getGraphQlInputType(config: CustomFieldConfig): string {
    return config.type === 'relation' ? `ID` : getGraphQlType(config);
}

function getGraphQlType(config: CustomFieldConfig): string {
    switch (config.type) {
        case 'string':
        case 'localeString':
        case 'text':
            return 'String';
        case 'datetime':
            return 'DateTime';
        case 'boolean':
            return 'Boolean';
        case 'int':
            return 'Int';
        case 'float':
            return 'Float';
        case 'relation':
            return config.graphQLType || config.entity.name;
        default:
            assertNever(config);
    }
    return 'String';
}
