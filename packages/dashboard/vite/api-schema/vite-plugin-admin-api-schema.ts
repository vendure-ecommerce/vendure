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
    GraphQLSchema,
    GraphQLType,
    isInputObjectType,
    isObjectType,
} from 'graphql';
import { Plugin } from 'vite';

interface SchemaInfo {
    types: {
        [typename: string]: {
            [fieldname: string]: readonly [type: string, nullable: boolean, list: boolean];
        };
    };
}

function getTypeInfo(type: GraphQLType) {
    let nullable = true;
    let list = false;

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

    return [type.toString().replace(/!$/, ''), nullable, list] as const;
}

function generateSchemaInfo(schema: GraphQLSchema): SchemaInfo {
    const types = schema.getTypeMap();
    const result: SchemaInfo = { types: {} };

    Object.values(types).forEach(type => {
        if (isObjectType(type) || isInputObjectType(type)) {
            const fields = type.getFields();
            result.types[type.name] = {};

            Object.entries(fields).forEach(([fieldName, field]) => {
                result.types[type.name][fieldName] = getTypeInfo(field.type);
            });
        }
    });

    return result;
}

const virtualModuleId = 'virtual:admin-api-schema';

let defaultSchema: GraphQLSchema;
let schemaInfo: SchemaInfo;

export async function adminApiSchemaPlugin(options: { config: VendureConfig }): Promise<Plugin> {
    resetConfig();
    await setConfig(options.config ?? {});

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

    return {
        name: 'vendure-admin-api-schema',
        resolveId(id, importer) {
            if (id === virtualModuleId) {
                return id;
            }
        },
        load(id) {
            if (id === virtualModuleId) {
                return `
                    export const schemaInfo = ${JSON.stringify(schemaInfo)};
                `;
            }
        },
    };
}
