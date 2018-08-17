import { spawn } from 'child_process';
import * as fs from 'fs';

import { API_PATH, API_PORT } from '../shared/shared-constants';

// tslint:disable:no-console
const API_URL = `http://localhost:${API_PORT}/${API_PATH}`;
const SCHEMA_JSON_FILE = '../schema.json';
const CLIENT_SCHEMA_FILES = './src/app/data/types/client-types.graphql';
const CLIENT_QUERY_FILES = '"./src/app/data/{queries,mutations,fragments}/**/*.ts"';
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
    await downloadSchemaFromApi(API_URL, SCHEMA_JSON_FILE);
    await generateTypeScriptTypesFromSchema(
        SCHEMA_JSON_FILE,
        CLIENT_SCHEMA_FILES,
        CLIENT_QUERY_FILES,
        TYPESCRIPT_DEFINITIONS_FILE,
    );
}

/**
 * Downloads the schema from the provided GraphQL endpoint using the `apollo schema:download`
 * cli command and returns the result as an IntrospectionQuery object.
 */
async function downloadSchemaFromApi(apiEndpoint: string, outputFile: string): Promise<void> {
    console.log(`Downloading schema from ${API_URL}`);
    const TEMP_API_SCHEMA = '../schema.temp.json';
    await runCommand('yarn', ['apollo', 'schema:download', TEMP_API_SCHEMA, `--endpoint=${API_URL}`]);

    console.log(`Downloaded schema from ${API_URL}`);

    const schemaFromApi = fs.readFileSync(TEMP_API_SCHEMA, { encoding: 'utf8' });
    fs.unlinkSync(TEMP_API_SCHEMA);
    const introspectionSchema = JSON.parse(schemaFromApi);
    fs.writeFileSync(
        SCHEMA_JSON_FILE,
        JSON.stringify({
            __schema: introspectionSchema,
        }),
    );
}

/**
 * Generates TypeScript definitions from the provided schema json file sing the `apollo codegen:generate` cli command.
 */
async function generateTypeScriptTypesFromSchema(
    schemaFile: string,
    clientSchemaFiles: string,
    queryFiles: string,
    outputFile: string,
): Promise<number> {
    return runCommand('yarn', [
        'apollo',
        'codegen:generate',
        outputFile,
        '--addTypename',
        '--outputFlat',
        '--target=typescript',
        `--clientSchema=${clientSchemaFiles}`,
        `--queries=${queryFiles}`,
        `--schema=${schemaFile}`,
    ]);
}

/**
 * Runs a command-line command and resolves when completed.
 */
function runCommand(command: string, args: string[]): Promise<number> {
    return new Promise((resolve, reject) => {
        const cp = spawn(command, args, { shell: true });

        cp.on('error', reject);
        cp.stdout.on('data', data => {
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
