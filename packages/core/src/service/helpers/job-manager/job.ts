import { JobState } from '@vendure/common/lib/generated-types';

import { generatePublicId } from '../../../common/generate-public-id';
import { PartialJobReporter } from '../../services/job.service';

/**
 * A Job represents a piece of work to be run in the background, i.e. outside the request-response cycle.
 * It is intended to be used for long-running work triggered by API requests (e.g. a mutation which
 * kicks off a re-build of the search index).
 */
export class Job {
    id: string;
    state: JobState = JobState.PENDING;
    progress = 0;
    result: any = null;
    started: Date;
    ended: Date;

    constructor(
        public name: string,
        public work: () => any | Promise<any>,
        private reporter: PartialJobReporter,
        public metadata: Record<string, any> = {},
    ) {
        this.id = generatePublicId();
        this.started = new Date();
    }

    async start() {
        if (this.state !== JobState.PENDING) {
            return;
        }
        this.reporter.setProgress = (percentage: number) => {
            this.progress = Math.max(Math.min(percentage, 100), 0);
        };
        let result: any;
        try {
            this.state = JobState.RUNNING;
            result = await this.work();
            this.progress = 100;
            this.result = result;
            this.state = JobState.COMPLETED;
        } catch (e) {
            this.state = JobState.FAILED;
            this.result = e;
        }
        this.ended = new Date();
        return this.result;
    }
}
