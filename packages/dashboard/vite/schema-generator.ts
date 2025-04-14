import { GraphQLTypesLoader } from '@nestjs/graphql';
import {
    resetConfig,
    setConfig,
    getConfig,
    runPluginConfigurations,
    getFinalVendureSchema,
    VENDURE_ADMIN_API_TYPE_PATHS,
    VendureConfig,
    PartialVendureConfig,
} from '@vendure/core';
import { buildSchema } from 'graphql';
import { GraphQLSchema } from 'graphql';

let schemaPromise: Promise<GraphQLSchema>;

export async function generateSchema({
    vendureConfig,
}: {
    vendureConfig: VendureConfig;
}): Promise<GraphQLSchema> {
    if (!schemaPromise) {
        schemaPromise = new Promise(async (resolve, reject) => {
            resetConfig();
            await setConfig((vendureConfig as PartialVendureConfig) ?? {});

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
