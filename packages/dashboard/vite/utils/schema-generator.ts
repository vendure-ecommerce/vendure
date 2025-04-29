import { GraphQLTypesLoader } from '@nestjs/graphql';
import {
    resetConfig,
    setConfig,
    getConfig,
    runPluginConfigurations,
    getFinalVendureSchema,
    VENDURE_ADMIN_API_TYPE_PATHS,
    VendureConfig,
} from '@vendure/core';
import { buildSchema } from 'graphql';
import { GraphQLSchema } from 'graphql';

let schemaPromise: Promise<GraphQLSchema> | undefined;

/**
 * @description
 * This function generates a GraphQL schema from the Vendure config.
 * It is used to generate the schema for the dashboard.
 */
export async function generateSchema({
    vendureConfig,
}: {
    vendureConfig: VendureConfig;
}): Promise<GraphQLSchema> {
    if (!schemaPromise) {
        /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
        schemaPromise = new Promise(async (resolve, reject) => {
            resetConfig();
            await setConfig(vendureConfig ?? {});

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
            resolve(safeSchema);
        });
    }
    return schemaPromise;
}
