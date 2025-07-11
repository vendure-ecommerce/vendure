import { log } from '@clack/prompts';
import pc from 'picocolors';

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
    jobQueue?: string | boolean;
    /** Add GraphQL codegen configuration to the specified plugin */
    codegen?: string | boolean;
    /** Add an API extension scaffold to the specified plugin */
    apiExtension?: string | boolean;
    /** Add Admin-UI or Storefront UI extensions to the specified plugin */
    uiExtensions?: string | boolean;
    /** Specify the path to a custom Vendure config file */
    config?: string;
    /** Name for the job queue (used with jobQueue) */
    name?: string;
    /** Name for the query (used with apiExtension) */
    queryName?: string;
    /** Name for the mutation (used with apiExtension) */
    mutationName?: string;
    /** Name of the service to use (used with jobQueue) */
    selectedService?: string;
    /** Selected plugin name for entity/service commands */
    selectedPlugin?: string;
    /** Add custom fields support to entity */
    customFields?: boolean;
    /** Make entity translatable */
    translatable?: boolean;
    /** Service type: basic or entity */
    type?: string;
    /** Selected entity name for entity service commands */
    selectedEntity?: string;
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
                !options.selectedPlugin ||
                typeof options.selectedPlugin !== 'string' ||
                !options.selectedPlugin.trim()
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
                pluginName: options.selectedPlugin,
                customFields: options.customFields,
                translatable: options.translatable,
            });
            return {
                success: true,
                message: `Entity "${options.entity}" added successfully to plugin "${options.selectedPlugin}"`,
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
                !options.selectedPlugin ||
                typeof options.selectedPlugin !== 'string' ||
                !options.selectedPlugin.trim()
            ) {
                throw new Error(
                    'Plugin name is required when running in non-interactive mode. Usage: vendure add -s <service-name> --selected-plugin <plugin-name>',
                );
            }
            await addServiceCommand.run({
                serviceName: options.service,
                isNonInteractive: true,
                config: options.config,
                pluginName: options.selectedPlugin,
                serviceType: options.selectedEntity ? 'entity' : options.type || 'basic',
                selectedEntityName: options.selectedEntity,
            });
            return {
                success: true,
                message: `Service "${options.service}" added successfully to plugin "${options.selectedPlugin}"`,
            };
        }
        if (options.jobQueue) {
            const pluginName = typeof options.jobQueue === 'string' ? options.jobQueue : undefined;
            // Validate required parameters for job queue
            if (!options.name || typeof options.name !== 'string' || !options.name.trim()) {
                throw new Error(
                    'Job queue name is required. Usage: vendure add -j [plugin-name] --name <job-name>',
                );
            }
            if (
                !options.selectedService ||
                typeof options.selectedService !== 'string' ||
                !options.selectedService.trim()
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
                selectedService: options.selectedService,
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
        if (options.apiExtension) {
            const pluginName = typeof options.apiExtension === 'string' ? options.apiExtension : undefined;
            // Validate that at least one of queryName or mutationName is provided and not empty
            const hasValidQueryName =
                options.queryName && typeof options.queryName === 'string' && options.queryName.trim() !== '';
            const hasValidMutationName =
                options.mutationName &&
                typeof options.mutationName === 'string' &&
                options.mutationName.trim() !== '';

            if (!hasValidQueryName && !hasValidMutationName) {
                throw new Error(
                    'At least one of query-name or mutation-name must be specified as a non-empty string. ' +
                        'Usage: vendure add -a [plugin-name] --query-name <name> --mutation-name <name>',
                );
            }

            // If a string is passed for apiExtension, it should be a valid plugin name
            if (typeof options.apiExtension === 'string' && !options.apiExtension.trim()) {
                throw new Error(
                    'Plugin name cannot be empty when specified. ' +
                        'Usage: vendure add -a [plugin-name] --query-name <name> --mutation-name <name>',
                );
            }

            await addApiExtensionCommand.run({
                isNonInteractive: true,
                config: options.config,
                pluginName,
                queryName: options.queryName,
                mutationName: options.mutationName,
                selectedService: options.selectedService,
            });
            return {
                success: true,
                message: 'API extension scaffold added successfully',
            };
        }
        if (options.uiExtensions) {
            const pluginName = typeof options.uiExtensions === 'string' ? options.uiExtensions : undefined;
            // For UI extensions, if a boolean true is passed, plugin selection will be handled interactively
            // If a string is passed, it should be a valid plugin name
            if (typeof options.uiExtensions === 'string' && !options.uiExtensions.trim()) {
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
        // For other errors, log them in a more user-friendly way
        // For validation errors, show the full error with stack trace
        if (error.message.includes('Plugin name is required')) {
            // Extract error message and stack trace
            const errorMessage = error.message;
            const stackLines = error.stack.split('\n');
            const stackTrace = stackLines.slice(1).join('\n'); // Remove first line (error message)

            // Display stack trace first, then colored error message at the end
            log.error(stackTrace);
            log.error(''); // Add empty line for better readability
            log.error(pc.red('Error:') + ' ' + String(errorMessage));
        } else {
            log.error(error.message as string);
            if (error.stack) {
                log.error(error.stack);
            }
        }
        process.exit(1);
    }
}
