export interface CliCommandOption {
    flag: string;
    description: string;
    required?: boolean;
    defaultValue?: any;
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
