import { INestApplication } from '@nestjs/common';
import fs from 'fs-extra';
import path from 'path';

import { logColored } from './cli-utils';
// tslint:disable-next-line:no-var-requires
const { Populator, Importer } = require('@vendure/core');

// tslint:disable:no-console
export async function populate() {
    logColored('\nPopulating... (this may take a minute or two)\n');
    const app = await getApplicationRef();
    if (app) {
        const initialData = require('./assets/initial-data.json');
        await populateInitialData(app, initialData);
        await populateProducts(app, initialData);
        await populateCollections(app, initialData);
        logColored('\nDone!');
        await app.close();
        process.exit(0);
    }
}

export async function importProducts(csvPath: string, languageCode: string) {
    logColored(`\nImporting from "${csvPath}"...\n`);
    const app = await getApplicationRef();
    if (app) {
        await importProductsFromFile(app, csvPath, languageCode);
        logColored('\nDone!');
        await app.close();
        process.exit(0);
    }
}

async function getApplicationRef(): Promise<INestApplication | undefined> {
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
    config.silent = true;

    // Force the sync mode on, so that all the tables are created
    // on this initial run.
    config.dbConnectionOptions.synchronize = true;

    const { bootstrap } = require('@vendure/core');
    console.log('Bootstrapping Vendure server...');
    const app = await bootstrap(config);
    return app;
}

async function populateInitialData(app: INestApplication, initialData: any) {
    const populator = app.get(Populator);
    try {
        await populator.populateInitialData(initialData);
    } catch (err) {
        console.error(err.message);
    }
}

async function populateCollections(app: INestApplication, initialData: any) {
    const populator = app.get(Populator);
    try {
        await populator.populateCollections(initialData);
    } catch (err) {
        console.error(err.message);
    }
}

async function populateProducts(app: INestApplication, initialData: any) {
    // copy the images to the import folder
    const images = path.join(__dirname, 'assets', 'images');
    const destination = path.join(process.cwd(), 'vendure', 'import-assets');
    await fs.copy(images, destination);

    // import the csv of same product data
    const sampleProductsFile = path.join(__dirname, 'assets', 'products.csv');
    await importProductsFromFile(app, sampleProductsFile, initialData.defaultLanguage);
}

async function importProductsFromFile(app: INestApplication, csvPath: string, languageCode: string) {
    // import the csv of same product data
    const importer = app.get(Importer);
    const productData = await fs.readFile(csvPath, 'utf-8');

    const importResult = await importer.parseAndImport(productData, languageCode, true).toPromise();
    if (importResult.errors.length) {
        const errorFile = path.join(process.cwd(), 'vendure-import-error.log');
        console.log(
            `${importResult.errors.length} errors encountered when importing product data. See: ${errorFile}`,
        );
        await fs.writeFile(errorFile, importResult.errors.join('\n'));
    }

    logColored(`\nImported ${importResult.imported} products`);
}
