import { ID } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';

import { Job, JobBuffer } from '../../job-queue';

import { UpdateIndexQueueJobData, UpdateVariantsByIdJobData, UpdateVariantsJobData } from './types';

export class SearchJobBuffer implements JobBuffer<UpdateIndexQueueJobData> {
    readonly id = 'search-plugin-update-search-index';

    collect(job: Job<UpdateIndexQueueJobData>): boolean | Promise<boolean> {
        return job.queueName === 'update-search-index';
    }

    reduce(collectedJobs: Array<Job<UpdateIndexQueueJobData>>): Array<Job<any>> {
        const variantsByIdJobs = this.removeBy<Job<UpdateVariantsByIdJobData | UpdateVariantsJobData>>(
            collectedJobs,
            item => item.data.type === 'update-variants-by-id' || item.data.type === 'update-variants',
        );

        const jobsToAdd = [...collectedJobs];

        if (variantsByIdJobs.length) {
            const variantIdsToUpdate = variantsByIdJobs.reduce((result, job) => {
                const ids = job.data.type === 'update-variants-by-id' ? job.data.ids : job.data.variantIds;
                return [...result, ...ids];
            }, [] as ID[]);

            const referenceJob = variantsByIdJobs[0];
            const batchedVariantJob = new Job<UpdateVariantsByIdJobData>({
                ...referenceJob,
                id: undefined,
                data: {
                    type: 'update-variants-by-id',
                    ids: unique(variantIdsToUpdate),
                    ctx: referenceJob.data.ctx,
                },
            });

            jobsToAdd.push(batchedVariantJob as any);
        }

        return jobsToAdd;
    }

    /**
     * Removes items from the array based on the filterFn and returns a new array with only the removed
     * items. The original input array is mutated.
     */
    private removeBy<R extends T, T = any>(input: T[], filterFn: (item: T) => boolean): R[] {
        const removed: R[] = [];
        for (let i = input.length - 1; i >= 0; i--) {
            const item = input[i];
            if (filterFn(item)) {
                removed.push(item as R);
                input.splice(i, 1);
            }
        }
        return removed;
    }
}
