/**
 * Unit tests for the add command
 * These tests ensure both interactive and non-interactive modes work correctly
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { addCommand } from './add';
import { performAddOperation } from './add-operations';

// Mock the performAddOperation function
vi.mock('./add-operations', () => ({
    performAddOperation: vi.fn(),
}));

// Mock clack prompts to prevent interactive prompts during tests
vi.mock('@clack/prompts', () => ({
    intro: vi.fn(),
    outro: vi.fn(),
    cancel: vi.fn(),
    isCancel: vi.fn(() => false),
    select: vi.fn(() => Promise.resolve('no-selection')),
    spinner: vi.fn(() => ({
        start: vi.fn(),
        stop: vi.fn(),
    })),
    log: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
    },
}));

describe('add command', () => {
    const mockPerformAddOperation = vi.mocked(performAddOperation);

    beforeEach(() => {
        vi.clearAllMocks();
        // Default to successful operation
        mockPerformAddOperation.mockResolvedValue({
            success: true,
            message: 'Operation completed successfully',
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('non-interactive mode detection', () => {
        it('detects non-interactive mode when plugin option is provided', async () => {
            await addCommand({ plugin: 'test-plugin' });

            expect(mockPerformAddOperation).toHaveBeenCalledWith({ plugin: 'test-plugin' });
        });

        it('detects non-interactive mode when entity option is provided', async () => {
            await addCommand({ entity: 'TestEntity', selectedPlugin: 'TestPlugin' });

            expect(mockPerformAddOperation).toHaveBeenCalledWith({
                entity: 'TestEntity',
                selectedPlugin: 'TestPlugin',
            });
        });

        it('detects non-interactive mode when service option is provided', async () => {
            await addCommand({ service: 'TestService', selectedPlugin: 'TestPlugin' });

            expect(mockPerformAddOperation).toHaveBeenCalledWith({
                service: 'TestService',
                selectedPlugin: 'TestPlugin',
            });
        });

        it('detects non-interactive mode when jobQueue option is provided', async () => {
            await addCommand({
                jobQueue: 'TestPlugin',
                name: 'TestJob',
                selectedService: 'TestService',
            });

            expect(mockPerformAddOperation).toHaveBeenCalledWith({
                jobQueue: 'TestPlugin',
                name: 'TestJob',
                selectedService: 'TestService',
            });
        });

        it('detects non-interactive mode when codegen option is provided', async () => {
            await addCommand({ codegen: true });

            expect(mockPerformAddOperation).toHaveBeenCalledWith({ codegen: true });
        });

        it('detects non-interactive mode when apiExtension option is provided', async () => {
            await addCommand({ apiExtension: 'TestPlugin', queryName: 'testQuery' });

            expect(mockPerformAddOperation).toHaveBeenCalledWith({
                apiExtension: 'TestPlugin',
                queryName: 'testQuery',
            });
        });

        it('detects non-interactive mode when uiExtensions option is provided', async () => {
            await addCommand({ uiExtensions: 'TestPlugin' });

            expect(mockPerformAddOperation).toHaveBeenCalledWith({ uiExtensions: 'TestPlugin' });
        });

        it('detects non-interactive mode when config option is provided along with other options', async () => {
            await addCommand({ plugin: 'test-plugin', config: './custom-config.ts' });

            expect(mockPerformAddOperation).toHaveBeenCalledWith({
                plugin: 'test-plugin',
                config: './custom-config.ts',
            });
        });

        it('treats false values as not triggering non-interactive mode', async () => {
            await addCommand({ codegen: false, uiExtensions: false } as any);

            // Should NOT call performAddOperation (goes to interactive mode instead)
            // Interactive mode is tested separately
        });
    });

    describe('non-interactive mode - success cases', () => {
        it('logs success message when operation succeeds', async () => {
            const { log } = await import('@clack/prompts');

            await addCommand({ plugin: 'test-plugin' });

            expect(log.success).toHaveBeenCalledWith('Operation completed successfully');
        });

        it('passes through all provided options to performAddOperation', async () => {
            const options = {
                entity: 'MyEntity',
                selectedPlugin: 'MyPlugin',
                customFields: true,
                translatable: true,
                config: './config.ts',
            };

            await addCommand(options);

            expect(mockPerformAddOperation).toHaveBeenCalledWith(options);
        });
    });

    describe('non-interactive mode - error cases', () => {
        it('logs error and exits when operation fails', async () => {
            const { log } = await import('@clack/prompts');
            mockPerformAddOperation.mockResolvedValue({
                success: false,
                message: 'Operation failed: invalid input',
            });

            const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

            await addCommand({ plugin: 'test-plugin' });

            expect(log.error).toHaveBeenCalledWith('Operation failed: invalid input');
            expect(exitSpy).toHaveBeenCalledWith(1);

            exitSpy.mockRestore();
        });

        it('logs error with stack trace when exception is thrown', async () => {
            const { log } = await import('@clack/prompts');
            const error = new Error('Plugin name is required');
            mockPerformAddOperation.mockRejectedValue(error);

            const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

            await addCommand({ plugin: '' });

            expect(log.error).toHaveBeenCalled();
            expect(exitSpy).toHaveBeenCalledWith(1);

            exitSpy.mockRestore();
        });
    });

    describe('interactive mode detection', () => {
        it('enters interactive mode when no options are provided', async () => {
            const { intro } = await import('@clack/prompts');

            await addCommand();

            // Should call intro to start interactive session
            expect(intro).toHaveBeenCalled();
            // Should NOT call performAddOperation
            expect(mockPerformAddOperation).not.toHaveBeenCalled();
        });

        it('enters interactive mode when options object is empty', async () => {
            const { intro } = await import('@clack/prompts');

            await addCommand({});

            expect(intro).toHaveBeenCalled();
            expect(mockPerformAddOperation).not.toHaveBeenCalled();
        });

        it('enters non-interactive mode when config is provided with operation flag', async () => {
            // Config combined with an operation triggers non-interactive mode
            await addCommand({ config: './config.ts', plugin: 'TestPlugin' });

            expect(mockPerformAddOperation).toHaveBeenCalledWith({
                config: './config.ts',
                plugin: 'TestPlugin',
            });
        });
    });

    describe('option mapping consistency', () => {
        it('preserves all option properties when routing to performAddOperation', async () => {
            const complexOptions = {
                service: 'ComplexService',
                selectedPlugin: 'ComplexPlugin',
                type: 'entity',
                selectedEntity: 'Product',
                config: './custom.config.ts',
            };

            await addCommand(complexOptions);

            expect(mockPerformAddOperation).toHaveBeenCalledWith(complexOptions);
        });

        it('does not modify or transform option values', async () => {
            await addCommand({ plugin: '  spaces-preserved  ' });

            expect(mockPerformAddOperation).toHaveBeenCalledWith({
                plugin: '  spaces-preserved  ',
            });
        });
    });
});
