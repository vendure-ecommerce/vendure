import { Injectable } from '@nestjs/common';
import { UpdateGlobalSettingsInput } from '@vendure/common/lib/generated-types';

import { RequestContext } from '../../api/common/request-context';
import { InternalServerError } from '../../common/error/errors';
import { ConfigService } from '../../config/config.service';
import { GlobalSettings } from '../../entity/global-settings/global-settings.entity';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { patchEntity } from '../helpers/utils/patch-entity';
import { TransactionalConnection } from '../transaction/transactional-connection';

@Injectable()
export class GlobalSettingsService {
    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private customFieldRelationService: CustomFieldRelationService,
    ) {}

    /**
     * Ensure there is a single global settings row in the database.
     */
    async initGlobalSettings() {
        try {
            const result = await this.connection.getRepository(GlobalSettings).find();
            if (result.length === 0) {
                throw new Error('No global settings');
            }
            if (1 < result.length) {
                // Strange edge case, see https://github.com/vendure-ecommerce/vendure/issues/987
                const toDelete = result.slice(1);
                await this.connection.getRepository(GlobalSettings).remove(toDelete);
            }
        } catch (err) {
            const settings = new GlobalSettings({
                availableLanguages: [this.configService.defaultLanguageCode],
            });
            await this.connection.getRepository(GlobalSettings).save(settings, { reload: false });
        }
    }

    async getSettings(ctx: RequestContext): Promise<GlobalSettings> {
        const settings = await this.connection.getRepository(ctx, GlobalSettings).findOne({
            order: {
                createdAt: 'ASC',
            },
        });
        if (!settings) {
            throw new InternalServerError(`error.global-settings-not-found`);
        }
        return settings;
    }

    async updateSettings(ctx: RequestContext, input: UpdateGlobalSettingsInput): Promise<GlobalSettings> {
        const settings = await this.getSettings(ctx);
        patchEntity(settings, input);
        await this.customFieldRelationService.updateRelations(ctx, GlobalSettings, input, settings);
        return this.connection.getRepository(ctx, GlobalSettings).save(settings);
    }
}
