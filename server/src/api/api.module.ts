import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { QueryResolvers } from 'shared/generated-types';

import { ConfigModule } from '../config/config.module';
import { I18nModule } from '../i18n/i18n.module';
import { ServiceModule } from '../service/service.module';

import { AssetInterceptor } from './common/asset-interceptor';
import { AuthGuard } from './common/auth-guard';
import { GraphqlConfigService } from './common/graphql-config.service';
import { IdInterceptor } from './common/id-interceptor';
import { RequestContextService } from './common/request-context.service';
import { AdministratorResolver } from './resolvers/administrator.resolver';
import { AssetResolver } from './resolvers/asset.resolver';
import { AuthResolver } from './resolvers/auth.resolver';
import { ChannelResolver } from './resolvers/channel.resolver';
import { ConfigResolver } from './resolvers/config.resolver';
import { CountryResolver } from './resolvers/country.resolver';
import { CustomerGroupResolver } from './resolvers/customer-group.resolver';
import { CustomerResolver } from './resolvers/customer.resolver';
import { FacetResolver } from './resolvers/facet.resolver';
import { OrderResolver } from './resolvers/order.resolver';
import { ProductOptionResolver } from './resolvers/product-option.resolver';
import { ProductResolver } from './resolvers/product.resolver';
import { PromotionResolver } from './resolvers/promotion.resolver';
import { RoleResolver } from './resolvers/role.resolver';
import { TaxCategoryResolver } from './resolvers/tax-category.resolver';
import { ZoneResolver } from './resolvers/zone.resolver';

const exportedProviders = [
    PromotionResolver,
    AdministratorResolver,
    AuthResolver,
    AssetResolver,
    ChannelResolver,
    ConfigResolver,
    CountryResolver,
    FacetResolver,
    CustomerResolver,
    CustomerGroupResolver,
    OrderResolver,
    ProductOptionResolver,
    ProductResolver,
    RoleResolver,
    TaxCategoryResolver,
    ZoneResolver,
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
    exports: exportedProviders,
})
export class ApiModule {}
