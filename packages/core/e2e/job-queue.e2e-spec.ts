import { DefaultJobQueuePlugin, mergeConfig } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { PluginWithJobQueue } from './fixtures/test-plugins/with-job-queue';
import {
    CancelJobMutation,
    CancelJobMutationVariables,
    GetRunningJobsQuery,
    GetRunningJobsQueryVariables,
    JobState,
} from './graphql/generated-e2e-admin-types';
import { GET_RUNNING_JOBS } from './graphql/shared-definitions';

describe('JobQueue', () => {
    const activeConfig = testConfig();
    if (activeConfig.dbConnectionOptions.type === 'sqljs') {
        it.only('skip JobQueue tests for sqljs', () => {
            // The tests in this suite will fail when running on sqljs because
            // the DB state is not persisted after shutdown. In this case it is
            // an acceptable tradeoff to just skip them, since the other DB engines
            // _will_ run in CI, and sqljs is less of a production use-case anyway.
            return;
        });
    }

    const { server, adminClient } = createTestEnvironment(
        mergeConfig(activeConfig, {
            plugins: [
                DefaultJobQueuePlugin.init({
                    pollInterval: 50,
                    gracefulShutdownTimeout: 1_000,
                }),
                PluginWithJobQueue,
            ],
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
        PluginWithJobQueue.jobSubject.complete();
        await server.destroy();
    });

    function getJobsInTestQueue(state?: JobState) {
        return adminClient
            .query<GetRunningJobsQuery, GetRunningJobsQueryVariables>(GET_RUNNING_JOBS, {
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
        const restControllerUrl = `http://localhost:${activeConfig.apiOptions.port}/run-job`;
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

        const { cancelJob } = await adminClient.query<CancelJobMutation, CancelJobMutationVariables>(
            CANCEL_JOB,
            {
                id: jobId,
            },
        );

        expect(cancelJob.state).toBe(JobState.CANCELLED);
        expect(cancelJob.isSettled).toBe(true);
        expect(cancelJob.settledAt).not.toBeNull();

        const jobs2 = await getJobsInTestQueue(JobState.CANCELLED);
        expect(jobs.items.length).toBe(1);
        expect(jobs.items[0].id).toBe(jobId);

        PluginWithJobQueue.jobSubject.next();
    });

    it('subscribe to result of job', async () => {
        const restControllerUrl = `http://localhost:${activeConfig.apiOptions.port}/run-job/subscribe`;
        const result = await adminClient.fetch(restControllerUrl);

        expect(await result.text()).toBe('42!');
        const jobs = await getJobsInTestQueue(JobState.RUNNING);
        expect(jobs.items.length).toBe(0);
    });
});

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const CANCEL_JOB = gql`
    mutation CancelJob($id: ID!) {
        cancelJob(jobId: $id) {
            id
            state
            isSettled
            settledAt
        }
    }
`;
