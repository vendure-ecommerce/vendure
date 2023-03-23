import fs from 'fs';
import { getIntrospectionQuery } from 'graphql';
import http from 'http';

import { ADMIN_API_PATH, API_PORT } from '../../packages/common/src/shared-constants';

/* eslint-disable no-console */

/**
 * Makes an introspection query to the Vendure server and writes the result to a
 * schema.json file.
 *
 * If there is an error connecting to the server, the promise resolves to false.
 */
export function downloadIntrospectionSchema(apiPath: string, outputFilePath: string): Promise<boolean> {
    const body = JSON.stringify({ query: getIntrospectionQuery({ inputValueDeprecation: true }) });

    return new Promise((resolve, reject) => {
        const request = http.request(
            {
                method: 'post',
                host: 'localhost',
                port: API_PORT,
                path: '/' + apiPath,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(body),
                },
            },
            response => {
                const outputFile = fs.createWriteStream(outputFilePath);
                response.pipe(outputFile);
                response.on('end', () => resolve(true));
                response.on('error', reject);
            },
        );
        request.write(body);
        request.end();
        request.on('error', (err: any) => {
            if (err.code === 'ECONNREFUSED') {
                console.error(
                    `ERROR: Could not connect to the Vendure server at http://localhost:${API_PORT}/${apiPath}`,
                );
                resolve(false);
            }
            reject(err);
        });
    });
}
