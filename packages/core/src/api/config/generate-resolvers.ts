import { IFieldResolver, IResolvers } from '@graphql-tools/utils';
import { StockMovementType } from '@vendure/common/lib/generated-types';
import { GraphQLSchema } from 'graphql';
import { GraphQLDateTime, GraphQLJSON } from 'graphql-scalars';

import { REQUEST_CONTEXT_KEY } from '../../common/constants';
import { InternalServerError } from '../../common/error/errors';
import {
    adminErrorOperationTypeResolvers,
    ErrorResult,
} from '../../common/error/generated-graphql-admin-errors';
import { shopErrorOperationTypeResolvers } from '../../common/error/generated-graphql-shop-errors';
import { Translatable } from '../../common/types/locale-types';
import { ConfigService } from '../../config/config.service';
import { CustomFieldConfig, RelationCustomFieldConfig } from '../../config/custom-field/custom-field-types';
import { Logger } from '../../config/logger/vendure-logger';
import { Region } from '../../entity/region/region.entity';
import { getPluginAPIExtensions } from '../../plugin/plugin-metadata';
import { CustomFieldRelationResolverService } from '../common/custom-field-relation-resolver.service';
import { ApiType } from '../common/get-api-type';
import { RequestContext } from '../common/request-context';
import { userHasPermissionsOnCustomField } from '../common/user-has-permissions-on-custom-field';

import { getCustomFieldsConfigWithoutInterfaces } from './get-custom-fields-config-without-interfaces';
import { GraphQLMoney } from './money-scalar';

/**
 * @description
 * Generates additional resolvers required for things like resolution of union types,
 * custom scalars and "relation"-type custom fields.
 */
export async function generateResolvers(
    configService: ConfigService,
    customFieldRelationResolverService: CustomFieldRelationResolverService,
    apiType: ApiType,
    schema: GraphQLSchema,
) {
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
                case StockMovementType.ALLOCATION:
                    return 'Allocation';
                case StockMovementType.SALE:
                    return 'Sale';
                case StockMovementType.CANCELLATION:
                    return 'Cancellation';
                case StockMovementType.RETURN:
                    return 'Return';
                case StockMovementType.RELEASE:
                    return 'Release';
            }
        },
    };

    const regionResolveType = {
        __resolveType(value: Region) {
            switch (value.type) {
                case 'country':
                    return 'Country';
                case 'province':
                    return 'Province';
                default: {
                    throw new InternalServerError(`No __resolveType defined for Region type "${value.type}"`);
                }
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
                case 'text':
                    return 'TextCustomFieldConfig';
                case 'localeText':
                    return 'LocaleTextCustomFieldConfig';
                case 'int':
                    return 'IntCustomFieldConfig';
                case 'float':
                    return 'FloatCustomFieldConfig';
                case 'boolean':
                    return 'BooleanCustomFieldConfig';
                case 'datetime':
                    return 'DateTimeCustomFieldConfig';
                case 'relation':
                    return 'RelationCustomFieldConfig';
            }
        },
    };

    // @ts-ignore
    const { default: GraphQLUpload } = await import('graphql-upload/GraphQLUpload.mjs');

    const commonResolvers = {
        JSON: GraphQLJSON,
        DateTime: GraphQLDateTime,
        Money: GraphQLMoney,
        Node: dummyResolveType,
        PaginatedList: dummyResolveType,
        Upload: GraphQLUpload || dummyResolveType,
        SearchResultPrice: {
            __resolveType(value: any) {
                return value.hasOwnProperty('value') ? 'SinglePrice' : 'PriceRange';
            },
        },
        CustomFieldConfig: customFieldsConfigResolveType,
        CustomField: customFieldsConfigResolveType,
        ErrorResult: {
            __resolveType(value: ErrorResult) {
                return value.__typename;
            },
        },
        Region: regionResolveType,
    };

    const customFieldRelationResolvers = generateCustomFieldRelationResolvers(
        configService,
        customFieldRelationResolverService,
        schema,
    );

    const adminResolvers = {
        StockMovementItem: stockMovementResolveType,
        StockMovement: stockMovementResolveType,
        ...adminErrorOperationTypeResolvers,
        ...customFieldRelationResolvers.adminResolvers,
    };

    const shopResolvers = {
        ...shopErrorOperationTypeResolvers,
        ...customFieldRelationResolvers.shopResolvers,
    };

    const resolvers =
        apiType === 'admin'
            ? { ...commonResolvers, ...adminResolvers, ...getCustomScalars(configService, 'admin') }
            : { ...commonResolvers, ...shopResolvers, ...getCustomScalars(configService, 'shop') };
    return resolvers;
}

/**
 * @description
 * Based on the CustomFields config, this function dynamically creates resolver functions to perform
 * a DB query to fetch the related entity for any custom fields of type "relation".
 */
