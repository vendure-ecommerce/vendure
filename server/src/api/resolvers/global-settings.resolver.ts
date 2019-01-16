import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Permission, UpdateGlobalSettingsMutationArgs } from '../../../../shared/generated-types';
import { GlobalSettingsService } from '../../service/services/global-settings.service';
import { Allow } from '../decorators/allow.decorator';

@Resolver('GlobalSettings')
export class GlobalSettingsResolver {
    constructor(private globalSettingsService: GlobalSettingsService) {}

    @Query()
    @Allow(Permission.Authenticated)
    async globalSettings() {
        return this.globalSettingsService.getSettings();
    }

    @Mutation()
    @Allow(Permission.UpdateSettings)
    async updateGlobalSettings(@Args() args: UpdateGlobalSettingsMutationArgs) {
        return this.globalSettingsService.updateSettings(args.input);
    }
}
