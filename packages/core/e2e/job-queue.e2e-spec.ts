import { DefaultJobQueuePlugin, mergeConfig } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { PluginWithJobQueue } from './fixtures/test-plugins/with-job-queue';
import { GetRunningJobs, JobState } from './graphql/generated-e2e-admin-types';
import { GET_RUNNING_JOBS } from './graphql/shared-definitions';

describe('JobQueue', () => {
    if (testConfig.dbConnectionOptions.type === 'sqljs') {
        it.only('skip JobQueue tests for sqljs', () => {
            // The tests in this suite will fail when running on sqljs because
            // the DB state is not persisted after shutdown. In this case it is
            // an acceptable tradeoff to just skip them, since the other DB engines
            // _will_ run in CI, and sqljs is less of a production use-case anyway.
            return;
        });
    }

    const { server, adminClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            plugins: [DefaultJobQueuePlugin, PluginWithJobQueue],
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
        await sleep(1000);
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    function getJobsInTestQueue() {
        return adminClient
            .query<GetRunningJobs.Query, GetRunningJobs.Variables>(GET_RUNNING_JOBS, {
                options: {
                    filter: {
                        queueName: {
                            eq: 'test',
                        },
                    },
                },
            })
            .then(data => data.jobs);
    }

    let testJobId: string;

    it('creates and starts running a job', async () => {
        const restControllerUrl = `http://localhost:${testConfig.apiOptions.port}/run-job`;
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
        PluginWithJobQueue.jobSubject.complete();

        await sleep(300);
        const jobs = await getJobsInTestQueue();

        expect(jobs.items.length).toBe(1);
        expect(jobs.items[0].state).toBe(JobState.COMPLETED);
        expect(jobs.items[0].id).toBe(testJobId);
        expect(PluginWithJobQueue.jobHasDoneWork).toBe(true);
    });
});

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
