#! /usr/bin/env node

import { Command } from 'commander';

import { registerAddCommand } from './commands/add/add';

const program = new Command();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const version = require('../package.json').version;

program.version(version).description('The Vendure CLI');

registerAddCommand(program);

void program.parseAsync(process.argv);
