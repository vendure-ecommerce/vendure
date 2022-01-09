import { NestFactory } from '@nestjs/core';
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from '@nestjs/graphql';
import fs from 'fs';
import { printSchema } from 'graphql';

import { CarResolver } from './api/car.resolver';

async function generateSchema() {
    const app = await NestFactory.create(GraphQLSchemaBuilderModule);
    await app.init();

    const gqlSchemaFactory = app.get(GraphQLSchemaFactory);
    const schema = await gqlSchemaFactory.create([CarResolver]);
    fs.writeFileSync(__dirname + '/schema.graphql', printSchema(schema));
}

generateSchema();
