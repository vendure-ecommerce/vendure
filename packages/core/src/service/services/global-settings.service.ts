import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { UpdateGlobalSettingsInput } from '@vendure/common/lib/generated-types';
import { Connection } from 'typeorm';

import { InternalServerError } from '../../common/error/errors';
import { ConfigService } from '../../config/config.service';
import { GlobalSettings } from '../../entity/global-settings/global-settings.entity';
import { patchEntity } from '../helpers/utils/patch-entity';

@Injectable()
export class GlobalSettingsService {
    constructor(@InjectConnection() private connection: Connection, private configService: ConfigService) {}

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
