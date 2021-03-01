/* tslint:disable:no-non-null-assertion */
import { Injectable, OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { JobState } from '@vendure/common/lib/generated-types';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { Injector } from '../common';
import { ConfigService } from '../config/config.service';

import { Job } from './job';
import { JobQueueService } from './job-queue.service';
import { TestingJobQueueStrategy } from './testing-job-queue-strategy';

const queuePollInterval = 10;

describe('JobQueueService', () => {
    let jobQueueService: JobQueueService;
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [{ provide: ConfigService, useClass: MockConfigService }, JobQueueService],
        }).compile();
        await module.init();

        jobQueueService = module.get(JobQueueService);
        await jobQueueService.start();
    });

    afterEach(async () => {
        await module.close();
    });

    it('data is passed into job', async () => {
        const subject = new Subject<string>();
        const subNext = subject.pipe(take(1)).toPromise();
        const testQueue = await jobQueueService.createQueue<string>({
            name: 'test',
            process: async job => {
                subject.next(job.data);
            },
        });

        await testQueue.add('hello');
        const data = await subNext;
        expect(data).toBe('hello');
    });

    it('job marked as complete', async () => {
        const subject = new Subject<string>();
        const testQueue = await jobQueueService.createQueue<string>({
            name: 'test',
            process: job => {
                return subject.toPromise();
            },
        });

        const testJob = await testQueue.add('hello');
        expect(testJob.state).toBe(JobState.PENDING);

        await tick(queuePollInterval);
        expect(testJob.state).toBe(JobState.RUNNING);

        subject.next('yay');
        subject.complete();

        await tick();

        expect(testJob.state).toBe(JobState.COMPLETED);
        expect(testJob.result).toBe('yay');
    });

    it('job marked as failed when exception thrown', async () => {
        const subject = new Subject();
        const testQueue = await jobQueueService.createQueue<string>({
            name: 'test',
            process: async job => {
                const result = await subject.toPromise();
                throw result;
            },
        });

        const testJob = await testQueue.add('hello');
        expect(testJob.state).toBe(JobState.PENDING);

        await tick(queuePollInterval);
        expect(testJob.state).toBe(JobState.RUNNING);

        subject.next('uh oh');
        subject.complete();
        await tick();

        expect(testJob.state).toBe(JobState.FAILED);
        expect(testJob.error).toBe('uh oh');
    });

    it('job marked as failed when async error thrown', async () => {
        const err = new Error('something bad happened');
        const testQueue = await jobQueueService.createQueue<string>({
            name: 'test',
            process: async job => {
                throw err;
            },
        });

        const testJob = await testQueue.add('hello');
        expect(testJob.state).toBe(JobState.PENDING);

        await tick(queuePollInterval);
        expect(testJob.state).toBe(JobState.FAILED);
        expect(testJob.error).toBe(err.message);
    });

    it('jobs processed in FIFO queue', async () => {
        const subject = new Subject();
        const testQueue = await jobQueueService.createQueue<string>({
            name: 'test',
            process: job => {
                return subject.pipe(take(1)).toPromise();
            },
        });

        const testJob1 = await testQueue.add('1');
        const testJob2 = await testQueue.add('2');
        const testJob3 = await testQueue.add('3');

        const getStates = () => [testJob1.state, testJob2.state, testJob3.state];

        await tick(queuePollInterval);

        expect(getStates()).toEqual([JobState.RUNNING, JobState.PENDING, JobState.PENDING]);

        subject.next();
        await tick();
        expect(getStates()).toEqual([JobState.COMPLETED, JobState.PENDING, JobState.PENDING]);

        await tick(queuePollInterval);
        expect(getStates()).toEqual([JobState.COMPLETED, JobState.RUNNING, JobState.PENDING]);

        subject.next();
        await tick();
        expect(getStates()).toEqual([JobState.COMPLETED, JobState.COMPLETED, JobState.PENDING]);

        await tick(queuePollInterval);
        expect(getStates()).toEqual([JobState.COMPLETED, JobState.COMPLETED, JobState.RUNNING]);

        subject.next();
        await tick();
        expect(getStates()).toEqual([JobState.COMPLETED, JobState.COMPLETED, JobState.COMPLETED]);

        subject.complete();
    });

    it('with concurrency', async () => {
        const testingJobQueueStrategy = module.get(ConfigService).jobQueueOptions
            .jobQueueStrategy as TestingJobQueueStrategy;

        testingJobQueueStrategy.concurrency = 2;

        const subject = new Subject();
        const testQueue = await jobQueueService.createQueue<string>({
            name: 'test',
            process: job => {
                return subject.pipe(take(1)).toPromise();
            },
        });

        const testJob1 = await testQueue.add('1');
        const testJob2 = await testQueue.add('2');
        const testJob3 = await testQueue.add('3');

        const getStates = () => [testJob1.state, testJob2.state, testJob3.state];

        await tick(queuePollInterval);

        expect(getStates()).toEqual([JobState.RUNNING, JobState.RUNNING, JobState.PENDING]);

        subject.next();
        await tick();
        expect(getStates()).toEqual([JobState.COMPLETED, JobState.COMPLETED, JobState.PENDING]);

        await tick(queuePollInterval);
        expect(getStates()).toEqual([JobState.COMPLETED, JobState.COMPLETED, JobState.RUNNING]);

        subject.next();
        await tick();
        expect(getStates()).toEqual([JobState.COMPLETED, JobState.COMPLETED, JobState.COMPLETED]);

        subject.complete();
    });

    it('processes existing jobs on start', async () => {
        const testingJobQueueStrategy = module.get(ConfigService).jobQueueOptions
            .jobQueueStrategy as TestingJobQueueStrategy;

        await testingJobQueueStrategy.prePopulate([
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

        const testQueue = await jobQueueService.createQueue<string>({
            name: 'test',
            process: async job => {
                return;
            },
        });

        await tick();

        const job1 = await testingJobQueueStrategy.findOne('job-1');
        const job2 = await testingJobQueueStrategy.findOne('job-2');
        expect(job1?.state).toBe(JobState.COMPLETED);
        expect(job2?.state).toBe(JobState.PENDING);

        await tick(queuePollInterval);
        expect(job2?.state).toBe(JobState.COMPLETED);
    });

    it('retries', async () => {
        const subject = new Subject<boolean>();
        const testQueue = await jobQueueService.createQueue<string>({
            name: 'test',
            process: job => {
                return subject
                    .pipe(take(1))
                    .toPromise()
                    .then(success => {
                        if (!success) {
                            throw new Error();
                        }
                    });
            },
        });

        const testJob = await testQueue.add('hello', { retries: 2 });

        await tick(queuePollInterval);
        expect(testJob.state).toBe(JobState.RUNNING);
        expect(testJob.isSettled).toBe(false);

        subject.next(false);
        await tick();
        expect(testJob.state).toBe(JobState.RETRYING);
        expect(testJob.isSettled).toBe(false);

        await tick(queuePollInterval);
        subject.next(false);
        await tick();
        expect(testJob.state).toBe(JobState.RETRYING);
        expect(testJob.isSettled).toBe(false);

        await tick(queuePollInterval);
        subject.next(false);
        await tick();
        expect(testJob.state).toBe(JobState.FAILED);
        expect(testJob.isSettled).toBe(true);
    });

    it('sets long-running jobs to pending on destroy', async () => {
        const testingJobQueueStrategy = module.get(ConfigService).jobQueueOptions
            .jobQueueStrategy as TestingJobQueueStrategy;

        const subject = new Subject<boolean>();
        const testQueue = await jobQueueService.createQueue<string>({
            name: 'test',
            process: job => {
                return subject.pipe(take(1)).toPromise();
            },
        });

        const testJob = await testQueue.add('hello');

        await tick(queuePollInterval);

        expect((await testingJobQueueStrategy.findOne(testJob.id!))?.state).toBe(JobState.RUNNING);

        await testQueue.stop();

        expect((await testingJobQueueStrategy.findOne(testJob.id!))?.state).toBe(JobState.PENDING);
    }, 10000);

    it('should start a queue if its name is in the active list', async () => {
        module.get(ConfigService).jobQueueOptions.activeQueues = ['test'];

        const subject = new Subject();
        const testQueue = await jobQueueService.createQueue<string>({
            name: 'test',
            process: job => {
                return subject.toPromise();
            },
        });

        const testJob = await testQueue.add('hello');
        expect(testJob.state).toBe(JobState.PENDING);

        await tick(queuePollInterval);
        expect(testJob.state).toBe(JobState.RUNNING);

        subject.next('yay');
        subject.complete();
        await tick();

        expect(testJob.state).toBe(JobState.COMPLETED);
        expect(testJob.result).toBe('yay');
    });

    it('should not start a queue if its name is in the active list', async () => {
        module.get(ConfigService).jobQueueOptions.activeQueues = ['another'];

        const subject = new Subject();
        const testQueue = await jobQueueService.createQueue<string>({
            name: 'test',
            process: job => {
                return subject.toPromise();
            },
        });

        const testJob = await testQueue.add('hello');
        expect(testJob.state).toBe(JobState.PENDING);

        await tick(queuePollInterval);
        expect(testJob.state).toBe(JobState.PENDING);

        subject.next('yay');
        subject.complete();

        expect(testJob.state).toBe(JobState.PENDING);
    });
});

function tick(ms: number = 0): Promise<void> {
    return new Promise<void>(resolve => {
        if (ms > 0) {
            setTimeout(resolve, ms);
        } else {
            process.nextTick(resolve);
        }
    });
}

@Injectable()
class MockConfigService implements OnApplicationBootstrap, OnModuleDestroy {
    constructor(private moduleRef: ModuleRef) {}

    jobQueueOptions = {
        jobQueueStrategy: new TestingJobQueueStrategy(1, queuePollInterval),
        activeQueues: [],
    };

    async onApplicationBootstrap() {
        const injector = new Injector(this.moduleRef);
        await this.jobQueueOptions.jobQueueStrategy.init(injector);
    }

    async onModuleDestroy() {
        await this.jobQueueOptions.jobQueueStrategy.destroy();
    }
}
