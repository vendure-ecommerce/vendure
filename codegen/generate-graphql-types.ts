import { generate } from 'graphql-code-generator';
import * as path from 'path';

import { API_PATH, API_PORT } from '../shared/shared-constants';

import { downloadIntrospectionSchema } from './download-introspection-schema';

const CLIENT_QUERY_FILES = path.join(__dirname, '../admin-ui/src/app/data/definitions/*.ts');
const SCHEMA_OUTPUT_FILE = path.join(__dirname, '../schema.json');

// tslint:disable:no-console

downloadIntrospectionSchema(SCHEMA_OUTPUT_FILE)
    .then(downloaded => {
        if (!downloaded) {
            console.log('Attempting to generate types from existing schema.json...');
        }
        return generate({
            schema: SCHEMA_OUTPUT_FILE,
            clientSchema: path.join(__dirname, 'client-schema.ts'),
            template: 'typescript',
            out: path.join(__dirname, '../shared/generated-types.ts'),
            overwrite: true,
            args: [CLIENT_QUERY_FILES],
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
