import { DynamicModule } from '@nestjs/common';
import { GqlModuleOptions, GraphQLModule, GraphQLTypesLoader } from '@nestjs/graphql';
import { GraphQLUpload } from 'apollo-server-core';
import { extendSchema, printSchema } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import GraphQLJSON from 'graphql-type-json';

import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { I18nModule } from '../../i18n/i18n.module';
import { I18nService } from '../../i18n/i18n.service';
import { getPluginAPIExtensions } from '../../plugin/plugin-utils';
import { ApiSharedModule } from '../api-internal-modules';
import { IdCodecService } from '../common/id-codec.service';
import { IdEncoderExtension } from '../middleware/id-encoder-extension';
import { TranslateErrorExtension } from '../middleware/translate-errors-extension';

import { generateListOptions } from './generate-list-options';
import { addGraphQLCustomFields } from './graphql-custom-fields';

export interface GraphQLApiOptions {
    apiType: 'shop' | 'admin';
    typePaths: string[];
    apiPath: string;
    // tslint:disable-next-line:ban-types
    resolverModule: Function;
}

/**
 * Dynamically generates a GraphQLModule according to the given config options.
 */
export function configureGraphQLModule(
    getOptions: (configService: ConfigService) => GraphQLApiOptions,
): DynamicModule {
    return GraphQLModule.forRootAsync({
        useFactory: (
            configService: ConfigService,
            i18nService: I18nService,
            idCodecService: IdCodecService,
            typesLoader: GraphQLTypesLoader,
        ) => {
            return createGraphQLOptions(
                i18nService,
                configService,
                idCodecService,
                typesLoader,
                getOptions(configService),
            );
        },
        inject: [ConfigService, I18nService, IdCodecService, GraphQLTypesLoader],
        imports: [ConfigModule, I18nModule, ApiSharedModule],
    });
}

function createGraphQLOptions(
    i18nService: I18nService,
    configService: ConfigService,
    idCodecService: IdCodecService,
    typesLoader: GraphQLTypesLoader,
    options: GraphQLApiOptions,
): GqlModuleOptions {
    // Prevent `Type "Node" is missing a "resolveType" resolver.` warnings.
    // See https://github.com/apollographql/apollo-server/issues/1075
    const dummyResolveType = {
        __resolveType() {
            return null;
        },
    };

    return {
        path: '/' + options.apiPath,
        typeDefs: createTypeDefs(options.apiType),
        include: [options.resolverModule],
        resolvers: {
            JSON: GraphQLJSON,
            DateTime: GraphQLDateTime,
            Node: dummyResolveType,
            PaginatedList: dummyResolveType,
            Upload: GraphQLUpload || dummyResolveType,
            SearchResultPrice: {
                __resolveType(value: any) {
                    return value.hasOwnProperty('value') ? 'SinglePrice' : 'PriceRange';
                },
            },
        },
        uploads: {
            maxFileSize: configService.assetOptions.uploadMaxFileSize,
        },
        playground: true,
        debug: true,
        context: (req: any) => req,
        extensions: [
            () => new TranslateErrorExtension(i18nService),
            () => new IdEncoderExtension(idCodecService),
        ],
        // This is handled by the Express cors plugin
        cors: false,
    };

    /**
     * Generates the server's GraphQL schema by combining:
     * 1. the default schema as defined in the source .graphql files specified by `typePaths`
     * 2. any custom fields defined in the config
     * 3. any schema extensions defined by plugins
     */
    function createTypeDefs(apiType: 'shop' | 'admin'): string {
        const customFields = configService.customFields;
        const typeDefs = typesLoader.mergeTypesByPaths(...options.typePaths);
        let schema = generateListOptions(typeDefs);
        schema = addGraphQLCustomFields(schema, customFields);
        const pluginSchemaExtensions = getPluginAPIExtensions(configService.plugins, apiType).map(
            e => e.schema,
        );

        for (const documentNode of pluginSchemaExtensions) {
            schema = extendSchema(schema, documentNode);
        }
        return printSchema(schema);
    }
}
