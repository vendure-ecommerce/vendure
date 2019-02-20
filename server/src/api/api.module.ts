import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import path from 'path';

import { DataImportModule } from '../data-import/data-import.module';
import { PluginModule } from '../plugin/plugin.module';
import { ServiceModule } from '../service/service.module';

import { IdCodecService } from './common/id-codec.service';
import { RequestContextService } from './common/request-context.service';
import { configureGraphQLModule } from './config/graphql-config.service';
import { AssetInterceptor } from './middleware/asset-interceptor';
import { AuthGuard } from './middleware/auth-guard';
import { IdInterceptor } from './middleware/id-interceptor';
import { AdministratorResolver } from './resolvers/admin/administrator.resolver';
import { AssetResolver } from './resolvers/admin/asset.resolver';
import { AuthResolver } from './resolvers/admin/auth.resolver';
import { ChannelResolver } from './resolvers/admin/channel.resolver';
import { CountryResolver } from './resolvers/admin/country.resolver';
import { CustomerGroupResolver } from './resolvers/admin/customer-group.resolver';
import { CustomerResolver } from './resolvers/admin/customer.resolver';
import { FacetResolver } from './resolvers/admin/facet.resolver';
import { GlobalSettingsResolver } from './resolvers/admin/global-settings.resolver';
import { ImportResolver } from './resolvers/admin/import.resolver';
import { OrderResolver } from './resolvers/admin/order.resolver';
import { PaymentMethodResolver } from './resolvers/admin/payment-method.resolver';
import { ProductCategoryResolver } from './resolvers/admin/product-category.resolver';
import { ProductOptionResolver } from './resolvers/admin/product-option.resolver';
import { ProductResolver } from './resolvers/admin/product.resolver';
import { PromotionResolver } from './resolvers/admin/promotion.resolver';
import { RoleResolver } from './resolvers/admin/role.resolver';
import { SearchResolver } from './resolvers/admin/search.resolver';
import { ShippingMethodResolver } from './resolvers/admin/shipping-method.resolver';
import { TaxCategoryResolver } from './resolvers/admin/tax-category.resolver';
import { TaxRateResolver } from './resolvers/admin/tax-rate.resolver';
import { ZoneResolver } from './resolvers/admin/zone.resolver';

const adminResolvers = [
    AdministratorResolver,
    AssetResolver,
    AuthResolver,
    ChannelResolver,
    CountryResolver,
    CustomerGroupResolver,
    CustomerResolver,
    FacetResolver,
    GlobalSettingsResolver,
    ImportResolver,
    OrderResolver,
    PaymentMethodResolver,
    ProductCategoryResolver,
    ProductOptionResolver,
    ProductResolver,
    PromotionResolver,
    RoleResolver,
    SearchResolver,
    ShippingMethodResolver,
    TaxCategoryResolver,
    TaxRateResolver,
    ZoneResolver,
];

@Module({
    imports: [ServiceModule, DataImportModule],
    providers: [IdCodecService, ...adminResolvers],
    exports: adminResolvers,
})
class AdminApiModule {}

/**
 * The ApiModule is responsible for the public API of the application. This is where requests
 * come in, are parsed and then handed over to the ServiceModule classes which take care
 * of the business logic.
 */
@Module({
    imports: [
        ServiceModule,
        DataImportModule,
        AdminApiModule,
        configureGraphQLModule(configService => ({
            apiPath: configService.apiPath,
            typePaths: ['type', 'admin-api', 'common'].map(p =>
                path.join(__dirname, 'schema', p, '*.graphql'),
            ),
            resolverModule: AdminApiModule,
        })),
        PluginModule,
    ],
    providers: [
        RequestContextService,
        IdCodecService,
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
