import { Args, Mutation, Query, ResolveProperty, Resolver } from '@nestjs/graphql';

import { Permission, UpdateGlobalSettingsMutationArgs } from '../../../../shared/generated-types';
import { VendureConfig } from '../../config';
import { ConfigService } from '../../config/config.service';
import { GlobalSettingsService } from '../../service/services/global-settings.service';
import { Allow } from '../decorators/allow.decorator';

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
    @ResolveProperty()
    serverConfig(): Partial<VendureConfig> {
        return {
            customFields: this.configService.customFields,
        };
    }

    @Mutation()
    @Allow(Permission.UpdateSettings)
    async updateGlobalSettings(@Args() args: UpdateGlobalSettingsMutationArgs) {
        return this.globalSettingsService.updateSettings(args.input);
    }
}
