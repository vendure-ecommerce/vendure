import { addApiExtensionCommand } from './api-extension/add-api-extension';
import { addCodegenCommand } from './codegen/add-codegen';
import { addEntityCommand } from './entity/add-entity';
import { addJobQueueCommand } from './job-queue/add-job-queue';
import { createNewPluginCommand } from './plugin/create-new-plugin';
import { addServiceCommand } from './service/add-service';
import { addUiExtensionsCommand } from './ui-extensions/add-ui-extensions';

// The set of mutually-exclusive operations that can be performed in a non-interactive call to the `add` command.
export interface AddOperationOptions {
    /** Create a new plugin with the given name */
    plugin?: string;
    /** Add a new entity class with the given name */
    entity?: string;
    /** Add a new service with the given name */
    service?: string;
    /** Add a job-queue handler to the specified plugin */
    'job-queue'?: string | boolean;
    /** Add GraphQL codegen configuration to the specified plugin */
    codegen?: string | boolean;
    /** Add an API extension scaffold to the specified plugin */
    'api-extension'?: string | boolean;
    /** Add Admin-UI or Storefront UI extensions to the specified plugin */
    'ui-extensions'?: string | boolean;
    /** Specify the path to a custom Vendure config file */
    config?: string;
    /** Name for the job queue (used with jobQueue) */
    name?: string;
    /** Name for the query (used with apiExtension) */
    'query-name'?: string;
    /** Name for the mutation (used with apiExtension) */
    'mutation-name'?: string;
    /** Name of the service to use (used with jobQueue) */
    'selected-service'?: string;
    /** Selected plugin name for entity/service commands */
    'selected-plugin'?: string;
    /** Add custom fields support to entity */
    'custom-fields'?: boolean;
    /** Make entity translatable */
    translatable?: boolean;
    /** Service type: basic or entity */
    type?: string;
    /** Selected entity name for entity service commands */
    'selected-entity'?: string;
}

export interface AddOperationResult {
    success: boolean;
    message: string;
}

/**
 * Determines which sub-command to execute based on the provided options and
 * delegates the work to that command's `run()` function. The interactive prompts
 * inside the sub-command will only be shown for data that is still missing – so
 * callers can supply as many or as few options as they need.
 */
