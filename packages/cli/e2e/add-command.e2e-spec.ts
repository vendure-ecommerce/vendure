/*
 * E2E tests for the add command
 *
 * To run these tests:
 * npm run vitest -- --config e2e/vitest.e2e.config.mts
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { performAddOperation } from '../src/commands/add/add-operations';
import { addApiExtensionCommand } from '../src/commands/add/api-extension/add-api-extension';
import { addCodegenCommand } from '../src/commands/add/codegen/add-codegen';
import { addEntityCommand } from '../src/commands/add/entity/add-entity';
import { addJobQueueCommand } from '../src/commands/add/job-queue/add-job-queue';
import { createNewPluginCommand } from '../src/commands/add/plugin/create-new-plugin';
import { addServiceCommand } from '../src/commands/add/service/add-service';
import { addUiExtensionsCommand } from '../src/commands/add/ui-extensions/add-ui-extensions';

type Spy = ReturnType<typeof vi.spyOn>;

/**
 * Utility to stub the `run` function of a CliCommand so that the command
 * doesn't actually execute any file-system or project manipulation during the
 * tests. The stub resolves immediately, emulating a successful CLI command.
 */
function stubRun(cmd: { run: (...args: any[]) => any }): Spy {
    // Cast to 'any' to avoid over-constraining the generic type parameters that
    // vitest uses on spyOn, which causes type inference issues in strict mode.
    // The runtime behaviour (spying on an object method) is what matters for
    // these tests – the precise compile-time types are not important.
    return vi
        .spyOn(cmd as any, 'run')
        .mockResolvedValue({ project: undefined, modifiedSourceFiles: [] } as any);
}

let pluginRunSpy: Spy;
let entityRunSpy: Spy;
let serviceRunSpy: Spy;
let jobQueueRunSpy: Spy;
let codegenRunSpy: Spy;
let apiExtRunSpy: Spy;
let uiExtRunSpy: Spy;

