# Vendure CLI Command Structure

This document describes the new array-based CLI command structure that allows for easy declaration and management of CLI commands.

## Overview

The CLI now uses a structured approach where all commands are defined in an array of `CliCommandDefinition` objects, making it easy to add, remove, and modify commands.

## Command Definition Interface

```typescript
interface CliCommandDefinition {
    name: string;                    // The command name (e.g., 'add', 'migrate')
    description: string;             // Command description shown in help
    options?: CliCommandOption[];    // Optional array of command options
    action: (options?: Record<string, any>) => Promise<void>; // Command implementation
}
```

## Option Definition Interface

```typescript
interface CliCommandOption {
    flag: string;                    // Option flag (e.g., '-f, --file <path>')
    description: string;             // Option description
    required?: boolean;              // Whether the option is required
    defaultValue?: any;              // Default value for the option
}
```

## Adding New Commands

To add a new command, simply add it to the `cliCommands` array in `packages/cli/src/commands/command-declarations.ts`:

```typescript
export const cliCommands: CliCommandDefinition[] = [
    // ... existing commands ...
    {
        name: 'new-command',
        description: 'Description of the new command',
        options: [
            {
                flag: '-o, --option <value>',
                description: 'Description of the option',
                required: true,
            },
        ],
        action: async (options) => {
            // Command implementation
            console.log('Command executed with options:', options);
            process.exit(0);
        },
    },
];
```

## Examples

### Simple Command (No Options)
```typescript
{
    name: 'add',
    description: 'Add a feature to your Vendure project',
    action: async () => {
        const { addCommand } = await import('./add/add');
        await addCommand();
        process.exit(0);
    },
}
```

### Command with Options
```typescript
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
        if (options) {
            console.log('File path:', options.file);
            console.log('Verbose mode:', options.verbose);
        }
        process.exit(0);
    },
}
```

## Benefits

1. **Centralized Management**: All commands are defined in one place
2. **Type Safety**: Full TypeScript support with proper interfaces
3. **Easy Extension**: Adding new commands is straightforward
4. **Consistent Structure**: All commands follow the same pattern
5. **Option Support**: Built-in support for command options with validation

## File Structure

- `packages/cli/src/shared/cli-command-definition.ts` - Interface definitions
- `packages/cli/src/shared/command-registry.ts` - Command registration utility
- `packages/cli/src/commands/command-declarations.ts` - Command declarations array
- `packages/cli/src/cli.ts` - Main CLI entry point 