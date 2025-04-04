import { Query, Resolver } from '@nestjs/graphql';
import { Permission } from '@vendure/common/lib/generated-types';

import { SchedulerService } from '../../../scheduler/scheduler.service';
import { Allow } from '../../decorators/allow.decorator';

@Resolver()
export class ScheduledTaskResolver {
    constructor(private readonly schedulerService: SchedulerService) {}

    @Query()
    @Allow(Permission.ReadSettings, Permission.ReadSystem)
    scheduledTasks() {
        return this.schedulerService.getTaskList();
    }
}
