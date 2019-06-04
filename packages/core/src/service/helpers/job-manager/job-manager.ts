import { JobInfo, JobListInput } from '@vendure/common/lib/generated-types';
import { pick } from '@vendure/common/lib/pick';
import ms = require('ms');

import { Job } from './job';

/**
 * The JobReporter allows a long-running job to update its progress during the
 * duration of the work function. This can then be used in the client application
 * to display a progress indication to the user.
 */
export interface JobReporter {
    setProgress(percentage: number): void;
}

/**
 * The JobManager is responsible for creating and monitoring {@link Job} instances.
 */
export class JobManager {
    private jobs = new Map<string, Job>();
    /**
     * Defines the maximum age of a completed/failed Job before it
     * is removd when `clean()` is called.
     */
    private readonly maxAgeInMs = ms('1d');

    constructor(maxAge?: string) {
        if (maxAge) {
            this.maxAgeInMs = ms(maxAge);
        }
    }

    /**
     * Creates a new {@link Job} instance with the given work function. When the function
     * returns, the job will be completed. The return value is then available as the `result`
     * property of the job. If the function throws, the job will fail and the `result` property
     * will be the error thrown.
     */
    startJob(name: string, work: (reporter: JobReporter) => any | Promise<any>): Job {
        const job = new Job(name, work);
        this.jobs.set(job.id, job);
        job.start();
        return job;
    }

    getAll(input?: JobListInput): JobInfo[] {
        return Array.from(this.jobs.values()).map(this.toJobInfo).filter(job => {
            if (input) {
                let match = false;
                if (input.state) {
                    match = job.state === input.state;
                }
                if (input.ids) {
                    match = input.ids.includes(job.id);
                }
                return match;
            } else {
                return true;
            }
        });
    }

    getOne(jobId: string): JobInfo | null {
        const job = this.jobs.get(jobId);
        if (!job) {
            return null;
        }
        return this.toJobInfo(job);
    }

    /**
     * Removes all completed jobs which are older than the maxAge.
     */
    clean() {
        const nowMs = +(new Date());
        Array.from(this.jobs.values()).forEach(job => {
            if (job.ended) {
                const delta = nowMs - +job.ended;
                if (this.maxAgeInMs < delta) {
                    this.jobs.delete(job.id);
                }
            }
        });
    }

    private toJobInfo(job: Job): JobInfo {
        const info =  pick(job, ['id', 'name', 'state', 'progress', 'result', 'started', 'ended']);
        const duration = job.ended ? +job.ended - +info.started : Date.now() - +info.started;
        return { ...info, duration };
    }
}
