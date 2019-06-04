import { Args, Query, Resolver } from '@nestjs/graphql';
import { Permission, QueryJobArgs, QueryJobsArgs } from '@vendure/common/lib/generated-types';

import { JobService } from '../../../service/services/job.service';
import { Allow } from '../../decorators/allow.decorator';

@Resolver()
export class JobResolver {
    constructor(private jobService: JobService) {}

    @Query()
    @Allow(Permission.Authenticated)
    job(@Args() args: QueryJobArgs) {
        return this.jobService.getOne(args.jobId);
    }

    @Query()
    @Allow(Permission.Authenticated)
    jobs(@Args() args: QueryJobsArgs) {
        return this.jobService.getAll(args.input || undefined);
    }
}
