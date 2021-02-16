import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    JobQueue,
    MutationCancelJobArgs,
    MutationRemoveSettledJobsArgs,
    Permission,
    QueryJobArgs,
    QueryJobsArgs,
    QueryJobsByIdArgs,
} from '@vendure/common/lib/generated-types';

import { ConfigService, InspectableJobQueueStrategy, isInspectableJobQueueStrategy } from '../../../config';
import { JobQueueService } from '../../../job-queue';
import { Allow } from '../../decorators/allow.decorator';

@Resolver()
export class JobResolver {
    constructor(private configService: ConfigService, private jobService: JobQueueService) {}

    @Query()
    @Allow(Permission.ReadSettings)
    async job(@Args() args: QueryJobArgs) {
        const strategy = this.requireInspectableJobQueueStrategy();
        if (!strategy) {
            return;
        }
        return strategy.findOne(args.jobId);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    async jobs(@Args() args: QueryJobsArgs) {
        const strategy = this.requireInspectableJobQueueStrategy();
        if (!strategy) {
            return {
                items: [],
                totalItems: 0,
            };
        }
        return strategy.findMany(args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    async jobsById(@Args() args: QueryJobsByIdArgs) {
        const strategy = this.requireInspectableJobQueueStrategy();
        if (!strategy) {
            return [];
        }
        return strategy.findManyById(args.jobIds || undefined);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    jobQueues(): JobQueue[] {
        return this.jobService.getJobQueues();
    }

    @Mutation()
    @Allow(Permission.DeleteSettings)
    async removeSettledJobs(@Args() args: MutationRemoveSettledJobsArgs) {
        const strategy = this.requireInspectableJobQueueStrategy();
        if (!strategy) {
            return 0;
        }
        return strategy.removeSettledJobs(args.queueNames || [], args.olderThan);
    }

    @Mutation()
    @Allow(Permission.DeleteSettings)
    async cancelJob(@Args() args: MutationCancelJobArgs) {
        const strategy = this.requireInspectableJobQueueStrategy();
        if (!strategy) {
            return;
        }
        return strategy.cancelJob(args.jobId);
    }

    private requireInspectableJobQueueStrategy(): InspectableJobQueueStrategy | undefined {
        if (!isInspectableJobQueueStrategy(this.configService.jobQueueOptions.jobQueueStrategy)) {
            return;
        }

        return this.configService.jobQueueOptions.jobQueueStrategy;
    }
}
