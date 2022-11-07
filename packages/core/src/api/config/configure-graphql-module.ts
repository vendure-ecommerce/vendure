import { DynamicModule } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { GqlModuleOptions, GraphQLModule, GraphQLTypesLoader } from '@nestjs/graphql';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { buildSchema, extendSchema, GraphQLSchema, printSchema, ValidationContext } from 'graphql';
import path from 'path';

import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { I18nModule } from '../../i18n/i18n.module';
import { I18nService } from '../../i18n/i18n.service';
import { getDynamicGraphQlModulesForPlugins } from '../../plugin/dynamic-plugin-api.module';
import { getPluginAPIExtensions } from '../../plugin/plugin-metadata';
import { CustomFieldRelationService } from '../../service/helpers/custom-field-relation/custom-field-relation.service';
import { ServiceModule } from '../../service/service.module';
import { ProductVariantService } from '../../service/services/product-variant.service';
import { ApiSharedModule } from '../api-internal-modules';
import { CustomFieldRelationResolverService } from '../common/custom-field-relation-resolver.service';
import { IdCodecService } from '../common/id-codec.service';
import { AssetInterceptorPlugin } from '../middleware/asset-interceptor-plugin';
import { IdCodecPlugin } from '../middleware/id-codec-plugin';
import { TranslateErrorsPlugin } from '../middleware/translate-errors-plugin';

import { generateActiveOrderTypes } from './generate-active-order-types';
import { generateAuthenticationTypes } from './generate-auth-types';
import { generateErrorCodeEnum } from './generate-error-code-enum';
import { generateListOptions } from './generate-list-options';
import { generatePermissionEnum } from './generate-permissions';
import { generateResolvers } from './generate-resolvers';
import {
    addActiveAdministratorCustomFields,
    addGraphQLCustomFields,
    addModifyOrderCustomFields,
    addOrderLineCustomFieldsInput,
    addPaymentMethodQuoteCustomFields,
    addRegisterCustomerCustomFieldsInput,
    addServerConfigCustomFields,
    addShippingMethodQuoteCustomFields,
} from './graphql-custom-fields';

export interface GraphQLApiOptions {
    apiType: 'shop' | 'admin';
    typePaths: string[];
    apiPath: string;
    debug: boolean;
    playground: boolean | any;
    // tslint:disable-next-line:ban-types
    resolverModule: Function;
    validationRules: Array<(context: ValidationContext) => any>;
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
            customFieldRelationResolverService: CustomFieldRelationResolverService,
        ) => {
            return createGraphQLOptions(
                i18nService,
                configService,
                idCodecService,
                typesLoader,
                customFieldRelationResolverService,
                getOptions(configService),
            );
        },
        inject: [
            ConfigService,
            I18nService,
            IdCodecService,
            GraphQLTypesLoader,
            CustomFieldRelationResolverService,
        ],
        imports: [ConfigModule, I18nModule, ApiSharedModule, ServiceModule],
    });
}

async function createGraphQLOptions(
    i18nService: I18nService,
    configService: ConfigService,
    idCodecService: IdCodecService,
    typesLoader: GraphQLTypesLoader,
    customFieldRelationResolverService: CustomFieldRelationResolverService,
    options: GraphQLApiOptions,
): Promise<GqlModuleOptions> {
    const builtSchema = await buildSchemaForApi(options.apiType);
    const resolvers = generateResolvers(
        configService,
        customFieldRelationResolverService,
        options.apiType,
        builtSchema,
    );
    return {
        path: '/' + options.apiPath,
        typeDefs: printSchema(builtSchema),
        include: [options.resolverModule, ...getDynamicGraphQlModulesForPlugins(options.apiType)],
        fieldResolverEnhancers: ['guards'],
        resolvers,
        // We no longer rely on the upload facility bundled with Apollo Server, and instead
        // manually configure the graphql-upload package. See https://github.com/vendure-ecommerce/vendure/issues/396
        uploads: false,
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
        validationRules: options.validationRules,
        introspection: configService.apiOptions.introspection ?? true,
    } as GqlModuleOptions;

    /**
     * Generates the server's GraphQL schema by combining:
     * 1. the default schema as defined in the source .graphql files specified by `typePaths`
     * 2. any custom fields defined in the config
     * 3. any schema extensions defined by plugins
     */
    async function buildSchemaForApi(apiType: 'shop' | 'admin'): Promise<GraphQLSchema> {
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
        schema = addOrderLineCustomFieldsInput(schema, customFields.OrderLine || []);
        schema = addModifyOrderCustomFields(schema, customFields.Order || []);
        schema = addShippingMethodQuoteCustomFields(schema, customFields.ShippingMethod || []);
        schema = addPaymentMethodQuoteCustomFields(schema, customFields.PaymentMethod || []);
        schema = generateAuthenticationTypes(schema, authStrategies);
        schema = generateErrorCodeEnum(schema);
        if (apiType === 'admin') {
            schema = addServerConfigCustomFields(schema, customFields);
            schema = addActiveAdministratorCustomFields(schema, customFields.Administrator);
        }
        if (apiType === 'shop') {
            schema = addRegisterCustomerCustomFieldsInput(schema, customFields.Customer || []);
            schema = generateActiveOrderTypes(schema, configService.orderOptions.activeOrderStrategy);
        }
        schema = generatePermissionEnum(schema, configService.authOptions.customPermissions);

        return schema;
    }
}
