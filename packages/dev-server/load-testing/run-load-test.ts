/* tslint:disable:no-console */
import { INestApplication } from '@nestjs/common';
import { bootstrap } from '@vendure/core';
import { spawn } from 'child_process';
import stringify from 'csv-stringify';
import fs from 'fs';
import path from 'path';

import { omit } from '../../common/src/omit';

import { generateSummary, LoadTestSummary } from './generate-summary';
import { getLoadTestConfig, getProductCount } from './load-test-config';

const count = getProductCount();

if (require.main === module) {
    console.log(`\n============= Vendure Load Test: ${count} products ============\n`);

// Runs the init script to generate test data and populate the test database
    const init = spawn('node', ['-r', 'ts-node/register', './init-load-test.ts', count.toString()], {
        cwd: __dirname,
        stdio: 'inherit',
    });

    init.on('exit', code => {
        if (code === 0) {
            return bootstrap(getLoadTestConfig('cookie'))
                .then(app => {
                    return runLoadTestScript('deep-query.js')
                        .then((summary1) => runLoadTestScript('search-and-checkout.js').then(summary2 => [summary1, summary2]))
                        .then(summaries => {
                            closeAndExit(app, summaries);
                        });
                })
                .catch(err => {
                    // tslint:disable-next-line
                    console.log(err);
                });
        } else {
            process.exit(code || 1);
        }
    });
}

function runLoadTestScript(script: string): Promise<LoadTestSummary> {
    const rawResultsFile = `${script}.${count}.json`;

    return new Promise((resolve, reject) => {
        const loadTest = spawn('k6', ['run', `./scripts/${script}`, '--out', `json=results/${rawResultsFile}`], {
            cwd: __dirname,
            stdio: 'inherit',
        });
        loadTest.on('exit', code => {
            if (code === 0) {
                resolve(code);
            } else {
                reject();
            }
        });
        loadTest.on('error', err => {
            reject(err);
        });
    })
        .then(() => generateSummary(rawResultsFile));
}

async function closeAndExit(app: INestApplication, summaries: LoadTestSummary[]) {
    console.log('Closing server and preparing results...');
    // allow a pause for all queries to complete before closing the app
    await new Promise(resolve => setTimeout(resolve, 3000));
    await app.close();
    const dateString = getDateString();

    // write summary JSON
    const summaryData = summaries.map(s => omit(s, ['requestDurationTimeSeries', 'concurrentUsersTimeSeries']));
    const summaryFile = path.join(__dirname, `results/load-test-${dateString}-${count}.json`);
    fs.writeFileSync(summaryFile, JSON.stringify(summaryData, null, 2), 'utf-8');
    console.log(`Summary written to ${path.relative(__dirname, summaryFile)}`);

    // write time series CSV
    for (const summary of summaries) {
        const csvData = await getTimeSeriesCsvData(summary);
        const timeSeriesFile = path.join(__dirname, `results/load-test-${dateString}-${count}-${summary.script}.csv`);
        fs.writeFileSync(timeSeriesFile, csvData, 'utf-8');
        console.log(`Time series data written to ${path.relative(__dirname, timeSeriesFile)}`);
    }

    process.exit(0);
}

async function getTimeSeriesCsvData(summary: LoadTestSummary): Promise<string> {

    const stringifier = stringify({
        delimiter: ',',
    });

    const data: string[] = [];

    stringifier.on('readable', () => {
        let row;
        // tslint:disable-next-line:no-conditional-assignment
        while (row = stringifier.read()) {
            data.push(row);
        }
    });

    stringifier.write([
        `${summary.script}:elapsed`,
        `${summary.script}:request_duration`,
        `${summary.script}:user_count`,
    ]);

    let startTime: number | undefined;

    for (const row of summary.requestDurationTimeSeries) {
        if (!startTime) {
            startTime = row.timestamp;
        }
        stringifier.write([row.timestamp - startTime, row.value, '']);
    }
    for (const row of summary.concurrentUsersTimeSeries) {
        if (!startTime) {
            startTime = row.timestamp;
        }
        stringifier.write([row.timestamp - startTime, '', row.value]);
    }

    stringifier.end();

    return new Promise((resolve, reject) => {
        stringifier.on('error', (err: any) => {
            reject(err.message);
        });
        stringifier.on('finish', async () => {
            resolve(data.join(''));
        });
    });
}

function getDateString(): string {
    return (new Date().toISOString()).split('.')[0].replace(/[:\.]/g, '_');
}
