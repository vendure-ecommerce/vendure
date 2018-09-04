import { Module } from '@nestjs/common';

import { I18nService } from '../i18n/i18n.service';

import { ConfigService } from './config.service';

@Module({
    providers: [ConfigService],
    exports: [ConfigService],
})
export class ConfigModule {}
