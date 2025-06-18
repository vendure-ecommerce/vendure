import { log } from '@clack/prompts';

import { CliCommandDefinition } from '../shared/cli-command-definition';

export const cliCommands: CliCommandDefinition[] = [
    {
        name: 'add',
        description: 'Add a feature to your Vendure project',
        action: async () => {
            const { addCommand } = await import('./add/add');
            await addCommand();
            process.exit(0);
        },
    },
    {
        name: 'migrate',
        description: 'Generate, run or revert a database migration',
        options: [
            {
                flag: '-g, --generate <name>',
                description: 'Generate a new migration with the specified name',
                required: false,
            },
            {
                flag: '-r, --run',
                description: 'Run pending migrations',
                required: false,
            },
            {
                flag: '--revert',
                description: 'Revert the last migration',
                required: false,
            },
            {
                flag: '-o, --output-dir <path>',
                description: 'Output directory for generated migrations',
                required: false,
            },
        ],
        action: async options => {
            const { migrateCommand } = await import('./migrate/migrate');
            await migrateCommand(options);
            process.exit(0);
        },
    },
    // Example of a command with options
    {
        name: 'example',
        description: 'Example command with options',
        options: [
            {
                flag: '-f, --file <path>',
                description: 'Path to the file',
                required: true,
            },
            {
                flag: '-v, --verbose',
                description: 'Enable verbose output',
                required: false,
                defaultValue: false,
            },
        ],
        action: options => {
            // Example action implementation with options
            log.info('Example command executed');
            if (options) {
                // Validate required options
                if (!options.file) {
                    log.error('Error: --file option is required');
                    process.exit(1);
                }
                log.info(`File path: ${String(options.file)}`);
                log.info(`Verbose mode: ${String(options.verbose)}`);
            }
            process.exit(0);
        },
    },
];
