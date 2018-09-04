import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLDateTime } from 'graphql-iso-date';

import { AdministratorResolver } from './api/administrator/administrator.resolver';
import { AuthController } from './api/auth/auth.controller';
import { ConfigResolver } from './api/config/config.resolver';
import { CustomerResolver } from './api/customer/customer.resolver';
import { FacetResolver } from './api/facet/facet.resolver';
import { ProductOptionResolver } from './api/product-option/product-option.resolver';
import { ProductResolver } from './api/product/product.resolver';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { PasswordService } from './auth/password.service';
import { GraphqlConfigService } from './config/graphql-config.service';
import { getConfig } from './config/vendure-config';
import { validateCustomFieldsConfig } from './entity/custom-entity-fields';
import { I18nService } from './i18n/i18n.service';
import { TranslationUpdaterService } from './locale/translation-updater.service';
import { AdministratorService } from './service/administrator.service';
import { ConfigService } from './service/config.service';
import { CustomerService } from './service/customer.service';
import { FacetValueService } from './service/facet-value.service';
import { FacetService } from './service/facet.service';
import { ProductOptionGroupService } from './service/product-option-group.service';
import { ProductOptionService } from './service/product-option.service';
import { ProductVariantService } from './service/product-variant.service';
import { ProductService } from './service/product.service';

@Module({
    providers: [ConfigService, I18nService],
    exports: [ConfigService, I18nService],
})
export class ConfigModule {}

@Module({
    imports: [
        ConfigModule,
        GraphQLModule.forRootAsync({
            useClass: GraphqlConfigService,
            imports: [ConfigModule],
        }),
        TypeOrmModule.forRoot(getConfig().dbConnectionOptions),
    ],
    controllers: [AuthController],
    providers: [
        AdministratorResolver,
        AdministratorService,
        AuthService,
        ConfigResolver,
        FacetResolver,
        FacetService,
        FacetValueService,
        JwtStrategy,
        PasswordService,
        CustomerService,
        CustomerResolver,
        ProductService,
        ProductOptionResolver,
        ProductOptionService,
        ProductOptionGroupService,
        ProductVariantService,
        ProductResolver,
        PasswordService,
        TranslationUpdaterService,
    ],
})
export class AppModule implements NestModule {
    constructor(private configService: ConfigService, private i18nService: I18nService) {}

    configure(consumer: MiddlewareConsumer) {
        validateCustomFieldsConfig(this.configService.customFields);

        consumer.apply(this.i18nService.handle()).forRoutes(this.configService.apiPath);
    }
}
