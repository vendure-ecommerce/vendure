import { Injectable } from '@nestjs/common';
import { UpdateGlobalSettingsInput } from '@vendure/common/lib/generated-types';

import { RequestContext } from '../../api/common/request-context';
import { InternalServerError } from '../../common/error/errors';
import { ConfigService } from '../../config/config.service';
import { GlobalSettings } from '../../entity/global-settings/global-settings.entity';
import { patchEntity } from '../helpers/utils/patch-entity';
import { TransactionalConnection } from '../transaction/transactional-connection';

@Injectable()
export class GlobalSettingsService {
    constructor(private connection: TransactionalConnection, private configService: ConfigService) {}

    /**
     * Ensure there is a global settings row in the database.
     */
    async initGlobalSettings() {
        try {
            await this.getSettings(RequestContext.empty());
        } catch (err) {
            const settings = new GlobalSettings({
                availableLanguages: [this.configService.defaultLanguageCode],
            });
            await this.connection.getRepository(GlobalSettings).save(settings, { reload: false });
        }
    }

    async getSettings(ctx: RequestContext): Promise<GlobalSettings> {
        const settings = await this.connection.getRepository(ctx, GlobalSettings).findOne();
        if (!settings) {
            throw new InternalServerError(`error.global-settings-not-found`);
        }
        return settings;
    }

    async updateSettings(ctx: RequestContext, input: UpdateGlobalSettingsInput): Promise<GlobalSettings> {
        const settings = await this.getSettings(ctx);
        patchEntity(settings, input);
        return this.connection.getRepository(ctx, GlobalSettings).save(settings);
    }
}
