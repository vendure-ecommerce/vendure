import { generate } from '@graphql-codegen/cli';
import fs from 'fs';
import { buildClientSchema } from 'graphql';
import path from 'path';

import { ADMIN_API_PATH, SHOP_API_PATH } from '../../packages/common/src/shared-constants';

import { downloadIntrospectionSchema } from './download-introspection-schema';

const CLIENT_QUERY_FILES = [
    path.join(__dirname, '../../packages/admin-ui/src/lib/core/src/data/definitions/**/*.ts'),
    path.join(__dirname, '../../packages/admin-ui/src/lib/**/*.graphql.ts'),
];

const specFileToIgnore = [
    'import.e2e-spec',
    'plugin.e2e-spec',
    'shop-definitions',
    'custom-fields.e2e-spec',
    'custom-field-relations.e2e-spec',
    'order-item-price-calculation-strategy.e2e-spec',
    'list-query-builder.e2e-spec',
    'shop-order.e2e-spec',
    'database-transactions.e2e-spec',
    'custom-permissions.e2e-spec',
    'parallel-transactions.e2e-spec',
    'order-merge.e2e-spec',
    'entity-hydrator.e2e-spec',
    'relations-decorator.e2e-spec',
    'active-order-strategy.e2e-spec',
];
const E2E_ADMIN_QUERY_FILES = path.join(
    __dirname,
    `../../packages/core/e2e/**/!(${specFileToIgnore.join('|')}).ts`,
);
const E2E_SHOP_QUERY_FILES = [path.join(__dirname, '../../packages/core/e2e/graphql/shop-definitions.ts')];
const E2E_ELASTICSEARCH_PLUGIN_QUERY_FILES = path.join(
    __dirname,
    '../../packages/elasticsearch-plugin/e2e/**/*.ts',
);
const E2E_ASSET_SERVER_PLUGIN_QUERY_FILES = path.join(
    __dirname,
    '../../packages/asset-server-plugin/e2e/**/*.ts',
);
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
        const e2eConfig = {
            ...config,
            skipTypename: true,
        };
        const disableTsLintPlugin = { add: { content: '// tslint:disable' } };
        const graphQlErrorsPlugin = path.join(__dirname, './plugins/graphql-errors-plugin.js');
        const commonPlugins = [disableTsLintPlugin, 'typescript'];
        const clientPlugins = [...commonPlugins, 'typescript-operations', 'typescript-compatibility'];

        return generate({
            overwrite: true,
            generates: {
                [path.join(
                    __dirname,
                    '../../packages/core/src/common/error/generated-graphql-admin-errors.ts',
                )]: {
                    schema: [ADMIN_SCHEMA_OUTPUT_FILE],
                    plugins: [disableTsLintPlugin, graphQlErrorsPlugin],
                },
                [path.join(
                    __dirname,
                    '../../packages/core/src/common/error/generated-graphql-shop-errors.ts',
                )]: {
                    schema: [SHOP_SCHEMA_OUTPUT_FILE],
                    plugins: [disableTsLintPlugin, graphQlErrorsPlugin],
                },
                [path.join(__dirname, '../../packages/core/e2e/graphql/generated-e2e-admin-types.ts')]: {
                    schema: [ADMIN_SCHEMA_OUTPUT_FILE],
                    documents: E2E_ADMIN_QUERY_FILES,
                    plugins: clientPlugins,
                    config: e2eConfig,
                },
                [path.join(__dirname, '../../packages/core/e2e/graphql/generated-e2e-shop-types.ts')]: {
                    schema: [SHOP_SCHEMA_OUTPUT_FILE],
                    documents: E2E_SHOP_QUERY_FILES,
                    plugins: clientPlugins,
                    config: e2eConfig,
                },
                [path.join(
                    __dirname,
                    '../../packages/elasticsearch-plugin/e2e/graphql/generated-e2e-elasticsearch-plugin-types.ts',
                )]: {
                    schema: [ADMIN_SCHEMA_OUTPUT_FILE],
                    documents: E2E_ELASTICSEARCH_PLUGIN_QUERY_FILES,
                    plugins: clientPlugins,
                    config: e2eConfig,
                },
                [path.join(
                    __dirname,
                    '../../packages/asset-server-plugin/e2e/graphql/generated-e2e-asset-server-plugin-types.ts',
                )]: {
                    schema: [ADMIN_SCHEMA_OUTPUT_FILE],
                    documents: E2E_ASSET_SERVER_PLUGIN_QUERY_FILES,
                    plugins: clientPlugins,
                    config: e2eConfig,
                },
                [path.join(__dirname, '../../packages/admin-ui/src/lib/core/src/common/generated-types.ts')]:
                    {
                        schema: [ADMIN_SCHEMA_OUTPUT_FILE, path.join(__dirname, 'client-schema.ts')],
                        documents: CLIENT_QUERY_FILES,
                        plugins: clientPlugins,
                        config: {
                            ...config,
                            skipTypeNameForRoot: true,
                        },
                    },
                [path.join(
                    __dirname,
                    '../../packages/admin-ui/src/lib/core/src/common/introspection-result.ts',
                )]: {
                    schema: [ADMIN_SCHEMA_OUTPUT_FILE, path.join(__dirname, 'client-schema.ts')],
                    documents: CLIENT_QUERY_FILES,
                    plugins: [disableTsLintPlugin, 'fragment-matcher'],
                    config: { ...config, apolloClientVersion: 3 },
                },
                [path.join(__dirname, '../../packages/common/src/generated-types.ts')]: {
                    schema: [ADMIN_SCHEMA_OUTPUT_FILE],
                    plugins: commonPlugins,
                    config: {
                        ...config,
                        scalars: {
                            ID: 'string | number',
                        },
                        maybeValue: 'T',
                    },
                },
                [path.join(__dirname, '../../packages/common/src/generated-shop-types.ts')]: {
                    schema: [SHOP_SCHEMA_OUTPUT_FILE],
                    plugins: commonPlugins,
                    config: {
                        ...config,
                        scalars: {
                            ID: 'string | number',
                        },
                        maybeValue: 'T',
                    },
                },
                [path.join(__dirname, '../../packages/payments-plugin/e2e/graphql/generated-admin-types.ts')]:
                    {
                        schema: [ADMIN_SCHEMA_OUTPUT_FILE],
                        documents: path.join(
                            __dirname,
                            '../../packages/payments-plugin/e2e/graphql/admin-queries.ts',
                        ),
                        plugins: clientPlugins,
                        config: e2eConfig,
                    },
                [path.join(__dirname, '../../packages/payments-plugin/e2e/graphql/generated-shop-types.ts')]:
                    {
                        schema: [SHOP_SCHEMA_OUTPUT_FILE],
                        documents: path.join(
                            __dirname,
                            '../../packages/payments-plugin/e2e/graphql/shop-queries.ts',
                        ),
                        plugins: clientPlugins,
                        config: e2eConfig,
                    },
                [path.join(
                    __dirname,
                    '../../packages/payments-plugin/src/mollie/graphql/generated-shop-types.ts',
                )]: {
                    schema: [
                        SHOP_SCHEMA_OUTPUT_FILE,
                        path.join(
                            __dirname,
                            '../../packages/payments-plugin/src/mollie/mollie-shop-schema.ts',
                        ),
                    ],
                    plugins: clientPlugins,
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
