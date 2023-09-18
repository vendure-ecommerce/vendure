#! /usr/bin/env node

import { Command } from 'commander';

import { registerNewCommand } from './commands/new/new';

const program = new Command();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const version = require('../package.json').version;

program.version(version).description('The Vendure CLI');
registerNewCommand(program);

void program.parseAsync(process.argv);
