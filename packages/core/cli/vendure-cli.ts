#!/usr/bin/env node
import program from 'commander';
import path from 'path';
import prompts from 'prompts';

import { logColored } from './cli-utils';
import { importProducts } from './populate';
// tslint:disable-next-line:no-var-requires
const version = require('../../package.json').version;

// tslint:disable:no-console
logColored(`
                      _
                     | |
 __   _____ _ __   __| |_   _ _ __ ___
 \\ \\ / / _ \\ '_ \\ / _\` | | | | '__/ _ \\
  \\ V /  __/ | | | (_| | |_| | | |  __/
   \\_/ \\___|_| |_|\\__,_|\\__,_|_|  \\___|
                                       `);

program.version(`Vendure CLI v${version}`, '-v --version').name('vendure');
program
    .command('import-products <csvFile>')
    .option('-l, --language', 'Specify ISO 639-1 language code, e.g. "de", "es". Defaults to "en"')
    .description('Import product data from the specified csv file')
    .action(async (csvPath, command) => {
        const filePath = path.join(process.cwd(), csvPath);
        await importProducts(filePath, command.language);
    });
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.help();
}
