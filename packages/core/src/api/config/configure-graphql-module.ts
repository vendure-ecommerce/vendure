import { DynamicModule } from '@nestjs/common';
import { GqlModuleOptions, GraphQLModule, GraphQLTypesLoader } from '@nestjs/graphql';
import { StockMovementType } from '@vendure/common/lib/generated-types';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { GraphQLUpload } from 'apollo-server-core';
import { buildSchema, extendSchema, printSchema } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import GraphQLJSON from 'graphql-type-json';
import path from 'path';

import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { I18nModule } from '../../i18n/i18n.module';
import { I18nService } from '../../i18n/i18n.service';
import { getDynamicGraphQlModulesForPlugins } from '../../plugin/dynamic-plugin-api.module';
import { getPluginAPIExtensions } from '../../plugin/plugin-metadata';
import { ApiSharedModule } from '../api-internal-modules';
import { IdCodecService } from '../common/id-codec.service';
import { AssetInterceptorPlugin } from '../middleware/asset-interceptor-plugin';
import { IdCodecPlugin } from '../middleware/id-codec-plugin';
import { TranslateErrorsPlugin } from '../middleware/translate-errors-plugin';

import { generateAuthenticationTypes } from './generate-auth-types';
import { generateListOptions } from './generate-list-options';
import {
    addGraphQLCustomFields,
    addOrderLineCustomFieldsInput,
    addRegisterCustomerCustomFieldsInput,
    addServerConfigCustomFields,
} from './graphql-custom-fields';

export interface GraphQLApiOptions {
    apiType: 'shop' | 'admin';
    typePaths: string[];
    apiPath: string;
    debug: boolean;
    playground: boolean | any;
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
        include: [options.resolverModule, ...getDynamicGraphQlModulesForPlugins(options.apiType)],
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
        playground: options.playground || false,
        debug: options.debug || false,
        context: (req: any) => req,
        // This is handled by the Express cors plugin
        cors: false,
        plugins: [
            new IdCodecPlugin(idCodecService),
            new TranslateErrorsPlugin(i18nService),
            new AssetInterceptorPlugin(configService),
            ...configService.apiOptions.apolloServerPlugins,
        ],
    } as GqlModuleOptions;

    /**
     * Generates the server's GraphQL schema by combining:
     * 1. the default schema as defined in the source .graphql files specified by `typePaths`
     * 2. any custom fields defined in the config
     * 3. any schema extensions defined by plugins
     */
    async function createTypeDefs(apiType: 'shop' | 'admin'): Promise<string> {
        const customFields = configService.customFields;
        // Paths must be normalized to use forward-slash separators.
        // See https://github.com/nestjs/graphql/issues/336
        const normalizedPaths = options.typePaths.map(p => p.split(path.sep).join('/'));
        const typeDefs = await typesLoader.mergeTypesByPaths(normalizedPaths);
        const authStrategies =
            apiType === 'shop'
                ? configService.authOptions.shopAuthenticationStrategy
                : configService.authOptions.adminAuthenticationStrategy;
        let schema = buildSchema(typeDefs);

        getPluginAPIExtensions(configService.plugins, apiType)
            .map(e => (typeof e.schema === 'function' ? e.schema() : e.schema))
            .filter(notNullOrUndefined)
            .forEach(documentNode => (schema = extendSchema(schema, documentNode)));
        schema = generateListOptions(schema);
        schema = addGraphQLCustomFields(schema, customFields, apiType === 'shop');
        schema = addServerConfigCustomFields(schema, customFields);
        schema = addOrderLineCustomFieldsInput(schema, customFields.OrderLine || []);
        schema = generateAuthenticationTypes(schema, authStrategies);
        if (apiType === 'shop') {
            schema = addRegisterCustomerCustomFieldsInput(schema, customFields.Customer || []);
        }

        return printSchema(schema);
    }
}
