import { VendurePluginRef } from './vendure-plugin-ref';

export type CommandCategory =
    | `Plugin`
    | `Plugin: UI`
    | `Plugin: Entity`
    | `Plugin: Service`
    | `Plugin: API`
    | `Project: Codegen`
    | `Other`;

export interface BaseCliCommandOptions {
    plugin?: VendurePluginRef;
}

export interface CliCommandOptions<T extends BaseCliCommandOptions, R> {
    id: string;
    category: CommandCategory;
    description: string;
    run: (options?: Partial<T>) => Promise<R>;
}

export class CliCommand<T extends Record<string, any>, R = void> {
    constructor(private options: CliCommandOptions<T, R>) {}

    get id() {
        return this.options.id;
    }

    get category() {
        return this.options.category;
    }

    get description() {
        return this.options.description;
    }

    run(options?: Partial<T>) {
        return this.options.run(options);
    }
}
