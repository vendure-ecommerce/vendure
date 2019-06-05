import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { JobInfo, JobListInput, JobState } from '@vendure/common/lib/generated-types';

import { Job } from '../helpers/job-manager/job';
import { JobManager, JobReporter } from '../helpers/job-manager/job-manager';
import ms = require('ms');

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

    createJob(options: {
        name: string;
        work: (reporter: JobReporter) => any | Promise<any>;
        /** Limit this job to a single instance at a time */
        singleInstance?: boolean;
    }): Job {
        if (options.singleInstance === true) {
            const runningInstance = this.manager.findRunningJob(options.name);
            if (runningInstance) {
                return runningInstance;
            }
        }
        return this.manager.createJob(options.name, options.work);
    }

    getAll(input?: JobListInput): JobInfo[] {
        return this.manager.getAll(input);
    }

    getOne(jobId: string): JobInfo | null {
        return this.manager.getOne(jobId);
    }
}
