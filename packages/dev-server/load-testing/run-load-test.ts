/* tslint:disable:no-console */
import { bootstrap } from '@vendure/core';
import { ChildProcess, spawn } from 'child_process';

import { getLoadTestConfig, getProductCount } from './load-test-config';

const count = getProductCount();

console.log(`\n============= Vendure Load Test: ${count} products ============\n`);

// Runs the init script to generate test data and populate the test database
const init = spawn('node', ['-r', 'ts-node/register', './init-load-test.ts', count.toString()], {
    cwd: __dirname,
    stdio: 'inherit',
});

init.on('exit', code => {
    if (code === 0) {
        return bootstrap(getLoadTestConfig())
            .then(app => {
                const loadTest = spawn('k6', ['run', './scripts/search-and-checkout.js'], {
                    cwd: __dirname,
                    stdio: 'inherit',
                });
                loadTest.on('exit', () => {
                    app.close();
                    process.exit(0);
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
