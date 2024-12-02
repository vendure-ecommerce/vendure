import { JobState } from '@vendure/common/lib/generated-types';
import { AutoIncrementIdStrategy, JobQueueService, mergeConfig } from '@vendure/core';
import { PluginWithJobQueue } from '@vendure/core/e2e/fixtures/test-plugins/with-job-queue';
import {
    CancelJobDocument,
    GetRunningJobsDocument,
} from '@vendure/core/e2e/graphql/generated-e2e-admin-types';
import { createTestEnvironment } from '@vendure/testing';
import { removeAllQueueData } from 'bullmq';
import IORedis from 'ioredis';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';
import { BullMQJobQueuePlugin } from '../src/bullmq/plugin';

describe('BullMQJobQueuePlugin', () => {
    const redisConnection = {
        host: '127.0.0.1',
        port: process.env.CI ? +(process.env.E2E_REDIS_PORT || 6379) : 6379,
        maxRetriesPerRequest: null,
    };
    const activeConfig = mergeConfig(testConfig(), {
        entityOptions: {
            entityIdStrategy: new AutoIncrementIdStrategy(),
        },
        plugins: [
            BullMQJobQueuePlugin.init({
                connection: redisConnection,
                workerOptions: {
                    prefix: 'e2e',
                },
                queueOptions: {
                    prefix: 'e2e',
                    defaultJobOptions: {
                        attempts: 3,
                    },
                },
                gracefulShutdownTimeout: 1_000,
            }),
            PluginWithJobQueue,
        ],
    });

    const { server, adminClient } = createTestEnvironment(activeConfig);

    beforeAll(async () => {
        await removeAllQueueData(new IORedis(redisConnection), 'vendure-queue-test', 'e2e');
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
        await sleep(1_000);
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        PluginWithJobQueue.jobSubject.complete();
        await server.destroy();
    });

    function getJobsInTestQueue(state?: JobState) {
        return adminClient
            .query(GetRunningJobsDocument, {
                options: {
                    filter: {
                        queueName: {
                            eq: 'test',
                        },
                        ...(state
                            ? {
                                  state: { eq: state },
                              }
                            : {}),
                    },
                },
            })
            .then(data => data.jobs);
    }

    let testJobId: string;

    it('creates and starts running a job', async () => {
        const restControllerUrl = `http://localhost:${activeConfig.apiOptions.port}/run-job?retries=2`;
        await adminClient.fetch(restControllerUrl);

        await sleep(300);
        const jobs = await getJobsInTestQueue();

        expect(jobs.items.length).toBe(1);
        expect(jobs.items[0].state).toBe(JobState.RUNNING);
        expect(PluginWithJobQueue.jobHasDoneWork).toBe(false);
        testJobId = jobs.items[0].id;
    });

    it(
        'shutdown server before completing job',
        async () => {
            await server.destroy();
            await server.bootstrap();
            await adminClient.asSuperAdmin();

            await sleep(300);
            const jobs = await getJobsInTestQueue();

            expect(jobs.items.length).toBe(1);
            expect(jobs.items[0].state).toBe(JobState.RUNNING);
            expect(jobs.items[0].id).toBe(testJobId);
            expect(PluginWithJobQueue.jobHasDoneWork).toBe(false);
        },
        TEST_SETUP_TIMEOUT_MS,
    );

    it('complete job after restart', async () => {
        PluginWithJobQueue.jobSubject.next();

        await sleep(300);
        const jobs = await getJobsInTestQueue();

        expect(jobs.items.length).toBe(1);
        expect(jobs.items[0].state).toBe(JobState.COMPLETED);
        expect(jobs.items[0].id).toBe(testJobId);
        expect(PluginWithJobQueue.jobHasDoneWork).toBe(true);
    });

    it('cancels a running job', async () => {
        PluginWithJobQueue.jobHasDoneWork = false;
        const restControllerUrl = `http://localhost:${activeConfig.apiOptions.port}/run-job`;
        await adminClient.fetch(restControllerUrl);

        await sleep(300);
        const jobs = await getJobsInTestQueue(JobState.RUNNING);

        expect(jobs.items.length).toBe(1);
        expect(jobs.items[0].state).toBe(JobState.RUNNING);
        expect(PluginWithJobQueue.jobHasDoneWork).toBe(false);
        const jobId = jobs.items[0].id;

        const { cancelJob } = await adminClient.query(CancelJobDocument, {
            id: jobId,
        });

        expect(cancelJob.state).toBe(JobState.CANCELLED);
        expect(cancelJob.isSettled).toBe(true);
        expect(cancelJob.settledAt).not.toBeNull();

        await sleep(300);
        const jobs2 = await getJobsInTestQueue(JobState.CANCELLED);
        expect(jobs2.items.length).toBe(1);
        expect(jobs2.items[0].id).toBe(jobId);

        PluginWithJobQueue.jobSubject.next();
    });

    // it('subscribe to result of job', async () => {
    //     const restControllerUrl = `http://localhost:${activeConfig.apiOptions.port}/run-job/subscribe`;
    //     const result = await adminClient.fetch(restControllerUrl);
    //
    //     expect(await result.text()).toBe('42!');
    //     const jobs = await getJobsInTestQueue(JobState.RUNNING);
    //     expect(jobs.items.length).toBe(0);
    // });
});

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