beforeEach(() => {
    // Stub all sub-command `run` handlers before every test
    pluginRunSpy = stubRun(createNewPluginCommand);
    entityRunSpy = stubRun(addEntityCommand);
    serviceRunSpy = stubRun(addServiceCommand);
    jobQueueRunSpy = stubRun(addJobQueueCommand);
    codegenRunSpy = stubRun(addCodegenCommand);
    apiExtRunSpy = stubRun(addApiExtensionCommand);
    uiExtRunSpy = stubRun(addUiExtensionsCommand);
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('Add Command E2E', () => {
    describe('performAddOperation', () => {
        it('creates a plugin when the "plugin" option is provided', async () => {
            const result = await performAddOperation({ plugin: 'test-plugin' });

            expect(pluginRunSpy).toHaveBeenCalledOnce();
            expect(pluginRunSpy).toHaveBeenCalledWith({ name: 'test-plugin', config: undefined });
            expect(result.success).toBe(true);
            expect(result.message).toContain('test-plugin');
        });

        it('throws when the plugin name is empty', async () => {
            await expect(performAddOperation({ plugin: '   ' } as any)).rejects.toThrow(
                'Plugin name is required',
            );
            expect(pluginRunSpy).not.toHaveBeenCalled();
        });

        it('adds an entity to the specified plugin', async () => {
            const result = await performAddOperation({
                entity: 'MyEntity',
                selectedPlugin: 'MyPlugin',
            });

            expect(entityRunSpy).toHaveBeenCalledOnce();
            expect(entityRunSpy).toHaveBeenCalledWith({
                className: 'MyEntity',
                isNonInteractive: true,
                config: undefined,
                pluginName: 'MyPlugin',
                customFields: undefined,
                translatable: undefined,
            });
            expect(result.success).toBe(true);
            expect(result.message).toContain('MyEntity');
            expect(result.message).toContain('MyPlugin');
        });

        it('fails when adding an entity without specifying a plugin in non-interactive mode', async () => {
            await expect(performAddOperation({ entity: 'MyEntity' })).rejects.toThrow(
                'Plugin name is required when running in non-interactive mode',
            );
            expect(entityRunSpy).not.toHaveBeenCalled();
        });

        it('adds a service to the specified plugin', async () => {
            const result = await performAddOperation({
                service: 'MyService',
                selectedPlugin: 'MyPlugin',
            });

            expect(serviceRunSpy).toHaveBeenCalledOnce();
            expect(serviceRunSpy.mock.calls[0][0]).toMatchObject({
                serviceName: 'MyService',
                pluginName: 'MyPlugin',
            });
            expect(result.success).toBe(true);
            expect(result.message).toContain('MyService');
        });

        it('adds a job-queue when required parameters are provided', async () => {
            const options = {
                jobQueue: 'MyPlugin',
                name: 'ReindexJob',
                selectedService: 'SearchService',
            } as const;
            const result = await performAddOperation(options);

            expect(jobQueueRunSpy).toHaveBeenCalledOnce();
            expect(jobQueueRunSpy.mock.calls[0][0]).toMatchObject({
                pluginName: 'MyPlugin',
                name: 'ReindexJob',
                selectedService: 'SearchService',
            });
            expect(result.success).toBe(true);
            expect(result.message).toContain('Job-queue');
        });

        it('fails when job-queue parameters are incomplete', async () => {
            await expect(
                performAddOperation({ jobQueue: true, name: 'JobWithoutService' } as any),
            ).rejects.toThrow('Service name is required for job queue');
            expect(jobQueueRunSpy).not.toHaveBeenCalled();
        });

        it('adds codegen configuration with boolean flag (interactive plugin selection)', async () => {
            const result = await performAddOperation({ codegen: true });

            expect(codegenRunSpy).toHaveBeenCalledOnce();
            expect(codegenRunSpy.mock.calls[0][0]).toMatchObject({ pluginName: undefined });
            expect(result.success).toBe(true);
            expect(result.message).toContain('Codegen');
        });

        it('adds codegen configuration to a specific plugin when plugin name is supplied', async () => {
            const result = await performAddOperation({ codegen: 'MyPlugin' });

            expect(codegenRunSpy).toHaveBeenCalledOnce();
            expect(codegenRunSpy.mock.calls[0][0]).toMatchObject({ pluginName: 'MyPlugin' });
            expect(result.success).toBe(true);
        });

        it('adds an API extension scaffold when queryName is provided', async () => {
            const result = await performAddOperation({
                apiExtension: 'MyPlugin',
                queryName: 'myQuery',
            });

            expect(apiExtRunSpy).toHaveBeenCalledOnce();
            expect(apiExtRunSpy.mock.calls[0][0]).toMatchObject({
                pluginName: 'MyPlugin',
                queryName: 'myQuery',
                mutationName: undefined,
            });
            expect(result.success).toBe(true);
        });

        it('fails when neither queryName nor mutationName is provided for API extension', async () => {
            await expect(performAddOperation({ apiExtension: true } as any)).rejects.toThrow(
                'At least one of query-name or mutation-name must be specified',
            );
            expect(apiExtRunSpy).not.toHaveBeenCalled();
        });

        it('adds UI extensions when the uiExtensions flag is used', async () => {
            const result = await performAddOperation({ uiExtensions: 'MyPlugin' });

            expect(uiExtRunSpy).toHaveBeenCalledOnce();
            expect(uiExtRunSpy.mock.calls[0][0]).toMatchObject({ pluginName: 'MyPlugin' });
            expect(result.success).toBe(true);
            expect(result.message).toContain('UI extensions');
        });

        it('returns a failure result when no valid operation is specified', async () => {
            const result = await performAddOperation({});

            expect(result.success).toBe(false);
            expect(result.message).toContain('No valid add operation specified');
            expect(pluginRunSpy).not.toHaveBeenCalled();
            expect(entityRunSpy).not.toHaveBeenCalled();
            expect(serviceRunSpy).not.toHaveBeenCalled();
        });
    });
});
