// reviews-plugin.ts
import { NestFactory } from '@nestjs/core';
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from '@nestjs/graphql';
import { printSchema } from 'graphql';

import { VendurePlugin } from '..';

import { CarResolver } from './api/car.resolver';
import CarEntity from './entitiy/car.entity';

async function generateSchema() {
    const app = await NestFactory.create(GraphQLSchemaBuilderModule);
    await app.init();

    const gqlSchemaFactory = app.get(GraphQLSchemaFactory);
    const schema = await gqlSchemaFactory.create([CarResolver]);
    return printSchema(schema);
}

@VendurePlugin({
    entities: [CarEntity],
    shopApiExtensions: {
        schema: (async () => {
            return await generateSchema();
        })(),
        resolvers: [CarResolver],
    },
})
export class CarPlugin {}
