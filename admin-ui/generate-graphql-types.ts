import { spawn } from 'child_process';
import * as fs from 'fs';
import { execute, GraphQLSchema, IntrospectionQuery, IntrospectionSchema, parse } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { buildClientSchema, introspectionQuery, printSchema } from 'graphql/utilities';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import { API_PATH, API_PORT } from '../shared/shared-constants';

// tslint:disable:no-console
const API_URL = `http://localhost:${API_PORT}/${API_PATH}`;
const SCHEMA_JSON_FILE = '../schema.json';
const CLIENT_SCHEMA_FILES = './src/app/data/types/**/*.graphql';
const CLIENT_QUERY_FILES = '"./src/app/data/(queries|mutations)/**/*.ts"';
const TYPESCRIPT_DEFINITIONS_FILE = './src/app/data/types/gql-generated-types.ts';

main().catch(e => {
    console.log('Could not generate types!', e);
    process.exitCode = 1;
});

/**
 * This script uses apollo-codegen to generate TypeScript interfaces for all
 * GraphQL queries defined in the admin-ui app. Run it via the package.json
 * script "generate-gql-types".
 */
async function main(): Promise<void> {
    const introspectionQueryFromApi = await downloadSchemaFromApi(API_URL);
    const combinedSchema = await combineSchemas(introspectionQueryFromApi, CLIENT_SCHEMA_FILES);

    fs.writeFileSync(SCHEMA_JSON_FILE, JSON.stringify(combinedSchema));
    console.log(`Generated schema file: ${SCHEMA_JSON_FILE}`);

    await generateTypeScriptTypesFromSchema(SCHEMA_JSON_FILE, CLIENT_QUERY_FILES, TYPESCRIPT_DEFINITIONS_FILE);

    console.log('Generated TypeScript definitions!');
}

/**
 * Downloads the schema from the provided GraphQL endpoint using the `apollo schema:download`
 * cli command and returns the result as an IntrospectionQuery object.
 */
async function downloadSchemaFromApi(apiEndpoint: string): Promise<IntrospectionQuery> {
    const TEMP_API_SCHEMA = '../schema.temp.json';
    await runCommand('yarn', [
        'apollo',
        'schema:download',
        TEMP_API_SCHEMA,
        `--endpoint=${API_URL}`,
    ]);

    console.log(`Downloaded schema from ${API_URL}`);

    const schemaFromApi = fs.readFileSync(TEMP_API_SCHEMA, { encoding: 'utf8' });
    fs.unlinkSync(TEMP_API_SCHEMA);
    const introspectionSchema: IntrospectionSchema = JSON.parse(schemaFromApi);
    return {
        __schema: introspectionSchema,
    };
}

async function introspectionFromSchema(schema: GraphQLSchema): Promise<IntrospectionQuery> {
    const queryAST = parse(introspectionQuery);
    const result = await execute(schema, queryAST);
    return result.data as IntrospectionQuery;
}

/**
 * Combines the IntrospectionQuery from the GraphQL API with any client-side schemas as defined by the
 * clientSchemaFiles glob.
 */
async function combineSchemas(introspectionQueryFromApi: IntrospectionQuery, clientSchemaFiles: string): Promise<IntrospectionQuery> {
    const schemaFromApi = buildClientSchema(introspectionQueryFromApi);
    const clientSchemas = fileLoader(clientSchemaFiles);
    const remoteSchema = printSchema(schemaFromApi);
    const typeDefs = mergeTypes([...clientSchemas, remoteSchema], {
        all: true,
    });
    const executableSchema = makeExecutableSchema({ typeDefs, resolverValidationOptions: { requireResolversForResolveType: false } });
    const introspection = await introspectionFromSchema(executableSchema);
    return introspection;
}

/**
 * Generates TypeScript definitions from the provided schema json file sing the `apollo codegen:generate` cli command.
 */
async function generateTypeScriptTypesFromSchema(schemaFile: string, queryFiles: string, outputFile: string): Promise<number> {
    return runCommand('yarn', [
        'apollo',
        'codegen:generate',
        outputFile,
        '--addTypename',
        `--queries=${queryFiles}`,
        `--schema ${schemaFile}`,
    ]);
}

/**
 * Runs a command-line command and resolves when completed.
 */
function runCommand(command: string, args: string[]): Promise<number> {
    return new Promise((resolve, reject) => {
        const cp = spawn(command, args, { shell: true });

        cp.on('error', reject);
        cp.stdout.on('data', (data) => {
            if (4 < data.length) {
                console.log(`${data}`);
            }
        });
        cp.stderr.on('data', data => {
            if (4 < data.length) {
                console.log(`${data}`);
            }
        });
        cp.on('close', code => {
            if (code !== 0) {
                reject(code);
            }
            resolve(code);
        });
    });
}
