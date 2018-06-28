import { spawn } from 'child_process';
import * as rimraf from 'rimraf';
import { API_PATH, API_PORT } from '../shared/shared-constants';

/*
 * This script uses apollo-codegen to generate TypeScript interfaces for all
 * GraphQL queries defined in the admin-ui app. Run it via the package.json
 * script "generate-gql-types".
 */

const API_URL = `http://localhost:${API_PORT}/${API_PATH}`;
const SCHEMA_DUMP = 'schema.temp.json';

// tslint:disable:no-console
runApolloCodegen([
    'introspect-schema',
    API_URL,
    '--add-typename',
    `--output ${SCHEMA_DUMP}`,
])
    .then(() => {
        console.log('Generated schema dump...');
        return runApolloCodegen([
            'generate',
            './src/app/common/queries/**/*.ts',
            `--schema ${SCHEMA_DUMP}`,
            '--target typescript',
            '--output ./src/app/common/types/gql-generated-types.ts',
        ]);
    })
    .then(() => {
        console.log('Generated TypeScript definitions!');
    })
    .then(() => {
        rimraf(SCHEMA_DUMP, (err) => {
            if (err) {
                console.log('Could not delete schema dump');
            }
            console.log('Deleted schema dump');
        });
    })
    .catch(() => {
        console.log('Could not generate types!');
        process.exitCode = 1;
    });

/**
 * Run the apollo-codegen script and wrap in a Promise.
 */
function runApolloCodegen(args: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
        const cp = spawn('yarn', ['apollo-codegen', ...args], { shell: true });

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
