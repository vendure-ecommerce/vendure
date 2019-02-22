import fs from 'fs';
import { buildClientSchema, graphqlSync, introspectionQuery } from 'graphql';
import { generate } from 'graphql-code-generator';
import { TypeScriptNamingConventionMap } from 'graphql-codegen-typescript-common';
import { mergeSchemas } from 'graphql-tools';
import path from 'path';

import { ADMIN_API_PATH, API_PORT, SHOP_API_PATH } from '../shared/shared-constants';

import { downloadIntrospectionSchema } from './download-introspection-schema';

const CLIENT_QUERY_FILES = path.join(__dirname, '../admin-ui/src/app/data/definitions/**/*.ts');
const ADMIN_SCHEMA_OUTPUT_FILE = path.join(__dirname, '../schema-admin.json');
const SHOP_SCHEMA_OUTPUT_FILE = path.join(__dirname, '../schema-shop.json');

// tslint:disable:no-console

Promise.all([
    downloadIntrospectionSchema(ADMIN_API_PATH, ADMIN_SCHEMA_OUTPUT_FILE),
    downloadIntrospectionSchema(SHOP_API_PATH, SHOP_SCHEMA_OUTPUT_FILE),
])
    .then(([adminSchemaSuccess, shopSchemaSuccess]) => {
        if (!adminSchemaSuccess || !shopSchemaSuccess) {
            console.log('Attempting to generate types from existing schema json files...');
        }

        const adminSchemaJson = JSON.parse(fs.readFileSync(ADMIN_SCHEMA_OUTPUT_FILE, 'utf-8'));
        const shopSchemaJson = JSON.parse(fs.readFileSync(SHOP_SCHEMA_OUTPUT_FILE, 'utf-8'));
        const adminSchema = buildClientSchema(adminSchemaJson.data);
        const shopSchema = buildClientSchema(shopSchemaJson.data);
        const combinedSchemas = mergeSchemas({ schemas: [adminSchema, shopSchema]});

        const combinedJson = graphqlSync(combinedSchemas, introspectionQuery).data;
        fs.writeFileSync(path.join(__dirname, '../schema.json'), JSON.stringify(combinedJson, null, 2));

        const namingConventionConfig = {
            namingConvention: {
                enumValues: 'keep',
            } as TypeScriptNamingConventionMap,
        };
        return generate({
            overwrite: true,
            generates: {
                [path.join(__dirname, '../shared/generated-types.ts')]: {
                    schema: [ADMIN_SCHEMA_OUTPUT_FILE, path.join(__dirname, 'client-schema.ts')],
                    documents: CLIENT_QUERY_FILES,
                    plugins: [
                        { add: '// tslint:disable' },
                        'time',
                        'typescript-common',
                        'typescript-client',
                        'typescript-server'],
                    config: namingConventionConfig,
                },
                [path.join(__dirname, '../shared/generated-shop-types.ts')]: {
                    schema: [SHOP_SCHEMA_OUTPUT_FILE],
                    plugins: [
                        { add: '// tslint:disable' },
                        'time',
                        'typescript-common',
                        'typescript-server'],
                    config: namingConventionConfig,
                },
            },
        });
    })
    .then(
        result => {
            process.exit(0);
        },
        err => {
            console.error(err);
            process.exit(1);
        },
    );
