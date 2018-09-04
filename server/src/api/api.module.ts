import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { ConfigModule } from '../config/config.module';
import { I18nModule } from '../i18n/i18n.module';
import { ServiceModule } from '../service/service.module';

import { AdministratorResolver } from './administrator/administrator.resolver';
import { AuthController } from './auth/auth.controller';
import { ConfigResolver } from './config/config.resolver';
import { CustomerResolver } from './customer/customer.resolver';
import { FacetResolver } from './facet/facet.resolver';
import { GraphqlConfigService } from './graphql-config.service';
import { JwtStrategy } from './jwt.strategy';
import { ProductOptionResolver } from './product-option/product-option.resolver';
import { ProductResolver } from './product/product.resolver';

const exportedProviders = [
    AdministratorResolver,
    ConfigResolver,
    FacetResolver,
    CustomerResolver,
    ProductOptionResolver,
    ProductResolver,
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
    controllers: [AuthController],
    providers: [...exportedProviders, JwtStrategy],
    exports: exportedProviders,
})
export class ApiModule {}
