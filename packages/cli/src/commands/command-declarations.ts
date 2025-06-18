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
