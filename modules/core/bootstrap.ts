import 'reflect-metadata';
import { ConnectionOptions, createConnection, useContainer as typeOrmUseContainer } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { graphqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { Container } from 'typedi';
import { useContainer as typeGraphQlUseContainer, buildSchema } from 'type-graphql';
import { User } from './entities/User';
import { UserResolver } from './resolvers/userResolver';
import {populate} from '../testing/populate';

export interface BootstrapOptions {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize?: boolean;
    logging?: boolean;
}

const PORT = 3000;

// Set up dependency injection for TypeORM and TypeGraphQL
typeOrmUseContainer(Container);
typeGraphQlUseContainer(Container);

const defaultConnectionOptions: ConnectionOptions = {
    type: 'mysql',
    entities: ['./**/entities/*.ts'],
    synchronize: true,
    logging: false,
};

export async function bootstrap(options: BootstrapOptions) {
    try {
        const connectionOptions = {
            ...defaultConnectionOptions,
            ...options,
        } as ConnectionOptions;
        const connection = await createConnection(connectionOptions);

        populate(connection);

        const schema = await buildSchema({
            resolvers: [UserResolver],
        });
        const app = express();
        app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
        app.listen(PORT);
    } catch (error) {
        console.log(error);
    }
}
