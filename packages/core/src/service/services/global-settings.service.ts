import { Injectable } from '@nestjs/common';
import { UpdateGlobalSettingsInput } from '@vendure/common/lib/generated-types';

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
            await this.getSettings();
        } catch (err) {
            const settings = new GlobalSettings({
                availableLanguages: [this.configService.defaultLanguageCode],
            });
            await this.connection.getRepository(GlobalSettings).save(settings, { reload: false });
        }
    }

    async getSettings(): Promise<GlobalSettings> {
        const settings = await this.connection.getRepository(GlobalSettings).findOne();
        if (!settings) {
            throw new InternalServerError(`error.global-settings-not-found`);
        }
        return settings;
    }

    async updateSettings(input: UpdateGlobalSettingsInput): Promise<GlobalSettings> {
        const settings = await this.getSettings();
        patchEntity(settings, input);
        return this.connection.getRepository(GlobalSettings).save(settings);
    }
}
