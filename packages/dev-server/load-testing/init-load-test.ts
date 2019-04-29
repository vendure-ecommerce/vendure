// tslint:disable-next-line:no-reference
/// <reference path="../../core/typings.d.ts" />
import { bootstrap, VendureConfig } from '@vendure/core';
import { populate } from '@vendure/core/cli/populate';
import { BaseProductRecord } from '@vendure/core/dist/data-import/providers/import-parser/import-parser';
import stringify from 'csv-stringify';
import fs from 'fs';
import path from 'path';

import { clearAllTables } from '../../core/mock-data/clear-all-tables';
import { initialData } from '../../core/mock-data/data-sources/initial-data';
import { populateCustomers } from '../../core/mock-data/populate-customers';
import { devConfig } from '../dev-config';

import { getLoadTestConfig, getMysqlConnectionOptions, getProductCount, getProductCsvFilePath } from './load-test-config';

// tslint:disable:no-console

/**
 * A script used to populate a database with test data for load testing.
 */
if (require.main === module) {
    // Running from command line
    isDatabasePopulated()
        .then(isPopulated => {
            if (!isPopulated) {
                const count = getProductCount();
                const config = getLoadTestConfig();
                const csvFile = getProductCsvFilePath();
                return clearAllTables(config.dbConnectionOptions, true)
                    .then(() => {
                        if (!fs.existsSync(csvFile)) {
                            return generateProductsCsv(count);
                        }
                    })
                    .then(() => populate(() => bootstrap(config),
                        path.join(__dirname, '../../create/assets/initial-data.json'),
                        csvFile,
                        path.join(__dirname, './data-sources'),
                    ))
                    .then(async app => {
                        console.log('populating customers...');
                        await populateCustomers(10, config as any, true);
                        return app.close();
                    });
            } else {
                console.log('Database is already populated!');
            }
        })
        .then(
            () => process.exit(0),
            err => {
                console.log(err);
                process.exit(1);
            },
        );
}

/**
 * Tests to see whether the load test database is already populated.
 */
function isDatabasePopulated(): Promise<boolean> {
    const mysql = require('mysql');
    const count = getProductCount();
    const mysqlConnectionOptions = getMysqlConnectionOptions(count);
    const connection = mysql.createConnection({
        host: mysqlConnectionOptions.host,
        user: mysqlConnectionOptions.username,
        password: mysqlConnectionOptions.password,
        database: mysqlConnectionOptions.database,
    });

    return new Promise<boolean>((resolve, reject) => {
        connection.connect((error: any) => {
            if (error) {
                reject(error);
                return;
            }

            connection.query('SELECT COUNT(id) as prodCount FROM product', (err: any, results: any) => {
                if (err) {
                    if (err.code === 'ER_NO_SUCH_TABLE') {
                        resolve(false);
                        return;
                    }
                    reject(err);
                    return;
                }
                resolve(results[0].prodCount === count);
            });
        });
    });

}

/**
 * Generates a CSV file of test product data which can then be imported into Vendure.
 */
function generateProductsCsv(productCount: number = 100): Promise<void> {
    const result: BaseProductRecord[] = [];

    const stringifier = stringify({
        delimiter: ',',
    });

    const data: string[] = [];

    console.log(`Generating ${productCount} rows of test product data...`);

    stringifier.on('readable', () => {
        let row;
        // tslint:disable-next-line:no-conditional-assignment
        while (row = stringifier.read()) {
            data.push(row);
        }
    });

    return new Promise((resolve, reject) => {
        const csvFile = getProductCsvFilePath();
        stringifier.on('error', (err: any) => {
            reject(err.message);
        });
        stringifier.on('finish', async () => {
            fs.writeFileSync(csvFile, data.join(''));
            console.log(`Done! Saved to ${csvFile}`);
            resolve();
        });
        generateMockData(productCount, row => stringifier.write(row));
        stringifier.end();
    });
}

function generateMockData(productCount: number, writeFn: (row: string[]) => void) {
    const headers: Array<keyof BaseProductRecord> = [
        'name',
        'slug',
        'description',
        'assets',
        'facets',
        'optionGroups',
        'optionValues',
        'sku',
        'price',
        'taxCategory',
        'variantAssets',
        'variantFacets',
    ];

    writeFn(headers);

    const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna ' +
        'aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ' +
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ' +
        'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
            .replace(/\r\n/g, '');

    const categories = getCategoryNames();

    for (let i = 1; i <= productCount; i++) {
        const outputRow: BaseProductRecord = {
            name: `Product ${i}`,
            slug: `product-${i}`,
            description: LOREM,
            assets: 'product-image.jpg',
            facets: `category:${categories[i % categories.length]}`,
            optionGroups: '',
            optionValues: '',
            sku: `PRODID${i}`,
            price: '12345',
            taxCategory: 'standard',
            variantAssets: '',
            variantFacets: '',
        };
        writeFn(Object.values(outputRow) as string[]);
    }
}

function getCategoryNames() {
    const allNames = initialData.collections.reduce((all, c) => [...all, ...c.facetNames], [] as string[]);
    return Array.from(new Set(allNames));
}
