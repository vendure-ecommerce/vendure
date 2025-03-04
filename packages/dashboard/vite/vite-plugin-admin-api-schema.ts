import { GraphQLTypesLoader } from '@nestjs/graphql';
import {
    getConfig,
    getFinalVendureSchema,
    resetConfig,
    runPluginConfigurations,
    setConfig,
    VENDURE_ADMIN_API_TYPE_PATHS,
    VendureConfig,
} from '@vendure/core';
import {
    buildSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLType,
    isInputObjectType,
    isObjectType,
    isScalarType,
} from 'graphql';
import { Plugin } from 'vite';

export interface SchemaInfo {
    types: {
        [typename: string]: {
            [fieldname: string]: readonly [
                type: string,
                nullable: boolean,
                list: boolean,
                isPaginatedList: boolean,
            ];
        };
    };
    inputs: {
        [typename: string]: {
            [fieldname: string]: readonly [
                type: string,
                nullable: boolean,
                list: boolean,
                isPaginatedList: boolean,
            ];
        };
    };
    scalars: string[];
}

function getTypeInfo(type: GraphQLType) {
    let nullable = true;
    let list = false;
    let isPaginatedList = false;

    // Unwrap NonNull
    if (type instanceof GraphQLNonNull) {
        nullable = false;
        type = type.ofType;
    }

    // Unwrap List
    if (type instanceof GraphQLList) {
        list = true;
        type = type.ofType;
    }

    if (type instanceof GraphQLObjectType) {
        if (type.getInterfaces().some(i => i.name === 'PaginatedList')) {
            isPaginatedList = true;
        }
    }

    return [type.toString().replace(/!$/, ''), nullable, list, isPaginatedList] as const;
}

function generateSchemaInfo(schema: GraphQLSchema): SchemaInfo {
    const types = schema.getTypeMap();
    const result: SchemaInfo = { types: {}, inputs: {}, scalars: [] };

    Object.values(types).forEach(type => {
        if (isObjectType(type)) {
            const fields = type.getFields();
            result.types[type.name] = {};

            Object.entries(fields).forEach(([fieldName, field]) => {
                result.types[type.name][fieldName] = getTypeInfo(field.type);
            });
        }
        if (isInputObjectType(type)) {
            const fields = type.getFields();
            result.inputs[type.name] = {};

            Object.entries(fields).forEach(([fieldName, field]) => {
                result.inputs[type.name][fieldName] = getTypeInfo(field.type);
            });
        }
        if (isScalarType(type)) {
            result.scalars.push(type.name);
        }
    });

    return result;
}

const virtualModuleId = 'virtual:admin-api-schema';
const resolvedVirtualModuleId = `\0${virtualModuleId}`;
let schemaInfo: SchemaInfo;

export async function adminApiSchemaPlugin(options: { config: VendureConfig }): Promise<Plugin> {
    resetConfig();
    await setConfig(options.config ?? {});

    if (!schemaInfo) {
        const runtimeConfig = await runPluginConfigurations(getConfig() as any);
        const typesLoader = new GraphQLTypesLoader();
        const finalSchema = await getFinalVendureSchema({
            config: runtimeConfig,
            typePaths: VENDURE_ADMIN_API_TYPE_PATHS,
            typesLoader,
            apiType: 'admin',
            output: 'sdl',
        });
        const safeSchema = buildSchema(finalSchema);
        schemaInfo = generateSchemaInfo(safeSchema);
    }

    return {
        name: 'vendure-admin-api-schema',
        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId;
            }
        },
        load(id) {
            if (id === resolvedVirtualModuleId) {
                return `
                    export const schemaInfo = ${JSON.stringify(schemaInfo)};
                `;
            }
        },
    };
}
