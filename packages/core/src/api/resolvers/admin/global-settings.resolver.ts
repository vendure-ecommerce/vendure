import { Args, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MutationUpdateGlobalSettingsArgs, Permission } from '@vendure/common/lib/generated-types';

import { VendureConfig } from '../../../config';
import { ConfigService } from '../../../config/config.service';
import { CustomFields } from '../../../config/custom-field/custom-field-types';
import { GlobalSettingsService } from '../../../service/services/global-settings.service';
import { Allow } from '../../decorators/allow.decorator';

@Resolver('GlobalSettings')
export class GlobalSettingsResolver {
    constructor(private configService: ConfigService, private globalSettingsService: GlobalSettingsService) {}

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
                c => !c.internal,
            );
        }
        return {
            customFieldConfig: exposedCustomFieldConfig,
        };
    }

    @Mutation()
    @Allow(Permission.UpdateSettings)
    async updateGlobalSettings(@Args() args: MutationUpdateGlobalSettingsArgs) {
        return this.globalSettingsService.updateSettings(args.input);
    }
}
