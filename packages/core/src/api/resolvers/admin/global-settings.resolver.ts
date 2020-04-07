import { Args, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MutationUpdateGlobalSettingsArgs, Permission } from '@vendure/common/lib/generated-types';

import { UserInputError } from '../../../common/error/errors';
import { ConfigService } from '../../../config/config.service';
import { CustomFields } from '../../../config/custom-field/custom-field-types';
import { ChannelService } from '../../../service/services/channel.service';
import { GlobalSettingsService } from '../../../service/services/global-settings.service';
import { Allow } from '../../decorators/allow.decorator';

@Resolver('GlobalSettings')
export class GlobalSettingsResolver {
    constructor(
        private configService: ConfigService,
        private globalSettingsService: GlobalSettingsService,
        private channelService: ChannelService,
    ) {}

    @Query()
    @Allow(Permission.Authenticated)
    async globalSettings() {
        return this.globalSettingsService.getSettings();
    }

    /**
     * Exposes a subset of the VendureConfig which may be of use to clients.
     */
    @ResolveField()
    serverConfig() {
        // Do not expose custom fields marked as "internal".
        const exposedCustomFieldConfig: CustomFields = {};
        for (const [entityType, customFields] of Object.entries(this.configService.customFields)) {
            exposedCustomFieldConfig[entityType as keyof CustomFields] = customFields.filter(
                (c) => !c.internal,
            );
        }
        return {
            customFieldConfig: exposedCustomFieldConfig,
        };
    }

    @Mutation()
    @Allow(Permission.UpdateSettings)
    async updateGlobalSettings(@Args() args: MutationUpdateGlobalSettingsArgs) {
        // This validation is performed here in the resolver rather than at the service
        // layer to avoid a circular dependency [ChannelService <> GlobalSettingsService]
        const { availableLanguages } = args.input;
        if (availableLanguages) {
            const channels = await this.channelService.findAll();
            const unavailableDefaults = channels.filter(
                (c) => !availableLanguages.includes(c.defaultLanguageCode),
            );
            if (unavailableDefaults.length) {
                throw new UserInputError('error.cannot-set-default-language-as-unavailable', {
                    language: unavailableDefaults.map((c) => c.defaultLanguageCode).join(', '),
                    channelCode: unavailableDefaults.map((c) => c.code).join(', '),
                });
            }
        }
        return this.globalSettingsService.updateSettings(args.input);
    }
}
