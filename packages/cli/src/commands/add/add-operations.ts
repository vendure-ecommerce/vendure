import { log } from '@clack/prompts';

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
            await createNewPluginCommand.run({ name: options.plugin, config: options.config });
            return {
                success: true,
                message: `Plugin \"${options.plugin}\" created successfully`,
            };
        }
        if (options.entity) {
            // We pass the class name; the command will prompt for plugin etc. if needed.
            await addEntityCommand.run({ className: options.entity });
            return {
                success: true,
                message: `Entity \"${options.entity}\" added successfully`,
            };
        }
        if (options.service) {
            await addServiceCommand.run({ serviceName: options.service });
            return {
                success: true,
                message: `Service \"${options.service}\" added successfully`,
            };
        }
        if (options.jobQueue) {
            const pluginName = typeof options.jobQueue === 'string' ? options.jobQueue : undefined;
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
            await addApiExtensionCommand.run({
                isNonInteractive: true,
                config: options.config,
                pluginName,
                queryName: options.queryName,
                mutationName: options.mutationName,
            });
            return {
                success: true,
                message: 'API extension scaffold added successfully',
            };
        }
        if (options.uiExtensions) {
            const pluginName = typeof options.uiExtensions === 'string' ? options.uiExtensions : undefined;
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
        log.error(error.message);
        if (error.stack) {
            log.error(error.stack);
        }
        return {
            success: false,
            message: error.message || 'Add operation failed',
        };
    }
}
