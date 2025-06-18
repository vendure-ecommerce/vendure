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
        action: async () => {
            const { migrateCommand } = await import('./migrate/migrate');
            await migrateCommand();
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
        action: async (options) => {
            // Example action implementation with options
            console.log('Example command executed');
            if (options) {
                // Validate required options
                if (!options.file) {
                    console.error('Error: --file option is required');
                    process.exit(1);
                }
                console.log('File path:', options.file);
                console.log('Verbose mode:', options.verbose);
            }
            process.exit(0);
        },
    },
]; 