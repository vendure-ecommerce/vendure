import { Args, Info, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import {
    CustomFields as GraphQLCustomFields,
    CustomFieldConfig as GraphQLCustomFieldConfig,
    RelationCustomFieldConfig as GraphQLRelationCustomFieldConfig,
    EntityCustomFields,
    MutationUpdateGlobalSettingsArgs,
    Permission,
    ServerConfig,
    UpdateGlobalSettingsResult,
} from '@vendure/common/lib/generated-types';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import {
    GraphQLOutputType,
    GraphQLResolveInfo,
    isEnumType,
    isInterfaceType,
    isListType,
    isNonNullType,
    isObjectType,
    isScalarType,
} from 'graphql';

import { getAllPermissionsMetadata } from '../../../common/constants';
import { ErrorResultUnion } from '../../../common/error/error-result';
import { ChannelDefaultLanguageError } from '../../../common/error/generated-graphql-admin-errors';
import { ConfigService } from '../../../config/config.service';
import {
    CustomFieldConfig,
    CustomFields,
    RelationCustomFieldConfig,
} from '../../../config/custom-field/custom-field-types';
import { GlobalSettings } from '../../../entity/global-settings/global-settings.entity';
import { ChannelService } from '../../../service/services/channel.service';
import { GlobalSettingsService } from '../../../service/services/global-settings.service';
import { OrderService } from '../../../service/services/order.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';
import { Transaction } from '../../decorators/transaction.decorator';

@Resolver('GlobalSettings')
export class GlobalSettingsResolver {
    constructor(
        private configService: ConfigService,
        private globalSettingsService: GlobalSettingsService,
        private channelService: ChannelService,
        private orderService: OrderService,
    ) {}

    @Query()
    @Allow(Permission.Authenticated)
    async globalSettings(@Ctx() ctx: RequestContext) {
        return this.globalSettingsService.getSettings(ctx);
    }

    /**
     * Exposes a subset of the VendureConfig which may be of use to clients.
     */
    @ResolveField()
    serverConfig(@Info() info: GraphQLResolveInfo): ServerConfig {
        const permissions = getAllPermissionsMetadata(
            this.configService.authOptions.customPermissions,
        ).filter(p => !p.internal);
        return {
            customFieldConfig: this.generateCustomFieldConfig(info),
            entityCustomFields: this.generateEntityCustomFieldConfig(info),
            orderProcess: this.orderService.getOrderProcessStates(),
            permittedAssetTypes: this.configService.assetOptions.permittedFileTypes,
            permissions,
            moneyStrategyPrecision: this.configService.entityOptions.moneyStrategy.precision ?? 2,
        };
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateSettings, Permission.UpdateGlobalSettings)
    async updateGlobalSettings(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateGlobalSettingsArgs,
    ): Promise<ErrorResultUnion<UpdateGlobalSettingsResult, GlobalSettings>> {
        // This validation is performed here in the resolver rather than at the service
        // layer to avoid a circular dependency [ChannelService <> GlobalSettingsService]
        const { availableLanguages } = args.input;
        if (availableLanguages) {
            const channels = await this.channelService.findAll(ctx);
            const unavailableDefaults = channels.items.filter(
                c => !availableLanguages.includes(c.defaultLanguageCode),
            );
            if (unavailableDefaults.length) {
                return new ChannelDefaultLanguageError({
                    language: unavailableDefaults.map(c => c.defaultLanguageCode).join(', '),
                    channelCode: unavailableDefaults.map(c => c.code).join(', '),
                });
            }
        }
        return this.globalSettingsService.updateSettings(ctx, args.input);
    }

    // TODO: Remove in v3
    private generateCustomFieldConfig(info: GraphQLResolveInfo): GraphQLCustomFields {
        const exposedCustomFieldConfig: CustomFields = {};
        for (const [entityType, customFields] of Object.entries(this.configService.customFields)) {
            exposedCustomFieldConfig[entityType as keyof CustomFields] = customFields
                // Do not expose custom fields marked as "internal".
                ?.filter(c => !c.internal)
                .map(c => ({ ...c, list: !!c.list as any }))
                .map((c: any) => {
                    // In the VendureConfig, the relation entity is specified
                    // as the class, but the GraphQL API exposes it as a string.
                    if (c.type === 'relation') {
                        c.entity = c.entity.name;
                        c.scalarFields = this.getScalarFieldsOfType(info, c.graphQLType || c.entity);
                    }
                    return c;
                });
        }

        return exposedCustomFieldConfig as GraphQLCustomFields;
    }

    private generateEntityCustomFieldConfig(info: GraphQLResolveInfo): EntityCustomFields[] {
        return Object.entries(this.configService.customFields)
            .map(([entityType, customFields]) => {
                if (!customFields || !customFields.length) {
                    return;
                }
                const customFieldsConfig = customFields
                    // Do not expose custom fields marked as "internal".
                    .filter(c => !c.internal)
                    .map(c => ({ ...c, list: !!c.list as any }))
                    .map(c => {
                        const { requiresPermission } = c;
                        c.requiresPermission = Array.isArray(requiresPermission)
                            ? requiresPermission
                            : !!requiresPermission
                            ? [requiresPermission]
                            : [];
                        return c;
                    })
                    .map(c => {
                        // In the VendureConfig, the relation entity is specified
                        // as the class, but the GraphQL API exposes it as a string.
                        const customFieldConfig: GraphQLCustomFieldConfig = { ...c } as any;
                        if (this.isRelationGraphQLType(customFieldConfig) && this.isRelationConfigType(c)) {
                            customFieldConfig.entity = c.entity.name;
                            customFieldConfig.scalarFields = this.getScalarFieldsOfType(
                                info,
                                c.graphQLType || c.entity.name,
                            );
                        }
                        return customFieldConfig;
                    });
                return { entityName: entityType, customFields: customFieldsConfig };
            })
            .filter(notNullOrUndefined);
    }

    private isRelationGraphQLType(
        config: GraphQLCustomFieldConfig,
    ): config is GraphQLRelationCustomFieldConfig {
        return config.type === 'relation';
    }

    private isRelationConfigType(config: CustomFieldConfig): config is RelationCustomFieldConfig {
        return config.type === 'relation';
    }

    private getScalarFieldsOfType(info: GraphQLResolveInfo, typeName: string): string[] {
        const type = info.schema.getType(typeName);

        if (type && (isObjectType(type) || isInterfaceType(type))) {
            return Object.values(type.getFields())
                .filter(field => {
                    const namedType = this.getNamedType(field.type);
                    return isScalarType(namedType) || isEnumType(namedType);
                })
                .map(field => field.name);
        } else {
            return [];
        }
    }

    private getNamedType(type: GraphQLOutputType): GraphQLOutputType {
        if (isNonNullType(type) || isListType(type)) {
            return this.getNamedType(type.ofType);
        } else {
            return type;
        }
    }
}
