import { Args, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import {
    CustomFields as GraphQLCustomFields,
    MutationUpdateGlobalSettingsArgs,
    OrderProcessState,
    Permission,
    ServerConfig,
    UpdateGlobalSettingsResult,
} from '@vendure/common/lib/generated-types';

import { ErrorResultUnion } from '../../../common/error/error-result';
import { UserInputError } from '../../../common/error/errors';
import { ChannelDefaultLanguageError } from '../../../common/error/generated-graphql-admin-errors';
import { getAllPermissionsMetadata } from '../../../common/permission-definition';
import { ConfigService } from '../../../config/config.service';
import { CustomFields } from '../../../config/custom-field/custom-field-types';
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
    serverConfig(a: ServerConfig): ServerConfig {
        // Do not expose custom fields marked as "internal".
        const exposedCustomFieldConfig: CustomFields = {};
        for (const [entityType, customFields] of Object.entries(this.configService.customFields)) {
            exposedCustomFieldConfig[entityType as keyof CustomFields] = customFields
                .filter(c => !c.internal)
                .map(c => ({ ...c, list: !!c.list as any }));
        }
        const permissions = getAllPermissionsMetadata(
            this.configService.authOptions.customPermissions,
        ).filter(p => !p.internal);
        return {
            customFieldConfig: exposedCustomFieldConfig as GraphQLCustomFields,
            orderProcess: this.orderService.getOrderProcessStates(),
            permittedAssetTypes: this.configService.assetOptions.permittedFileTypes,
            permissions,
        };
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateSettings)
    async updateGlobalSettings(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateGlobalSettingsArgs,
    ): Promise<ErrorResultUnion<UpdateGlobalSettingsResult, GlobalSettings>> {
        // This validation is performed here in the resolver rather than at the service
        // layer to avoid a circular dependency [ChannelService <> GlobalSettingsService]
        const { availableLanguages } = args.input;
        if (availableLanguages) {
            const channels = await this.channelService.findAll(ctx);
            const unavailableDefaults = channels.filter(
                c => !availableLanguages.includes(c.defaultLanguageCode),
            );
            if (unavailableDefaults.length) {
                return new ChannelDefaultLanguageError(
                    unavailableDefaults.map(c => c.defaultLanguageCode).join(', '),
                    unavailableDefaults.map(c => c.code).join(', '),
                );
            }
        }
        return this.globalSettingsService.updateSettings(ctx, args.input);
    }
}
