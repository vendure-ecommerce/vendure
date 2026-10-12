import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';

import { ConfigService } from '../config/config.service';
import { Logger } from '../config/logger/vendure-logger';
import { ProcessContext } from '../process-context/process-context';

import { ScheduledTask } from './scheduled-task';
import { SchedulerStrategy } from './scheduler-strategy';
import { SchedulerService } from './scheduler.service';

describe('SchedulerService', () => {
    let service: SchedulerService;
    let warnSpy: MockInstance;
    let errorSpy: MockInstance;

    function createService(task: ScheduledTask, executeTask: SchedulerStrategy['executeTask']) {
        const schedulerStrategy = { executeTask } as unknown as SchedulerStrategy;
        const configService = {
            schedulerOptions: {
                schedulerStrategy,
                tasks: [task],
                runTasksInWorkerOnly: false,
            },
        } as unknown as ConfigService;
        return new SchedulerService(configService, new ProcessContext());
    }

    function everySecondTask(preventOverlap: boolean) {
        return {
            id: 'slow-task',
            options: { id: 'slow-task', schedule: '* * * * * *', preventOverlap },
        } as unknown as ScheduledTask;
    }

    beforeEach(() => {
        vi.useFakeTimers();
        vi.spyOn(Logger, 'info').mockImplementation(() => undefined);
        warnSpy = vi.spyOn(Logger, 'warn').mockImplementation(() => undefined);
        errorSpy = vi.spyOn(Logger, 'error').mockImplementation(() => undefined);
    });

    afterEach(async () => {
        const shutdown = service.onApplicationShutdown();
        await vi.advanceTimersByTimeAsync(10_000);
        await shutdown;
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('does not start an overlapping run while a long-running task is still in flight', async () => {
        let started = 0;
        let inFlight = 0;
        let maxInFlight = 0;
        let finishRun: () => void = () => undefined;
        service = createService(everySecondTask(true), () => async () => {
            started++;
            inFlight++;
            maxInFlight = Math.max(maxInFlight, inFlight);
            await new Promise<void>(resolve => (finishRun = resolve));
            inFlight--;
        });
        service.onApplicationBootstrap();

        await vi.advanceTimersByTimeAsync(3_500);

        expect(started).toBe(1);
        expect(maxInFlight).toBe(1);
        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining('was blocked because an existing task is still running'),
        );

        finishRun();
        await vi.advanceTimersByTimeAsync(1_000);

        expect(started).toBe(2);
        finishRun();
    });

    it('waits for a running task to finish before shutting down', async () => {
        let finishRun: () => void = () => undefined;
        service = createService(
            everySecondTask(true),
            () => () => new Promise<void>(resolve => (finishRun = resolve)),
        );
        service.onApplicationBootstrap();
        await vi.advanceTimersByTimeAsync(1_000);

        let shutDown = false;
        const shutdown = service.onApplicationShutdown().then(() => (shutDown = true));
        await vi.advanceTimersByTimeAsync(500);

        expect(shutDown).toBe(false);
        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Waiting for 1 running tasks'));

        finishRun();
        await vi.advanceTimersByTimeAsync(100);
        await shutdown;

        expect(shutDown).toBe(true);
    });

    it('logs a rejected task execution and does not wait for it on shutdown', async () => {
        service = createService(everySecondTask(false), () => () => Promise.reject(new Error('boom')));
        service.onApplicationBootstrap();

        await vi.advanceTimersByTimeAsync(1_000);
        await service.onApplicationShutdown();

        expect(errorSpy).toHaveBeenCalledWith('Error executing scheduled task slow-task: boom');
        expect(warnSpy).not.toHaveBeenCalledWith(expect.stringContaining('Waiting for'));
    });
});
