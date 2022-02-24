import { INestApplicationContext } from '@nestjs/common';
import fs from 'fs-extra';
import path from 'path';

import { logColored } from './cli-utils';

// tslint:disable:no-console
/**
 * @description
 * Populates the Vendure server with some initial data and (optionally) product data from
 * a supplied CSV file. The format of the CSV file is described in the section
 * [Importing Product Data](/docs/developer-guide/importing-product-data).
 *
 * Internally the `populate()` function does the following:
 *
 * 1. Uses the {@link Populator} to populate the {@link InitialData}.
 * 2. If `productsCsvPath` is provided, uses {@link Importer} to populate Product data.
 * 3. Uses {@Populator} to populate collections specified in the {@link InitialData}.
 *
 * @example
 * ```TypeScript
 * import { bootstrap } from '\@vendure/core';
 * import { populate } from '\@vendure/core/cli';
 * import { config } from './vendure-config.ts'
 * import { initialData } from './my-initial-data.ts';
 *
 * const productsCsvFile = path.join(__dirname, 'path/to/products.csv')
 *
 * populate(
 *   () => bootstrap(config),
 *   initialData,
 *   productsCsvFile,
 * )
 * .then(app => app.close())
 * .then(
 *   () => process.exit(0),
 *   err => {
 *     console.log(err);
 *     process.exit(1);
 *   },
 * );
 * ```
 *
 * @docsCategory import-export
 */
export async function populate<T extends INestApplicationContext>(
    bootstrapFn: () => Promise<T | undefined>,
    initialDataPathOrObject: string | object,
    productsCsvPath?: string,
): Promise<T> {
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
    app: INestApplicationContext,
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
        console.log(err.message);
    }
}

export async function populateCollections(
    app: INestApplicationContext,
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
        console.log(err.message);
    }
}

export async function importProductsFromCsv(
    app: INestApplicationContext,
    productsCsvPath: string,
    languageCode: import('@vendure/core').LanguageCode,
): Promise<import('@vendure/core').ImportProgress> {
    const { Importer } = await import('@vendure/core');
    const importer = app.get(Importer);
    const productData = await fs.readFile(productsCsvPath, 'utf-8');

    return importer.parseAndImport(productData, languageCode, true).toPromise();
}
