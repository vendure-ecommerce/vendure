import { CliCommandDefinition } from '../shared/cli-command-definition';

export const cliCommands: CliCommandDefinition[] = [
    {
        name: 'add',
        description: 'Add a feature to your Vendure project',
        options: [
            {
                short: '-p',
                long: '--plugin <name>',
                description: 'Create a new plugin with the specified name',
                required: false,
            },
            {
                short: '-e',
                long: '--entity <name>',
                description: 'Add a new entity with the specified class name',
                required: false,
            },
            {
                short: '-s',
                long: '--service <name>',
                description: 'Add a new service with the specified class name',
                required: false,
            },
            {
                short: '-j',
                long: '--job-queue',
                description: 'Add job-queue support',
                required: false,
            },
            {
                short: '-c',
                long: '--codegen',
                description: 'Add GraphQL codegen configuration',
                required: false,
            },
            {
                short: '-a',
                long: '--api-extension',
                description: 'Add an API extension scaffold',
                required: false,
            },
            {
                short: '-u',
                long: '--ui-extensions',
                description: 'Add admin-UI / storefront UI extensions setup',
                required: false,
            },
        ],
        action: async options => {
            const { addCommand } = await import('./add/add');
            await addCommand(options);
            process.exit(0);
        },
    },
    {
        name: 'migrate',
        description: 'Generate, run or revert a database migration',
        options: [
            {
                short: '-g',
                long: '--generate <name>',
                description: 'Generate a new migration with the specified name',
                required: false,
            },
            {
                short: '-r',
                long: '--run',
                description: 'Run pending migrations',
                required: false,
            },
            {
                long: '--revert',
                description: 'Revert the last migration',
                required: false,
            },
            {
                short: '-o',
                long: '--output-dir <path>',
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
];
