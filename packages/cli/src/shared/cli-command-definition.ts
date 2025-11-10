export interface CliCommandOption {
    long: string;
    short?: string;
    description: string;
    required?: boolean;
    defaultValue?: any;
    subOptions?: CliCommandOption[]; // Options that are only valid when this option is used
    // Interactive mode metadata
    interactiveId?: string; // ID for interactive selection (e.g., 'add-entity')
    interactiveCategory?: string; // Category label (e.g., 'Plugin: Entity')
    interactiveFn?: () => Promise<any>; // Function to execute in interactive mode
}

export interface CliCommandDefinition {
    name: string;
    description: string;
    options?: CliCommandOption[];
    action: (options?: Record<string, any>) => Promise<void>;
}

export interface CliCommandConfig {
    commands: CliCommandDefinition[];
}
