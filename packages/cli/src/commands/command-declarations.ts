import { CliCommandDefinition } from '../shared/cli-command-definition';

export const cliCommands: CliCommandDefinition[] = [
    {
        name: 'add',
        description: 'Add a feature to your Vendure project',
        options: [
            {
                long: '--config <path>',
                description: 'Specify the path to a custom Vendure config file',
                required: false,
            },
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
                subOptions: [
                    {
                        long: '--selected-plugin <name>',
                        description: 'Name of the plugin to add the entity to (required with -e)',
                        required: false,
                    },
                    {
                        long: '--custom-fields',
                        description: 'Add custom fields support to the entity',
                        required: false,
                    },
                    {
                        long: '--translatable',
                        description: 'Make the entity translatable',
                        required: false,
                    },
                ],
            },
            {
                short: '-s',
                long: '--service <name>',
                description: 'Add a new service with the specified class name',
                required: false,
                subOptions: [
                    {
                        long: '--selected-plugin <name>',
                        description: 'Name of the plugin to add the service to (required with -s)',
                        required: false,
                    },
                    {
                        long: '--type <type>',
                        description: 'Type of service: basic or entity (default: basic)',
                        required: false,
                    },
                    {
                        long: '--selected-entity <n>',
                        description:
                            'Name of the entity for entity service (automatically sets type to entity)',
                        required: false,
                    },
                ],
            },
            {
                short: '-j',
                long: '--job-queue [plugin]',
                description: 'Add job-queue support to the specified plugin',
                required: false,
                subOptions: [
                    {
                        long: '--name <name>',
                        description: 'Name for the job queue (required with -j)',
                        required: false,
                    },
                    {
                        long: '--selected-service <name>',
                        description: 'Name of the service to add the job queue to (required with -j)',
                        required: false,
                    },
                ],
            },
            {
                short: '-c',
                long: '--codegen [plugin]',
                description: 'Add GraphQL codegen configuration to the specified plugin',
                required: false,
            },
            {
                short: '-a',
                long: '--api-extension [plugin]',
                description: 'Add an API extension scaffold to the specified plugin',
                required: false,
                subOptions: [
                    {
                        long: '--query-name <name>',
                        description: 'Name for the query (used with -a)',
                        required: false,
                    },
                    {
                        long: '--mutation-name <name>',
                        description: 'Name for the mutation (used with -a)',
                        required: false,
                    },
                    {
                        long: '--selected-service <name>',
                        description: 'Name of the service to add the API extension to (required with -a)',
                        required: false,
                    },
                ],
            },
            {
                short: '-u',
                long: '--ui-extensions [plugin]',
                description: 'Add Admin UI extensions setup to the specified plugin',
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
