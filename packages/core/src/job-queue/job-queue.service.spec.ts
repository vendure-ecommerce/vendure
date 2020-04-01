import { Test, TestingModule } from '@nestjs/testing';
import { JobState } from '@vendure/common/lib/generated-types';
import { Subject } from 'rxjs';

import { ConfigService } from '../config/config.service';
import { ProcessContext, ServerProcessContext } from '../process-context/process-context';

import { Job } from './job';
import { JobQueueService } from './job-queue.service';
import { TestingJobQueueStrategy } from './testing-job-queue-strategy';

const queuePollInterval = 10;

describe('JobQueueService', () => {
    let jobQueueService: JobQueueService;
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                { provide: ConfigService, useClass: MockConfigService },
                { provide: ProcessContext, useClass: ServerProcessContext },
                JobQueueService,
            ],
        }).compile();

        jobQueueService = module.get(JobQueueService);
        await module.init();
    });

    afterEach(async () => {
        await module.close();
    });

    it('data is passed into job', (cb) => {
        const testQueue = jobQueueService.createQueue<string>({
            name: 'test',
            concurrency: 1,
            process: (job) => {
                job.complete();
                expect(job.data).toBe('hello');
                cb();
            },
        });

        testQueue.add('hello');
    });

    it('job marked as complete', async () => {
        const subject = new Subject();
        const testQueue = jobQueueService.createQueue<string>({
            name: 'test',
            concurrency: 1,
            process: (job) => {
                subject.subscribe(() => {
                    job.complete('yay');
                });
            },
        });

        const testJob = await testQueue.add('hello');
        expect(testJob.state).toBe(JobState.PENDING);

        await tick(queuePollInterval);
        expect(testJob.state).toBe(JobState.RUNNING);

        subject.next();
        expect(testJob.state).toBe(JobState.COMPLETED);
        expect(testJob.result).toBe('yay');

        subject.complete();
    });

    it('job marked as failed when .fail() called', async () => {
        const subject = new Subject();
        const testQueue = jobQueueService.createQueue<string>({
            name: 'test',
            concurrency: 1,
            process: (job) => {
                subject.subscribe(() => {
                    job.fail('uh oh');
                });
            },
        });

        const testJob = await testQueue.add('hello');
        expect(testJob.state).toBe(JobState.PENDING);

        await tick(queuePollInterval);
        expect(testJob.state).toBe(JobState.RUNNING);

        subject.next();
        expect(testJob.state).toBe(JobState.FAILED);
        expect(testJob.error).toBe('uh oh');

        subject.complete();
    });

    it('job marked as failed when sync error thrown', async () => {
        const subject = new Subject();
        const err = new Error('something bad happened');
        const testQueue = jobQueueService.createQueue<string>({
            name: 'test',
            concurrency: 1,
            process: (job) => {
                throw err;
            },
        });

        const testJob = await testQueue.add('hello');
        expect(testJob.state).toBe(JobState.PENDING);

        await tick(queuePollInterval);
        expect(testJob.state).toBe(JobState.FAILED);
        expect(testJob.error).toBe(err.message);

        subject.complete();
    });

    it('job marked as failed when async error thrown', async () => {
        const subject = new Subject();
        const err = new Error('something bad happened');
        const testQueue = jobQueueService.createQueue<string>({
            name: 'test',
            concurrency: 1,
            process: async (job) => {
                throw err;
            },
        });

        const testJob = await testQueue.add('hello');
        expect(testJob.state).toBe(JobState.PENDING);

        await tick(queuePollInterval);
        expect(testJob.state).toBe(JobState.FAILED);
        expect(testJob.error).toBe(err.message);

        subject.complete();
    });

    it('jobs processed in FIFO queue', async () => {
        const subject = new Subject();
        const testQueue = jobQueueService.createQueue<string>({
            name: 'test',
            concurrency: 1,
            process: (job) => {
                subject.subscribe(() => {
                    job.complete();
                });
            },
        });

        const testJob1 = await testQueue.add('1');
        const testJob2 = await testQueue.add('2');
        const testJob3 = await testQueue.add('3');

        const getStates = () => [testJob1.state, testJob2.state, testJob3.state];

        await tick(queuePollInterval);

        expect(getStates()).toEqual([JobState.RUNNING, JobState.PENDING, JobState.PENDING]);

        subject.next();
        expect(getStates()).toEqual([JobState.COMPLETED, JobState.PENDING, JobState.PENDING]);

        await tick(queuePollInterval);
        expect(getStates()).toEqual([JobState.COMPLETED, JobState.RUNNING, JobState.PENDING]);

        subject.next();
        expect(getStates()).toEqual([JobState.COMPLETED, JobState.COMPLETED, JobState.PENDING]);

        await tick(queuePollInterval);
        expect(getStates()).toEqual([JobState.COMPLETED, JobState.COMPLETED, JobState.RUNNING]);

        subject.next();
        expect(getStates()).toEqual([JobState.COMPLETED, JobState.COMPLETED, JobState.COMPLETED]);

        subject.complete();
    });

    it('with concurrency', async () => {
        const subject = new Subject();
        const testQueue = jobQueueService.createQueue<string>({
            name: 'test',
            concurrency: 2,
            process: (job) => {
                subject.subscribe(() => {
                    job.complete();
                });
            },
        });

        const testJob1 = await testQueue.add('1');
        const testJob2 = await testQueue.add('2');
        const testJob3 = await testQueue.add('3');

        const getStates = () => [testJob1.state, testJob2.state, testJob3.state];

        await tick(queuePollInterval);

        expect(getStates()).toEqual([JobState.RUNNING, JobState.RUNNING, JobState.PENDING]);

        subject.next();
        expect(getStates()).toEqual([JobState.COMPLETED, JobState.COMPLETED, JobState.PENDING]);

        await tick(queuePollInterval);
        expect(getStates()).toEqual([JobState.COMPLETED, JobState.COMPLETED, JobState.RUNNING]);

        subject.next();
        expect(getStates()).toEqual([JobState.COMPLETED, JobState.COMPLETED, JobState.COMPLETED]);

        subject.complete();
    });

    it('processes existing jobs on start', async () => {
        const testingJobQueueStrategy = module.get(ConfigService).jobQueueOptions
            .jobQueueStrategy as TestingJobQueueStrategy;

        testingJobQueueStrategy.prePopulate([
            new Job<any>({
                queueName: 'test',
                data: {},
                id: 'job-1',
            }),
            new Job<any>({
                queueName: 'test',
                data: {},
                id: 'job-2',
            }),
        ]);

        const testQueue = jobQueueService.createQueue<string>({
            name: 'test',
            concurrency: 1,
            process: (job) => {
                job.complete();
            },
        });

        const job1 = await jobQueueService.getJob('job-1');
        const job2 = await jobQueueService.getJob('job-2');
        expect(job1?.state).toBe(JobState.COMPLETED);
        expect(job2?.state).toBe(JobState.PENDING);

        await tick(queuePollInterval);
        expect(job2?.state).toBe(JobState.COMPLETED);
    });

    it('retries', async () => {
        const subject = new Subject<boolean>();
        const testQueue = jobQueueService.createQueue<string>({
            name: 'test',
            concurrency: 1,
            process: (job) => {
                subject.subscribe((success) => (success ? job.complete() : job.fail()));
            },
        });

        const testJob = await testQueue.add('hello', { retries: 2 });

        await tick(queuePollInterval);
        expect(testJob.state).toBe(JobState.RUNNING);
        expect(testJob.isSettled).toBe(false);

        subject.next(false);
        expect(testJob.state).toBe(JobState.RETRYING);
        expect(testJob.isSettled).toBe(false);

        await tick(queuePollInterval);
        subject.next(false);
        expect(testJob.state).toBe(JobState.RETRYING);
        expect(testJob.isSettled).toBe(false);

        await tick(queuePollInterval);
        subject.next(false);
        expect(testJob.state).toBe(JobState.FAILED);
        expect(testJob.isSettled).toBe(true);
    });
});

function tick(ms: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

class MockConfigService {
    jobQueueOptions = {
        jobQueueStrategy: new TestingJobQueueStrategy(),
        pollInterval: queuePollInterval,
    };
}
