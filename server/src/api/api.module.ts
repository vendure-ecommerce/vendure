import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';

import { ConfigModule } from '../config/config.module';
import { I18nModule } from '../i18n/i18n.module';
import { ServiceModule } from '../service/service.module';

import { AdministratorResolver } from './administrator/administrator.resolver';
import { AssetResolver } from './asset/asset.resolver';
import { AuthGuard } from './auth-guard';
import { AuthResolver } from './auth/auth.resolver';
import { ChannelResolver } from './channel/channel.resolver';
import { RequestContextService } from './common/request-context.service';
import { ConfigResolver } from './config/config.resolver';
import { CustomerResolver } from './customer/customer.resolver';
import { FacetResolver } from './facet/facet.resolver';
import { GraphqlConfigService } from './graphql-config.service';
import { JwtStrategy } from './jwt.strategy';
import { ProductOptionResolver } from './product-option/product-option.resolver';
import { ProductResolver } from './product/product.resolver';
import { RoleResolver } from './role/role.resolver';
import { RolesGuard } from './roles-guard';

const exportedProviders = [
    AdministratorResolver,
    AuthResolver,
    AssetResolver,
    ChannelResolver,
    ConfigResolver,
    FacetResolver,
    CustomerResolver,
    ProductOptionResolver,
    ProductResolver,
    RoleResolver,
];

/**
 * The ApiModule is responsible for the public API of the application. This is where requests
 * come in, are parsed and then handed over to the ServiceModule classes which take care
 * of the business logic.
 */
@Module({
    imports: [
        ServiceModule,
        GraphQLModule.forRootAsync({
            useClass: GraphqlConfigService,
            imports: [ConfigModule, I18nModule],
        }),
    ],
    providers: [
        ...exportedProviders,
        JwtStrategy,
        RequestContextService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
    exports: exportedProviders,
})
export class ApiModule {}
