import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLFactory, GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { GraphQLDateTime } from 'graphql-iso-date';
import * as GraphQLJSON from 'graphql-type-json';

import { CustomFields } from '../../shared/shared-types';

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
import { getConfig } from './config/vendure-config';
import { validateCustomFieldsConfig } from './entity/custom-entity-fields';
import { addGraphQLCustomFields } from './entity/graphql-custom-fields';
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
    imports: [GraphQLModule, TypeOrmModule.forRoot(getConfig().dbConnectionOptions)],
    controllers: [AuthController],
    providers: [
        AdministratorResolver,
        AdministratorService,
        AuthService,
        ConfigResolver,
        ConfigService,
        FacetResolver,
        FacetService,
        FacetValueService,
        JwtStrategy,
        I18nService,
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
    constructor(
        private readonly graphQLFactory: GraphQLFactory,
        private configService: ConfigService,
        private i18nService: I18nService,
    ) {}

    configure(consumer: MiddlewareConsumer) {
        validateCustomFieldsConfig(this.configService.customFields);
        const schema = this.createSchema(this.configService.customFields);

        consumer
            .apply(
                graphiqlExpress({
                    endpointURL: this.configService.apiPath,
                    subscriptionsEndpoint: `ws://localhost:3001/subscriptions`,
                }),
            )
            .forRoutes('/graphiql')
            .apply([
                this.i18nService.handle(),
                graphqlExpress(req => ({
                    schema,
                    context: req,
                    formatError: this.i18nService.translateError(req),
                })),
            ] as any)
            .forRoutes(this.configService.apiPath);
    }

    private createSchema(customFields: CustomFields) {
        const typeDefs = this.graphQLFactory.mergeTypesByPaths(__dirname + '/**/*.graphql');
        const extendedTypeDefs = addGraphQLCustomFields(typeDefs, customFields);
        return this.graphQLFactory.createSchema({
            typeDefs: extendedTypeDefs,
            resolverValidationOptions: {
                requireResolversForResolveType: false,
            },
            resolvers: {
                JSON: GraphQLJSON,
                DateTime: GraphQLDateTime,
            },
        });
    }
}
