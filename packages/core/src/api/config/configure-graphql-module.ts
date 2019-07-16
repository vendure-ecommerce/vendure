import { DynamicModule } from '@nestjs/common';
import { GqlModuleOptions, GraphQLModule, GraphQLTypesLoader } from '@nestjs/graphql';
import { StockMovementType } from '@vendure/common/lib/generated-types';
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
import { addGraphQLCustomFields, addOrderLineCustomFieldsInput, addServerConfigCustomFields } from './graphql-custom-fields';

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

async function createGraphQLOptions(
    i18nService: I18nService,
    configService: ConfigService,
    idCodecService: IdCodecService,
    typesLoader: GraphQLTypesLoader,
    options: GraphQLApiOptions,
): Promise<GqlModuleOptions> {
    // Prevent `Type "Node" is missing a "resolveType" resolver.` warnings.
    // See https://github.com/apollographql/apollo-server/issues/1075
    const dummyResolveType = {
        __resolveType() {
            return null;
        },
    };

    const stockMovementResolveType = {
        __resolveType(value: any) {
            switch (value.type) {
                case StockMovementType.ADJUSTMENT:
                    return 'StockAdjustment';
                case StockMovementType.SALE:
                    return 'Sale';
                case StockMovementType.CANCELLATION:
                    return 'Cancellation';
                case StockMovementType.RETURN:
                    return 'Return';
            }
        },
    };

    const customFieldsConfigResolveType = {
        __resolveType(value: any) {
            switch (value.type) {
                case 'string':
                    return 'StringCustomFieldConfig';
                case 'localeString':
                    return 'LocaleStringCustomFieldConfig';
                case 'int':
                    return 'IntCustomFieldConfig';
                case 'float':
                    return 'FloatCustomFieldConfig';
                case 'boolean':
                    return 'BooleanCustomFieldConfig';
                case 'datetime':
                    return 'DateTimeCustomFieldConfig';
            }
        },
    };

    return {
        path: '/' + options.apiPath,
        typeDefs: await createTypeDefs(options.apiType),
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
            StockMovementItem: stockMovementResolveType,
            StockMovement: stockMovementResolveType,
            CustomFieldConfig: customFieldsConfigResolveType,
            CustomField: customFieldsConfigResolveType,
        },
        uploads: {
            maxFileSize: configService.assetOptions.uploadMaxFileSize,
        },
        playground: {
            settings: {
                'request.credentials': 'include',
            } as any,
        },
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
    async function createTypeDefs(apiType: 'shop' | 'admin'): Promise<string> {
        const customFields = configService.customFields;
        const typeDefs = await typesLoader.mergeTypesByPaths(options.typePaths);
        let schema = generateListOptions(typeDefs);
        schema = addGraphQLCustomFields(schema, customFields);
        schema = addServerConfigCustomFields(schema, customFields);
        schema = addOrderLineCustomFieldsInput(schema, customFields.OrderLine || []);
        const pluginSchemaExtensions = getPluginAPIExtensions(configService.plugins, apiType).map(
            e => e.schema,
        );

        for (const documentNode of pluginSchemaExtensions) {
            schema = extendSchema(schema, documentNode);
        }
        return printSchema(schema);
    }
}
