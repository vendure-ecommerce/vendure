import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { JobInfo, JobListInput } from '@vendure/common/lib/generated-types';
import ms = require('ms');

import { Job } from '../helpers/job-manager/job';
import { JobManager } from '../helpers/job-manager/job-manager';

/**
 * The JobReporter allows a long-running job to update its progress during the
 * duration of the work function. This can then be used in the client application
 * to display a progress indication to the user.
 */
export interface JobReporter {
    setProgress(percentage: number): void;
    complete(result?: any): void;
}

export type PartialJobReporter = Omit<JobReporter, 'setProgress'> & Partial<Pick<JobReporter, 'setProgress'>>;

export interface CreateJobOptions {
    name: string;
    work: (reporter: JobReporter) => any | Promise<any>;
    /** Limit this job to a single instance at a time */
    singleInstance?: boolean;
}

@Injectable()
export class JobService implements OnModuleInit, OnModuleDestroy {
    private manager = new JobManager('1d');
    private readonly cleanJobsInterval = ms('1d');
    private cleanJobsTimer: NodeJS.Timeout;

    onModuleInit() {
        this.cleanJobsTimer = global.setInterval(() => this.manager.clean(), this.cleanJobsInterval);
    }

    onModuleDestroy() {
        global.clearInterval(this.cleanJobsTimer);
    }

    createJob(options: CreateJobOptions): Job {
        if (options.singleInstance === true) {
            const runningInstance = this.manager.findRunningJob(options.name);
            if (runningInstance) {
                return runningInstance;
            }
        }
        const reporter: PartialJobReporter = {
            complete: (result: any) => {
                /* empty */
            },
        };
        const wrappedWork = () => {
            return new Promise(async (resolve, reject) => {
                reporter.complete = result => resolve(result);
                try {
                    const result = await options.work(reporter as JobReporter);
                } catch (e) {
                    reject(e);
                }
            });
        };
        return this.manager.createJob(options.name, wrappedWork, reporter);
    }

    getAll(input?: JobListInput): JobInfo[] {
        return this.manager.getAll(input);
    }

    getOne(jobId: string): JobInfo | null {
        return this.manager.getOne(jobId);
    }
}
