#! /usr/bin/env node

import { Command } from 'commander';

import { registerCommand as registerPluginCommand } from './commands/plugin/index';

const program = new Command();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const version = require('../package.json').version;

program.version(version).description('The Vendure CLI');
registerPluginCommand(program);

program.parse(process.argv);
