import { Job } from '../job';
import { JobData } from '../types';

export interface JobBufferProcessor<Data extends JobData<Data> = {}> {
    readonly id: string;
    collect(job: Job<Data>): boolean | Promise<boolean>;
    reduce(collectedJobs: Array<Job<Data>>): Array<Job<Data>> | Promise<Array<Job<Data>>>;
}
