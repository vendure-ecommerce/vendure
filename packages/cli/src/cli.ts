#! /usr/bin/env node

import { Command } from 'commander';
import pc from 'picocolors';

const program = new Command();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const version = require('../package.json').version;

program
    .version(version)
    .usage(`vendure <command>`)
    .description(
        pc.blue(`
                                888                          
                                888                          
                                888                          
888  888  .d88b.  88888b.   .d88888 888  888 888d888 .d88b.  
888  888 d8P  Y8b 888 "88b d88" 888 888  888 888P"  d8P  Y8b 
Y88  88P 88888888 888  888 888  888 888  888 888    88888888 
 Y8bd8P  Y8b.     888  888 Y88b 888 Y88b 888 888    Y8b.     
  Y88P    "Y8888  888  888  "Y88888  "Y88888 888     "Y8888                             
`),
    );

program
    .command('add')
    .description('Add a feature to your Vendure project')
    .action(async () => {
        const { addCommand } = await import('./commands/add/add');
        await addCommand();
        process.exit(0);
    });

program
    .command('migrate')
    .description('Generate, run or revert a database migration')
    .action(async () => {
        const { migrateCommand } = await import('./commands/migrate/migrate');
        await migrateCommand();
        process.exit(0);
    });

void program.parseAsync(process.argv);
