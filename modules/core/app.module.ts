import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { GraphQLFactory } from '@nestjs/graphql';
import { UserService } from './users/user.service';
import { UserController } from './users/user.controller';
import { UserResolver } from './users/user.resolver';

@Module({
    imports: [
        GraphQLModule,
        TypeOrmModule.forRoot({
            type: 'mysql',
            entities: ['./**/entities/*.ts'],
            synchronize: true,
            logging: true,
            host: '192.168.99.100',
            port: 3306,
            username: 'root',
            password: '',
            database: 'test',
        }),
    ],
    controllers: [UserController],
    providers: [UserService, UserResolver],
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
