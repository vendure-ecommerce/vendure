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
        const importResult = await importProductsFromCsv(app, productsCsvPath, initialData.defaultLanguage);
        if (importResult.errors && importResult.errors.length) {
            const errorFile = path.join(process.cwd(), 'vendure-import-error.log');
            console.log(
                `${importResult.errors.length} errors encountered when importing product data. See: ${errorFile}`,
            );
            await fs.writeFile(errorFile, importResult.errors.join('\n'));
        }

        logColored(`\nImported ${importResult.imported} products`);

        await populateCollections(app, initialData, logColored);
    }

    logColored('\nDone!');
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
