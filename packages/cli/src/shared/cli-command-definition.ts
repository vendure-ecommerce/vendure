export interface CliCommandOption {
    long: string;
    short?: string;
    description: string;
    required?: boolean;
    defaultValue?: any;
    subOptions?: CliCommandOption[]; // Options that are only valid when this option is used
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