function generateCustomFieldRelationResolvers(
    configService: ConfigService,
    customFieldRelationResolverService: CustomFieldRelationResolverService,
    schema: GraphQLSchema,
) {
    const ENTITY_ID_KEY = '__entityId__';
    const adminResolvers: IResolvers = {};
    const shopResolvers: IResolvers = {};

    const customFieldsConfig = getCustomFieldsConfigWithoutInterfaces(configService.customFields, schema);
    for (const [entityName, customFields] of customFieldsConfig) {
        if (!schema.getType(entityName)) {
            continue;
        }
        const customFieldTypeName = `${entityName}CustomFields`;

        // Some types are not exposed in the Shop API and therefore defining resolvers
        // for them would lead to an Apollo error on bootstrap.
        const excludeFromShopApi = ['GlobalSettings'].includes(entityName);

        // In order to resolve the relations in the CustomFields type, we need
        // access to the entity id. Therefore, we attach it to the resolved value
        // so that it is available to the `relationResolver` below.
        const customFieldResolver: IFieldResolver<any, any> = (source: any) => {
            return {
                ...source.customFields,
                [ENTITY_ID_KEY]: source.id,
            };
        };
        const resolverObject = {
            customFields: customFieldResolver,
        };
        adminResolvers[entityName] = resolverObject;
        if (!excludeFromShopApi) {
            shopResolvers[entityName] = resolverObject;
            if (entityName === 'ShippingMethod') {
                shopResolvers.ShippingMethodQuote = resolverObject;
            }
            if (entityName === 'PaymentMethod') {
                shopResolvers.PaymentMethodQuote = resolverObject;
            }
        }
        for (const fieldDef of customFields) {
            if (fieldDef.internal === true) {
                // Do not create any resolvers for internal relations
                continue;
            }
            let resolver: IFieldResolver<any, any>;
            if (isRelationalType(fieldDef)) {
                resolver = async (source: any, args: any, context: any) => {
                    const ctx: RequestContext = context.req[REQUEST_CONTEXT_KEY];
                    if (!userHasPermissionsOnCustomField(ctx, fieldDef)) {
                        return null;
                    }
                    const eagerEntity = source[fieldDef.name];
                    // If the relation is eager-loaded, we can simply try to translate this relation entity if they have translations
                    if (eagerEntity != null) {
                        try {
                            return await customFieldRelationResolverService.translateEntity(
                                ctx,
                                eagerEntity,
                                fieldDef,
                            );
                        } catch (e: any) {
                            Logger.debug(
                                `Error resolving eager-loaded custom field entity relation "${entityName}.${fieldDef.name}": ${e.message as string}`,
                            );
                        }
                    }
                    const entityId = source[ENTITY_ID_KEY];
                    return customFieldRelationResolverService.resolveRelation({
                        ctx,
                        fieldDef,
                        entityName,
                        entityId,
                    });
                };
            } else {
                resolver = async (source: any, args: any, context: any) => {
                    const ctx: RequestContext = context.req[REQUEST_CONTEXT_KEY];
                    if (!userHasPermissionsOnCustomField(ctx, fieldDef)) {
                        return null;
                    }
                    return source[fieldDef.name];
                };
            }

            adminResolvers[customFieldTypeName] = {
                ...adminResolvers[customFieldTypeName],
                [fieldDef.name]: resolver,
            } as any;

            if (fieldDef.public !== false && !excludeFromShopApi) {
                shopResolvers[customFieldTypeName] = {
                    ...shopResolvers[customFieldTypeName],
                    [fieldDef.name]: resolver,
                } as any;
            }
        }
        const allCustomFieldsAreNonPublic =
            customFields.length && customFields.every(f => f.public === false || f.internal === true);
        if (allCustomFieldsAreNonPublic) {
            // When an entity has only non-public custom fields, the GraphQL type used for the
            // customFields field is `JSON`. This type will simply return the full object, which
            // will cause a leak of private data unless we force a `null` return value in the case
            // that there are no public fields.
            // See https://github.com/vendure-ecommerce/vendure/issues/3049
            shopResolvers[entityName] = { customFields: () => null };
        }
    }
    return { adminResolvers, shopResolvers };
}

function getCustomScalars(configService: ConfigService, apiType: 'admin' | 'shop') {
    return getPluginAPIExtensions(configService.plugins, apiType)
        .map(e => (typeof e.scalars === 'function' ? e.scalars() : e.scalars ?? {}))
        .reduce(
            (all, scalarMap) => ({
                ...all,
                ...scalarMap,
            }),
            {},
        );
}

function isRelationalType(input: CustomFieldConfig): input is RelationCustomFieldConfig {
    return input.type === 'relation';
}

function isTranslatable(input: unknown): input is Translatable {
    return typeof input === 'object' && input != null && input.hasOwnProperty('translations');
}
