import { INestApplication } from '@nestjs/common';
import fs from 'fs-extra';
import path from 'path';

import { logColored } from './cli-utils';

// tslint:disable:no-console
/**
 * @description
 * Populates the Vendure server with some initial data and (optionally) product data from
 * a supplied CSV file.
 *
 * @docsCategory import-export
 */
export async function populate(
    bootstrapFn: () => Promise<INestApplication | undefined>,
    initialDataPathOrObject: string | object,
    productsCsvPath?: string,
): Promise<INestApplication> {
    const app = await bootstrapFn();
    if (!app) {
        throw new Error('Could not bootstrap the Vendure app');
    }
    const initialData: import('@vendure/core').InitialData =
        typeof initialDataPathOrObject === 'string'
            ? require(initialDataPathOrObject)
            : initialDataPathOrObject;
    await populateInitialData(app, initialData, logColored);
    if (productsCsvPath) {
        await importProductsWithLogging(app, productsCsvPath, initialData.defaultLanguage);
        await populateCollections(app, initialData, logColored);
    }
    logColored('\nDone!');
    return app;
}

export async function importProducts(csvPath: string, languageCode: import('@vendure/core').LanguageCode) {
    logColored(`\nImporting from "${csvPath}"...\n`);
    const app = await getApplicationRef();
    if (app) {
        await importProductsFromCsv(app, csvPath, languageCode);
        logColored('\nDone!');
        await app.close();
        process.exit(0);
    }
}

async function importProductsWithLogging(
    app: INestApplication,
    productsCsvPath: string,
    languageCode: import('@vendure/core').LanguageCode,
) {
    const importResult = await importProductsFromCsv(app, productsCsvPath, languageCode);
    if (importResult.errors && importResult.errors.length) {
        const errorFile = path.join(process.cwd(), 'vendure-import-error.log');
        console.log(
            `${importResult.errors.length} errors encountered when importing product data. See: ${errorFile}`,
        );
        await fs.writeFile(errorFile, importResult.errors.join('\n'));
    }

    logColored(`\nImported ${importResult.imported} products`);
}

export async function getApplicationRef(): Promise<INestApplication | undefined> {
    const tsConfigFile = path.join(process.cwd(), 'vendure-config.ts');
    const jsConfigFile = path.join(process.cwd(), 'vendure-config.js');
    let isTs = false;
    let configFile: string | undefined;
    if (fs.existsSync(tsConfigFile)) {
        configFile = tsConfigFile;
        isTs = true;
    } else if (fs.existsSync(jsConfigFile)) {
        configFile = jsConfigFile;
    }

    if (!configFile) {
        console.error(`Could not find a config file`);
        console.error(`Checked "${tsConfigFile}", "${jsConfigFile}"`);
        process.exit(1);
        return;
    }

    if (isTs) {
        // we expect ts-node to be available
        const tsNode = require('ts-node');
        if (!tsNode) {
            console.error(`For "populate" to work with TypeScript projects, you must have ts-node installed`);
            process.exit(1);
            return;
        }
        require('ts-node').register();
    }

    const index = require(configFile);

    if (!index) {
        console.error(`Could not read the contents of "${configFile}"`);
        process.exit(1);
        return;
    }
    if (!index.config) {
        console.error(`The file "${configFile}" does not export a "config" object`);
        process.exit(1);
        return;
    }

    const config = index.config;

    // Force the sync mode on, so that all the tables are created
    // on this initial run.
    (config.dbConnectionOptions as any).synchronize = true;

    const { bootstrap } = require('@vendure/core');
    console.log('Bootstrapping Vendure server...');
    const app = await bootstrap(config);
    return app;
}

export async function populateInitialData(
    app: INestApplication,
    initialData: import('@vendure/core').InitialData,
    loggingFn?: (message: string) => void,
) {
    const { Populator } = await import('@vendure/core');
    const populator = app.get(Populator);
    try {
        await populator.populateInitialData(initialData);
        if (typeof loggingFn === 'function') {
            loggingFn(`Populated initial data`);
        }
    } catch (err) {
        console.error(err.message);
    }
}

export async function populateCollections(
    app: INestApplication,
    initialData: import('@vendure/core').InitialData,
    loggingFn?: (message: string) => void,
) {
    const { Populator } = await import('@vendure/core');
    const populator = app.get(Populator);
    try {
        if (initialData.collections.length) {
            await populator.populateCollections(initialData);
            if (typeof loggingFn === 'function') {
                loggingFn(`Created ${initialData.collections.length} Collections`);
            }
        }
    } catch (err) {
        console.error(err.message);
    }
}

export async function importProductsFromCsv(
    app: INestApplication,
    productsCsvPath: string,
    languageCode: import('@vendure/core').LanguageCode,
) {
    const { Importer } = await import('@vendure/core');
    const importer = app.get(Importer);
    const productData = await fs.readFile(productsCsvPath, 'utf-8');

    return importer.parseAndImport(productData, languageCode, true).toPromise();
}
