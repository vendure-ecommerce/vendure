import { mergeConfig } from '@vendure/core';
import {
    createTestEnvironment,
    testConfig as defaultTestConfig,
    registerInitializer,
    SqljsInitializer,
} from '@vendure/testing';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { initialData } from './fixtures/initial-data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VENDURE_PORT = 3050;

registerInitializer('sqljs', new SqljsInitializer(path.join(__dirname, '__data__')));

const config = mergeConfig(defaultTestConfig, {
    apiOptions: {
        port: VENDURE_PORT,
    },
});

// mergeConfig won't replace a boolean with an object, so set CORS explicitly.
// The dashboard's fetch uses credentials: 'include', which requires the server
// to reflect the request origin (not wildcard *) and set credentials: true.
config.apiOptions.cors = {
    origin: true,
    credentials: true,
};

const { server } = createTestEnvironment(config);

export default async function globalSetup() {
    await server.init({
        initialData,
        productsCsvPath: path.join(__dirname, '../../core/e2e/fixtures/e2e-products-full.csv'),
        customerCount: 5,
    });
    (globalThis as any).__VENDURE_SERVER__ = server;
}
