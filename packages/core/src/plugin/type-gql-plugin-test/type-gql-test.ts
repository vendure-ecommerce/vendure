// reviews-plugin.ts
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { NestFactory } from '@nestjs/core';
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from '@nestjs/graphql';
import fs from 'fs';
import { printSchema } from 'graphql';
import gql from 'graphql-tag';

import { VendurePlugin } from '..';

import { CarResolver } from './api/car.resolver';
import CarEntity from './entitiy/car.entity';

const path = __dirname + '/schema.graphql';
const schemaFile = loadSchemaSync(path, { loaders: [new GraphQLFileLoader()] });
const schema = gql`
    ${printSchema(schemaFile)}
`;
@VendurePlugin({
    entities: [CarEntity],
    shopApiExtensions: {
        schema,
        resolvers: [CarResolver],
    },
})
export class CarPlugin {}
