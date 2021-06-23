import { StockMovementType } from '@vendure/common/lib/generated-types';
import { IFieldResolver, IResolvers } from 'apollo-server-express';
import { GraphQLSchema } from 'graphql';
import { GraphQLDateTime, GraphQLJSON } from 'graphql-scalars';
import { GraphQLUpload } from 'graphql-upload';

import { REQUEST_CONTEXT_KEY } from '../../common/constants';
import {
    adminErrorOperationTypeResolvers,
    ErrorResult,
} from '../../common/error/generated-graphql-admin-errors';
import { shopErrorOperationTypeResolvers } from '../../common/error/generated-graphql-shop-errors';
import { Translatable } from '../../common/types/locale-types';
import { ConfigService } from '../../config/config.service';
import { CustomFieldConfig, RelationCustomFieldConfig } from '../../config/custom-field/custom-field-types';
import { CustomFieldRelationResolverService } from '../common/custom-field-relation-resolver.service';
import { ApiType } from '../common/get-api-type';
import { RequestContext } from '../common/request-context';

/**
 * @description
 * Generates additional resolvers required for things like resolution of union types,
 * custom scalars and "relation"-type custom fields.
 */
export function generateResolvers(
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

    const customFieldsConfigResolveType = {
        __resolveType(value: any) {
            switch (value.type) {
                case 'string':
                    return 'StringCustomFieldConfig';
                case 'localeString':
                    return 'LocaleStringCustomFieldConfig';
                case 'text':
                    return 'TextCustomFieldConfig';
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

    const commonResolvers = {
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
        CustomFieldConfig: customFieldsConfigResolveType,
        CustomField: customFieldsConfigResolveType,
        ErrorResult: {
            __resolveType(value: ErrorResult) {
                return value.__typename;
            },
        },
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
            ? { ...commonResolvers, ...adminResolvers }
            : { ...commonResolvers, ...shopResolvers };
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

    for (const [entityName, customFields] of Object.entries(configService.customFields)) {
        const relationCustomFields = customFields.filter(isRelationalType);
        if (relationCustomFields.length === 0 || !schema.getType(entityName)) {
            continue;
        }
        const customFieldTypeName = `${entityName}CustomFields`;

        // Some types are not exposed in the Shop API and therefore defining resolvers
        // for them would lead to an Apollo error on bootstrap.
        const excludeFromShopApi = ['GlobalSettings'].includes(entityName);

        // In order to resolve the relations in the CustomFields type, we need
        // access to the entity id. Therefore we attach it to the resolved value
        // so that it is available to the `relationResolver` below.
        const customFieldResolver: IFieldResolver<any, any> = (source: any) => {
            return {
                ...source.customFields,
                [ENTITY_ID_KEY]: source.id,
            };
        };
        adminResolvers[entityName] = {
            customFields: customFieldResolver,
        };
        if (!excludeFromShopApi) {
            shopResolvers[entityName] = {
                customFields: customFieldResolver,
            };
        }
        for (const fieldDef of relationCustomFields) {
            const relationResolver: IFieldResolver<any, any> = async (
                source: any,
                args: any,
                context: any,
            ) => {
                if (source[fieldDef.name] != null) {
                    return source[fieldDef.name];
                }
                const ctx: RequestContext = context.req[REQUEST_CONTEXT_KEY];
                const entityId = source[ENTITY_ID_KEY];
                return customFieldRelationResolverService.resolveRelation({
                    ctx,
                    fieldDef,
                    entityName,
                    entityId,
                });
            };

            adminResolvers[customFieldTypeName] = {
                ...adminResolvers[customFieldTypeName],
                [fieldDef.name]: relationResolver,
            } as any;

            if (fieldDef.public !== false && !excludeFromShopApi) {
                shopResolvers[customFieldTypeName] = {
                    ...shopResolvers[customFieldTypeName],
                    [fieldDef.name]: relationResolver,
                } as any;
            }
        }
    }
    return { adminResolvers, shopResolvers };
}

function isRelationalType(input: CustomFieldConfig): input is RelationCustomFieldConfig {
    return input.type === 'relation';
}

function isTranslatable(input: unknown): input is Translatable {
    return typeof input === 'object' && input != null && input.hasOwnProperty('translations');
}
