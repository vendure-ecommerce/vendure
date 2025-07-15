/* eslint-disable no-console */
import { INestApplication } from '@nestjs/common';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { bootstrap, DefaultLogger, LogLevel, VendureConfig } from '@vendure/core';
import fs from 'fs';
import { getIntrospectionQuery } from 'graphql';
import http from 'http';

export const config: VendureConfig = {
    apiOptions: {
        port: 3355,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        superadminCredentials: {
            identifier: 'superadmin',
            password: 'superadmin',
        },
    },
    dbConnectionOptions: {
        type: 'sqljs',
        synchronize: true,
        logging: false,
    },
    paymentOptions: {
        paymentMethodHandlers: [],
    },
    plugins: [AdminUiPlugin],
    logger: new DefaultLogger({ level: LogLevel.Verbose }),
};

let appPromise: Promise<INestApplication>;

/**
 * Bootstraps the Vendure server with the AdminUiPlugin.
 * Starting up a dedicated server instance ensures that we don't
 * generate any types containing any custom plugin or
 * custom field types.
 */
export async function bootstrapApp() {
    if (appPromise) {
        return appPromise;
    }
    appPromise = bootstrap(config);
    return appPromise;
}

/**
 * Makes an introspection query to the Vendure server and writes the result to a
 * schema.json file.
 *
 * If there is an error connecting to the server, the promise resolves to false.
 */
export async function downloadIntrospectionSchema(apiPath: string, outputFilePath: string): Promise<boolean> {
    const body = JSON.stringify({ query: getIntrospectionQuery({ inputValueDeprecation: true }) });
    const app = await bootstrapApp();

    return new Promise<boolean>((resolve, reject) => {
        const request = http.request(
            {
                method: 'post',
                host: 'localhost',
                port: config.apiOptions.port,
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
                    `ERROR: Could not connect to the Vendure server at http://localhost:${config.apiOptions.port}/${apiPath}`,
                );
                resolve(false);
            }
            reject(err);
        });
    }).finally(() => app.close());
}