export async function performAddOperation(options: AddOperationOptions): Promise<AddOperationResult> {
    try {
        // Figure out which flag was set. They are mutually exclusive: the first
        // truthy option determines the sub-command we run.
        if (options.plugin) {
            // Validate that a plugin name was provided
            if (typeof options.plugin !== 'string' || !options.plugin.trim()) {
                throw new Error('Plugin name is required. Usage: vendure add -p <plugin-name>');
            }
            await createNewPluginCommand.run({ name: options.plugin, config: options.config });
            return {
                success: true,
                message: `Plugin "${options.plugin}" created successfully`,
            };
        }
        if (options.entity) {
            // Validate that an entity name was provided
            if (typeof options.entity !== 'string' || !options.entity.trim()) {
                throw new Error(
                    'Entity name is required. Usage: vendure add -e <entity-name> --selected-plugin <plugin-name>',
                );
            }
            // Validate that a plugin name was provided for non-interactive mode
            if (
                !options['selected-plugin'] ||
                typeof options['selected-plugin'] !== 'string' ||
                !options['selected-plugin'].trim()
            ) {
                throw new Error(
                    'Plugin name is required when running in non-interactive mode. Usage: vendure add -e <entity-name> --selected-plugin <plugin-name>',
                );
            }
            // Pass the class name and plugin name with additional options
            await addEntityCommand.run({
                className: options.entity,
                isNonInteractive: true,
                config: options.config,
                pluginName: options['selected-plugin'],
                customFields: options['custom-fields'],
                translatable: options.translatable,
            });
            return {
                success: true,
                message: `Entity "${options.entity}" added successfully to plugin "${options['selected-plugin']}"`,
            };
        }
        if (options.service) {
            // Validate that a service name was provided
            if (typeof options.service !== 'string' || !options.service.trim()) {
                throw new Error(
                    'Service name is required. Usage: vendure add -s <service-name> --selected-plugin <plugin-name>',
                );
            }
            // Validate that a plugin name was provided for non-interactive mode
            if (
                !options['selected-plugin'] ||
                typeof options['selected-plugin'] !== 'string' ||
                !options['selected-plugin'].trim()
            ) {
                throw new Error(
                    'Plugin name is required when running in non-interactive mode. Usage: vendure add -s <service-name> --selected-plugin <plugin-name>',
                );
            }
            await addServiceCommand.run({
                serviceName: options.service,
                isNonInteractive: true,
                config: options.config,
                pluginName: options['selected-plugin'],
                serviceType: options['selected-entity'] ? 'entity' : options.type || 'basic',
                selectedEntityName: options['selected-entity'],
            });
            return {
                success: true,
                message: `Service "${options.service}" added successfully to plugin "${options['selected-plugin']}"`,
            };
        }
        if (options['job-queue']) {
            const pluginName = typeof options['job-queue'] === 'string' ? options['job-queue'] : undefined;
            // Validate required parameters for job queue
            if (!options.name || typeof options.name !== 'string' || !options.name.trim()) {
                throw new Error(
                    'Job queue name is required. Usage: vendure add -j [plugin-name] --name <job-name>',
                );
            }
            if (
                !options['selected-service'] ||
                typeof options['selected-service'] !== 'string' ||
                !options['selected-service'].trim()
            ) {
                throw new Error(
                    'Service name is required for job queue. Usage: vendure add -j [plugin-name] --name <job-name> --selected-service <service-name>',
                );
            }
            await addJobQueueCommand.run({
                isNonInteractive: true,
                config: options.config,
                pluginName,
                name: options.name,
                selectedService: options['selected-service'],
            });
            return {
                success: true,
                message: 'Job-queue feature added successfully',
            };
        }
        if (options.codegen) {
            const pluginName = typeof options.codegen === 'string' ? options.codegen : undefined;
            // For codegen, if a boolean true is passed, plugin selection will be handled interactively
            // If a string is passed, it should be a valid plugin name
            if (typeof options.codegen === 'string' && !options.codegen.trim()) {
                throw new Error(
                    'Plugin name cannot be empty when specified. Usage: vendure add --codegen [plugin-name]',
                );
            }
            await addCodegenCommand.run({
                isNonInteractive: true,
                config: options.config,
                pluginName,
            });
            return {
                success: true,
                message: 'Codegen configuration added successfully',
            };
        }
        if (options['api-extension']) {
            const pluginName =
                typeof options['api-extension'] === 'string' ? options['api-extension'] : undefined;
            // Validate that at least one of queryName or mutationName is provided and not empty
            const hasValidQueryName =
                options['query-name'] &&
                typeof options['query-name'] === 'string' &&
                options['query-name'].trim() !== '';
            const hasValidMutationName =
                options['mutation-name'] &&
                typeof options['mutation-name'] === 'string' &&
                options['mutation-name'].trim() !== '';

            if (!hasValidQueryName && !hasValidMutationName) {
                throw new Error(
                    'At least one of query-name or mutation-name must be specified as a non-empty string. ' +
                        'Usage: vendure add -a [plugin-name] --query-name <name> --mutation-name <name>',
                );
            }

            // If a string is passed for apiExtension, it should be a valid plugin name
            if (typeof options['api-extension'] === 'string' && !options['api-extension'].trim()) {
                throw new Error(
                    'Plugin name cannot be empty when specified. ' +
                        'Usage: vendure add -a [plugin-name] --query-name <name> --mutation-name <name>',
                );
            }

            await addApiExtensionCommand.run({
                isNonInteractive: true,
                config: options.config,
                pluginName,
                'query-name': options['query-name'],
                'mutation-name': options['mutation-name'],
                'selected-service': options['selected-service'],
            });
            return {
                success: true,
                message: 'API extension scaffold added successfully',
            };
        }
        if (options['ui-extensions']) {
            const pluginName =
                typeof options['ui-extensions'] === 'string' ? options['ui-extensions'] : undefined;
            // For UI extensions, if a boolean true is passed, plugin selection will be handled interactively
            // If a string is passed, it should be a valid plugin name
            if (typeof options['ui-extensions'] === 'string' && !options['ui-extensions'].trim()) {
                throw new Error(
                    'Plugin name cannot be empty when specified. Usage: vendure add --ui-extensions [plugin-name]',
                );
            }
            await addUiExtensionsCommand.run({
                isNonInteractive: true,
                config: options.config,
                pluginName,
            });
            return {
                success: true,
                message: 'UI extensions added successfully',
            };
        }

        return {
            success: false,
            message: 'No valid add operation specified',
        };
    } catch (error: any) {
        // Re-throw validation errors so they can be properly handled with stack trace
        if (
            error.message.includes('is required') ||
            error.message.includes('cannot be empty') ||
            error.message.includes('must be specified')
        ) {
            throw error;
        }
        return {
            success: false,
            message: error.message ?? 'Add operation failed',
        };
    }
}
