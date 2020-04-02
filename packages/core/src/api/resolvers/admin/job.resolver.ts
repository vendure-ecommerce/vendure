import { Args, Query, Resolver } from '@nestjs/graphql';
import {
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
    @Allow(Permission.Authenticated)
    job(@Args() args: QueryJobArgs) {
        return this.jobService.getJob(args.jobId);
    }

    @Query()
    @Allow(Permission.Authenticated)
    jobs(@Args() args: QueryJobsArgs) {
        return this.jobService.getJobs(args.options || undefined);
    }

    @Query()
    @Allow(Permission.Authenticated)
    jobsById(@Args() args: QueryJobsByIdArgs) {
        return this.jobService.getJobsById(args.jobIds || undefined);
    }

    @Query()
    @Allow(Permission.Authenticated)
    jobQueues() {
        return this.jobService.getJobQueues();
    }
}
