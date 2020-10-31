import { stitchSchemas } from '@graphql-tools/stitch';
import {
    buildSchema,
    GraphQLEnumType,
    GraphQLField,
    GraphQLInputFieldConfig,
    GraphQLInputFieldConfigMap,
    GraphQLInputObjectType,
    GraphQLInputType,
    GraphQLInt,
    GraphQLNamedType,
    GraphQLObjectType,
    GraphQLOutputType,
    GraphQLSchema,
    isEnumType,
    isListType,
    isNonNullType,
    isObjectType,
} from 'graphql';

/**
 * Generates ListOptions inputs for queries which return PaginatedList types.
 */
export function generateListOptions(typeDefsOrSchema: string | GraphQLSchema): GraphQLSchema {
    const schema = typeof typeDefsOrSchema === 'string' ? buildSchema(typeDefsOrSchema) : typeDefsOrSchema;
    const queryType = schema.getQueryType();
    if (!queryType) {
        return schema;
    }
    const objectTypes = Object.values(schema.getTypeMap()).filter(isObjectType);
    const allFields = objectTypes.reduce((fields, type) => {
        const typeFields = Object.values(type.getFields()).filter(f => isListQueryType(f.type));
        return [...fields, ...typeFields];
    }, [] as Array<GraphQLField<any, any>>);
    const generatedTypes: GraphQLNamedType[] = [];

    for (const query of allFields) {
        const targetTypeName = unwrapNonNullType(query.type).toString().replace(/List$/, '');
        const targetType = schema.getType(targetTypeName);
        if (targetType && isObjectType(targetType)) {
            const sortParameter = createSortParameter(schema, targetType);
            const filterParameter = createFilterParameter(schema, targetType);
            const existingListOptions = schema.getType(
                `${targetTypeName}ListOptions`,
            ) as GraphQLInputObjectType | null;
            const generatedListOptions = new GraphQLInputObjectType({
                name: `${targetTypeName}ListOptions`,
                fields: {
                    skip: { type: GraphQLInt },
                    take: { type: GraphQLInt },
                    sort: { type: sortParameter },
                    filter: { type: filterParameter },
                    ...(existingListOptions ? existingListOptions.getFields() : {}),
                },
            });

            if (!query.args.find(a => a.type.toString() === `${targetTypeName}ListOptions`)) {
                query.args.push({
                    name: 'options',
                    type: generatedListOptions,
                    description: null,
                    defaultValue: null,
                    extensions: null,
                    astNode: null,
                });
            }

            generatedTypes.push(filterParameter);
            generatedTypes.push(sortParameter);
            generatedTypes.push(generatedListOptions);
        }
    }
    return stitchSchemas({ schemas: [schema, generatedTypes] });
}

function isListQueryType(type: GraphQLOutputType): type is GraphQLObjectType {
    const innerType = unwrapNonNullType(type);
    return isObjectType(innerType) && !!innerType.getInterfaces().find(i => i.name === 'PaginatedList');
}

function createSortParameter(schema: GraphQLSchema, targetType: GraphQLObjectType) {
    const fields = Object.values(targetType.getFields());
    const targetTypeName = targetType.name;
    const SortOrder = schema.getType('SortOrder') as GraphQLEnumType;

    const sortableTypes = ['ID', 'String', 'Int', 'Float', 'DateTime'];
    return new GraphQLInputObjectType({
        name: `${targetTypeName}SortParameter`,
        fields: fields
            .filter(field => sortableTypes.includes(unwrapNonNullType(field.type).name))
            .reduce((result, field) => {
                const fieldConfig: GraphQLInputFieldConfig = {
                    type: SortOrder,
                };
                return {
                    ...result,
                    [field.name]: fieldConfig,
                };
            }, {} as GraphQLInputFieldConfigMap),
    });
}

function createFilterParameter(schema: GraphQLSchema, targetType: GraphQLObjectType): GraphQLInputObjectType {
    const fields = Object.values(targetType.getFields());
    const targetTypeName = targetType.name;
    const { StringOperators, BooleanOperators, NumberOperators, DateOperators } = getCommonTypes(schema);

    return new GraphQLInputObjectType({
        name: `${targetTypeName}FilterParameter`,
        fields: fields.reduce((result, field) => {
            const filterType = getFilterType(field);
            if (!filterType) {
                return result;
            }
            const fieldConfig: GraphQLInputFieldConfig = {
                type: filterType,
            };
            return {
                ...result,
                [field.name]: fieldConfig,
            };
        }, {} as GraphQLInputFieldConfigMap),
    });

    function getFilterType(field: GraphQLField<any, any>): GraphQLInputType | undefined {
        if (isListType(field.type)) {
            return;
        }
        const innerType = unwrapNonNullType(field.type);
        if (isEnumType(innerType)) {
            return StringOperators;
        }
        switch (innerType.name) {
            case 'String':
                return StringOperators;
            case 'Boolean':
                return BooleanOperators;
            case 'Int':
            case 'Float':
                return NumberOperators;
            case 'DateTime':
                return DateOperators;
            default:
                return;
        }
    }
}

function getCommonTypes(schema: GraphQLSchema) {
    const SortOrder = schema.getType('SortOrder') as GraphQLEnumType | null;
    const StringOperators = schema.getType('StringOperators') as GraphQLInputType | null;
    const BooleanOperators = schema.getType('BooleanOperators') as GraphQLInputType | null;
    const NumberRange = schema.getType('NumberRange') as GraphQLInputType | null;
    const NumberOperators = schema.getType('NumberOperators') as GraphQLInputType | null;
    const DateRange = schema.getType('DateRange') as GraphQLInputType | null;
    const DateOperators = schema.getType('DateOperators') as GraphQLInputType | null;
    if (
        !SortOrder ||
        !StringOperators ||
        !BooleanOperators ||
        !NumberRange ||
        !NumberOperators ||
        !DateRange ||
        !DateOperators
    ) {
        throw new Error(`A common type was not defined`);
    }
    return {
        SortOrder,
        StringOperators,
        BooleanOperators,
        NumberOperators,
        DateOperators,
    };
}

/**
 * Unwraps the inner type if it is inside a non-nullable type
 */
function unwrapNonNullType(type: GraphQLOutputType): GraphQLNamedType {
    if (isNonNullType(type)) {
        return type.ofType;
    }
    return type;
}
