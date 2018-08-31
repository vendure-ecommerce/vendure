import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLDateTime } from 'graphql-iso-date';

import { ApiModule } from './api/api.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { validateCustomFieldsConfig } from './entity/custom-entity-fields';
import { I18nModule } from './i18n/i18n.module';
import { I18nService } from './i18n/i18n.service';

@Module({
    imports: [ConfigModule, I18nModule, ApiModule],
})
export class AppModule implements NestModule {
    constructor(private configService: ConfigService, private i18nService: I18nService) {}

    configure(consumer: MiddlewareConsumer) {
        validateCustomFieldsConfig(this.configService.customFields);
        consumer.apply(this.i18nService.handle()).forRoutes(this.configService.apiPath);
    }
}
