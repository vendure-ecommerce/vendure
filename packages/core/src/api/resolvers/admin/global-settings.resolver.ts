import { Args, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import {
    MutationUpdateGlobalSettingsArgs,
    OrderProcessState,
    Permission,
} from '@vendure/common/lib/generated-types';

import { UserInputError } from '../../../common/error/errors';
import { ConfigService } from '../../../config/config.service';
import { CustomFields } from '../../../config/custom-field/custom-field-types';
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
    serverConfig(): {
        customFieldConfig: CustomFields;
        orderProcess: OrderProcessState[];
        permittedAssetTypes: string[];
    } {
        // Do not expose custom fields marked as "internal".
        const exposedCustomFieldConfig: CustomFields = {};
        for (const [entityType, customFields] of Object.entries(this.configService.customFields)) {
            exposedCustomFieldConfig[entityType as keyof CustomFields] = customFields
                .filter(c => !c.internal)
                .map(c => ({ ...c, list: !!c.list as any }));
        }
        return {
            customFieldConfig: exposedCustomFieldConfig,
            orderProcess: this.orderService.getOrderProcessStates(),
            permittedAssetTypes: this.configService.assetOptions.permittedFileTypes,
        };
    }

    @Transaction
    @Mutation()
    @Allow(Permission.UpdateSettings)
    async updateGlobalSettings(@Ctx() ctx: RequestContext, @Args() args: MutationUpdateGlobalSettingsArgs) {
        // This validation is performed here in the resolver rather than at the service
        // layer to avoid a circular dependency [ChannelService <> GlobalSettingsService]
        const { availableLanguages } = args.input;
        if (availableLanguages) {
            const channels = await this.channelService.findAll(ctx);
            const unavailableDefaults = channels.filter(
                c => !availableLanguages.includes(c.defaultLanguageCode),
            );
            if (unavailableDefaults.length) {
                throw new UserInputError('error.cannot-set-default-language-as-unavailable', {
                    language: unavailableDefaults.map(c => c.defaultLanguageCode).join(', '),
                    channelCode: unavailableDefaults.map(c => c.code).join(', '),
                });
            }
        }
        return this.globalSettingsService.updateSettings(ctx, args.input);
    }
}
