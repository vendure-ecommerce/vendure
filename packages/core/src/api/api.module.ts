import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import path from 'path';

import { ConfigService } from '../config/config.service';
import { ConnectionModule } from '../connection/connection.module';
import { DataImportModule } from '../data-import/data-import.module';
import { I18nModule } from '../i18n/i18n.module';
import { ServiceModule } from '../service/service.module';

import { AdminApiModule, ApiSharedModule, ShopApiModule } from './api-internal-modules';
import { configureGraphQLModule } from './config/configure-graphql-module';
import { AuthGuard } from './middleware/auth-guard';
import { ExceptionLoggerFilter } from './middleware/exception-logger.filter';
import { IdInterceptor } from './middleware/id-interceptor';
import { TranslateErrorResultInterceptor } from './middleware/translate-error-result-interceptor';
import { ValidateCustomFieldsInterceptor } from './middleware/validate-custom-fields-interceptor';

/**
 * The ApiModule is responsible for the public API of the application. This is where requests
 * come in, are parsed and then handed over to the ServiceModule classes which take care
 * of the business logic.
 */
@Module({
    imports: [
        ServiceModule,
        ConnectionModule.forRoot(),
        DataImportModule,
        I18nModule,
        ApiSharedModule,
        AdminApiModule,
        ShopApiModule,
        configureGraphQLModule(configService => ({
            apiType: 'shop',
            apiPath: configService.apiOptions.shopApiPath,
            playground: configService.apiOptions.shopApiPlayground,
            debug: configService.apiOptions.shopApiDebug,
            typePaths: ['shop-api', 'common'].map(p => path.join(__dirname, 'schema', p, '*.graphql')),
            resolverModule: ShopApiModule,
            validationRules: configService.apiOptions.shopApiValidationRules,
        })),
        configureGraphQLModule(configService => ({
            apiType: 'admin',
            apiPath: configService.apiOptions.adminApiPath,
            playground: configService.apiOptions.adminApiPlayground,
            debug: configService.apiOptions.adminApiDebug,
            typePaths: ['admin-api', 'common'].map(p => path.join(__dirname, 'schema', p, '*.graphql')),
            resolverModule: AdminApiModule,
            validationRules: configService.apiOptions.adminApiValidationRules,
        })),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: IdInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ValidateCustomFieldsInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TranslateErrorResultInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: ExceptionLoggerFilter,
        },
    ],
})
export class ApiModule implements NestModule {
    constructor(private configService: ConfigService) {}
    async configure(consumer: MiddlewareConsumer) {
        const { adminApiPath, shopApiPath } = this.configService.apiOptions;
        const { uploadMaxFileSize } = this.configService.assetOptions;
        // @ts-ignore
        const { default: graphqlUploadExpress } = await import('graphql-upload/graphqlUploadExpress.mjs');
        consumer
            .apply(graphqlUploadExpress({ maxFileSize: uploadMaxFileSize }))
            .forRoutes(adminApiPath, shopApiPath);
    }
}
