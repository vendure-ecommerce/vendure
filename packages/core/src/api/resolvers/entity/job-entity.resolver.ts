import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Job } from '../../../job-queue/job';

@Resolver('Job')
export class JobEntityResolver {
    private readonly graphQlMaxInt = 2 ** 31 - 1;

    @ResolveField()
    async duration(@Parent() job: Job) {
        return Math.min(job.duration, this.graphQlMaxInt);
    }
}
