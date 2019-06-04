import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { JobInfo, JobListInput } from '@vendure/common/lib/generated-types';
import ms = require('ms');

import { Job } from '../helpers/job-manager/job';
import { JobManager, JobReporter } from '../helpers/job-manager/job-manager';

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

    startJob(name: string, work: (reporter: JobReporter) => any | Promise<any>): Job {
        return this.manager.startJob(name, work);
    }

    getAll(input?: JobListInput): JobInfo[] {
        return this.manager.getAll(input);
    }

    getOne(jobId: string): JobInfo | null {
        return this.manager.getOne(jobId);
    }
}
