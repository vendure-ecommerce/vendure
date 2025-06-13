import { DefaultSchedulerPlugin, mergeConfig, ScheduledTask } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import {
    GetTasksQuery,
    RunTaskMutation,
    RunTaskMutationVariables,
    UpdateTaskMutation,
    UpdateTaskMutationVariables,
} from './graphql/generated-e2e-admin-types';
import { awaitRunningJobs } from './utils/await-running-jobs';

describe('Default scheduler plugin', () => {
    const taskSpy = vi.fn();

    const { server, adminClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            schedulerOptions: {
                tasks: [
                    new ScheduledTask({
                        id: 'test-job',
                        description: "A test job that doesn't do anything",
                        schedule: cron => cron.everySaturdayAt(0, 0),
                        async execute(injector) {
                            taskSpy();
                            return { success: true };
                        },
                    }),
                ],
                runTasksInWorkerOnly: false,
            },
            plugins: [DefaultSchedulerPlugin.init({ manualTriggerCheckInterval: 50 })],
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
        // We have extra time here because a lot of jobs are
        // triggered from all the product updates
        await awaitRunningJobs(adminClient, 10_000, 1000);
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await awaitRunningJobs(adminClient);
        await server.destroy();
    });

    it('get tasks', async () => {
        const { scheduledTasks } = await adminClient.query<GetTasksQuery>(GET_TASKS);
        expect(scheduledTasks.length).toBe(1);
        expect(scheduledTasks[0].id).toBe('test-job');
        expect(scheduledTasks[0].description).toBe("A test job that doesn't do anything");
        expect(scheduledTasks[0].schedule).toBe('0 0 * * 6');
        expect(scheduledTasks[0].scheduleDescription).toBe('At 12:00 AM, only on Saturday');
        expect(scheduledTasks[0].enabled).toBe(true);
    });

    it('disable task', async () => {
        const { updateScheduledTask } = await adminClient.query<
            UpdateTaskMutation,
            UpdateTaskMutationVariables
        >(UPDATE_TASK, {
            input: {
                id: 'test-job',
                enabled: false,
            },
        });
        expect(updateScheduledTask.enabled).toBe(false);
    });

    it('enable task', async () => {
        const { updateScheduledTask } = await adminClient.query<
            UpdateTaskMutation,
            UpdateTaskMutationVariables
        >(UPDATE_TASK, {
            input: {
                id: 'test-job',
                enabled: true,
            },
        });
        expect(updateScheduledTask.enabled).toBe(true);
    });

    it('run task', async () => {
        taskSpy.mockClear();
        expect(taskSpy).toHaveBeenCalledTimes(0);

        const { runScheduledTask } = await adminClient.query<RunTaskMutation, RunTaskMutationVariables>(
            RUN_TASK,
            { id: 'test-job' },
        );
        expect(runScheduledTask.success).toBe(true);

        await new Promise(resolve => setTimeout(resolve, 100));
        expect(taskSpy).toHaveBeenCalledTimes(1);
    });
});

export const GET_TASKS = gql`
    query GetTasks {
        scheduledTasks {
            id
            description
            schedule
            scheduleDescription
            lastResult
            enabled
        }
    }
`;

export const UPDATE_TASK = gql`
    mutation UpdateTask($input: UpdateScheduledTaskInput!) {
        updateScheduledTask(input: $input) {
            id
            enabled
        }
    }
`;

export const RUN_TASK = gql`
    mutation RunTask($id: String!) {
        runScheduledTask(id: $id) {
            success
        }
    }
`;
