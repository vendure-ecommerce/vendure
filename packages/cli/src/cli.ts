#! /usr/bin/env node

import { Command } from 'commander';

import { registerAddCommand } from './commands/add/add';
import { registerNewCommand } from './commands/new/new';
import { Logger } from './utilities/logger';

const program = new Command();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const version = require('../package.json').version;

program
    .version(version)
    .description('The Vendure CLI')
    .option(
        '--log-level <logLevel>',
        "Log level, either 'silent', 'info', or 'verbose'. Default: 'info'",
        'info',
    );

const options = program.opts();
if (options.logLevel) {
    Logger.setLogLevel(options.logLevel);
}
registerNewCommand(program);
registerAddCommand(program);

void program.parseAsync(process.argv);
