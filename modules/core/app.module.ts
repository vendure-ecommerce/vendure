import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLFactory } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { AuthController } from './api/auth/auth.controller';
import { CustomerController } from './api/customer/customer.controller';
import { CustomerResolver } from './api/customer/customer.resolver';
import { CustomerService } from './api/customer/customer.service';
import { ProductResolver } from './api/product/product.resolver';
import { ProductService } from './api/product/product.service';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { PasswordService } from './auth/password.service';
import { LocaleService } from './locale/locale.service';

@Module({
    imports: [
        GraphQLModule,
        TypeOrmModule.forRoot({
            type: 'mysql',
            entities: ['./**/entity/**/*.entity.ts'],
            synchronize: true,
            logging: true,
            host: '192.168.99.100',
            port: 3306,
            username: 'root',
            password: '',
            database: 'test',
        }),
    ],
    controllers: [AuthController, CustomerController],
    providers: [
        AuthService,
        JwtStrategy,
        PasswordService,
        CustomerService,
        CustomerResolver,
        ProductService,
        ProductResolver,
        LocaleService,
        PasswordService,
    ],
})
export class AppModule implements NestModule {
    constructor(private readonly graphQLFactory: GraphQLFactory) {}

    configure(consumer: MiddlewareConsumer) {
        const schema = this.createSchema();

        consumer
            .apply(
                graphiqlExpress({
                    endpointURL: '/graphql',
                    subscriptionsEndpoint: `ws://localhost:3001/subscriptions`,
                }),
            )
            .forRoutes('/graphiql')
            .apply(graphqlExpress(req => ({ schema, rootValue: req })))
            .forRoutes('/graphql');
    }

    createSchema() {
        const typeDefs = this.graphQLFactory.mergeTypesByPaths('./**/*.graphql');
        return this.graphQLFactory.createSchema({ typeDefs });
    }
}
