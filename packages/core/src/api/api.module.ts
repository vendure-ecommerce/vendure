import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import path from 'path';

import { DataImportModule } from '../data-import/data-import.module';
import { ServiceModule } from '../service/service.module';

import { AdminApiModule, ApiSharedModule, entityResolvers, ShopApiModule } from './api-internal-modules';
import { IdCodecService } from './common/id-codec.service';
import { RequestContextService } from './common/request-context.service';
import { configureGraphQLModule } from './config/configure-graphql-module';
import { AssetInterceptor } from './middleware/asset-interceptor';
import { AuthGuard } from './middleware/auth-guard';
import { IdInterceptor } from './middleware/id-interceptor';

/**
 * The ApiModule is responsible for the public API of the application. This is where requests
 * come in, are parsed and then handed over to the ServiceModule classes which take care
 * of the business logic.
 */
@Module({
    imports: [
        ServiceModule,
        DataImportModule,
        ApiSharedModule,
        AdminApiModule,
        ShopApiModule,
        configureGraphQLModule(configService => ({
            apiType: 'shop',
            apiPath: configService.shopApiPath,
            typePaths: ['type', 'shop-api', 'common'].map(p =>
                path.join(__dirname, 'schema', p, '*.graphql'),
            ),
            resolverModule: ShopApiModule,
        })),
        configureGraphQLModule(configService => ({
            apiType: 'admin',
            apiPath: configService.adminApiPath,
            typePaths: ['type', 'admin-api', 'common'].map(p =>
                path.join(__dirname, 'schema', p, '*.graphql'),
            ),
            resolverModule: AdminApiModule,
        })),
    ],
    providers: [
        RequestContextService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: AssetInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: IdInterceptor,
        },
    ],
})
export class ApiModule {}
