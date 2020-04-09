import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    MutationRemoveSettledJobsArgs,
    Permission,
    QueryJobArgs,
    QueryJobsArgs,
    QueryJobsByIdArgs,
} from '@vendure/common/lib/generated-types';

import { JobQueueService } from '../../../job-queue/job-queue.service';
import { Allow } from '../../decorators/allow.decorator';

@Resolver()
export class JobResolver {
    constructor(private jobService: JobQueueService) {}

    @Query()
    @Allow(Permission.ReadSettings)
    job(@Args() args: QueryJobArgs) {
        return this.jobService.getJob(args.jobId);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    jobs(@Args() args: QueryJobsArgs) {
        return this.jobService.getJobs(args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    jobsById(@Args() args: QueryJobsByIdArgs) {
        return this.jobService.getJobsById(args.jobIds || undefined);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    jobQueues() {
        return this.jobService.getJobQueues();
    }

    @Mutation()
    @Allow(Permission.DeleteSettings)
    removeSettledJobs(@Args() args: MutationRemoveSettledJobsArgs) {
        return this.jobService.removeSettledJobs(args.queueNames || [], args.olderThan);
    }
}
