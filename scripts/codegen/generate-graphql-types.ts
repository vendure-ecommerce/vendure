import { generate } from '@graphql-codegen/cli';
import fs from 'fs';
import { buildClientSchema, graphqlSync, introspectionQuery } from 'graphql';
import { mergeSchemas } from 'graphql-tools';
import path from 'path';

import { ADMIN_API_PATH, API_PORT, SHOP_API_PATH } from '../../packages/common/src/shared-constants';

import { downloadIntrospectionSchema } from './download-introspection-schema';

const CLIENT_QUERY_FILES = path.join(__dirname, '../../packages/admin-ui/src/lib/core/src/data/definitions/**/*.ts');
const E2E_ADMIN_QUERY_FILES = path.join(__dirname, '../../packages/core/e2e/**/!(import.e2e-spec|plugin.e2e-spec|shop-definitions|custom-fields.e2e-spec|list-query-builder.e2e-spec).ts');
const E2E_SHOP_QUERY_FILES = [
    path.join(__dirname, '../../packages/core/e2e/graphql/shop-definitions.ts'),
];
const E2E_ELASTICSEARCH_PLUGIN_QUERY_FILES = path.join(__dirname, '../../packages/elasticsearch-plugin/e2e/**/*.ts');
const E2E_ASSET_SERVER_PLUGIN_QUERY_FILES = path.join(__dirname, '../../packages/asset-server-plugin/e2e/**/*.ts');
const ADMIN_SCHEMA_OUTPUT_FILE = path.join(__dirname, '../../schema-admin.json');
const SHOP_SCHEMA_OUTPUT_FILE = path.join(__dirname, '../../schema-shop.json');

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

        const config = {
            namingConvention: {
                enumValues: 'keep',
            },
            strict: true,
        };
        const commonPlugins = [
            { add: '// tslint:disable' },
            'typescript',
        ];
        const clientPlugins = [
            ...commonPlugins,
            'typescript-operations',
            'typescript-compatibility',
        ];

        return generate({
            overwrite: true,
            generates: {
                [path.join(__dirname, '../../packages/core/e2e/graphql/generated-e2e-admin-types.ts')]: {
                    schema: [ADMIN_SCHEMA_OUTPUT_FILE],
                    documents: E2E_ADMIN_QUERY_FILES,
                    plugins: clientPlugins,
                    config,
                },
                [path.join(__dirname, '../../packages/core/e2e/graphql/generated-e2e-shop-types.ts')]: {
                    schema: [SHOP_SCHEMA_OUTPUT_FILE],
                    documents: E2E_SHOP_QUERY_FILES,
                    plugins: clientPlugins,
                    config,
                },
                [path.join(__dirname, '../../packages/elasticsearch-plugin/e2e/graphql/generated-e2e-elasticsearch-plugin-types.ts')]: {
                    schema: [ADMIN_SCHEMA_OUTPUT_FILE],
                    documents: E2E_ELASTICSEARCH_PLUGIN_QUERY_FILES,
                    plugins: clientPlugins,
                    config,
                },
                [path.join(__dirname, '../../packages/asset-server-plugin/e2e/graphql/generated-e2e-asset-server-plugin-types.ts')]: {
                    schema: [ADMIN_SCHEMA_OUTPUT_FILE],
                    documents: E2E_ASSET_SERVER_PLUGIN_QUERY_FILES,
                    plugins: clientPlugins,
                    config,
                },
                [path.join(__dirname, '../../packages/admin-ui/src/lib/core/src/common/generated-types.ts')]: {
                    schema: [ADMIN_SCHEMA_OUTPUT_FILE, path.join(__dirname, 'client-schema.ts')],
                    documents: CLIENT_QUERY_FILES,
                    plugins: clientPlugins,
                    config,
                },
                [path.join(__dirname, '../../packages/admin-ui/src/lib/core/src/common/introspection-result.ts')]: {
                    schema: [ADMIN_SCHEMA_OUTPUT_FILE, path.join(__dirname, 'client-schema.ts')],
                    documents: CLIENT_QUERY_FILES,
                    plugins: [{ add: '// tslint:disable' }, 'fragment-matcher'],
                    config,
                },
                [path.join(__dirname, '../../packages/common/src/generated-types.ts')]: {
                    schema: [ADMIN_SCHEMA_OUTPUT_FILE],
                    plugins: commonPlugins,
                    config,
                },
                [path.join(__dirname, '../../packages/common/src/generated-shop-types.ts')]: {
                    schema: [SHOP_SCHEMA_OUTPUT_FILE],
                    plugins: commonPlugins,
                    config,
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
