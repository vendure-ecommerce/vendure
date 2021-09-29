import { InMemoryJobQueueStrategy } from './in-memory-job-queue-strategy';
import { Job } from './job';

/**
 * @description
 * An in-memory {@link JobQueueStrategy} design for testing purposes.
 */
export class TestingJobQueueStrategy extends InMemoryJobQueueStrategy {
    async prePopulate(jobs: Job[]) {
        for (const job of jobs) {
            await this.add(job);
        }
    }
}
