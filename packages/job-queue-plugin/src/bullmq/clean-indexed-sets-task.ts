import { ScheduledTask } from '@vendure/core';

import { IndexedSetService } from './indexed-set.service';

export const cleanIndexedSetsTask = new ScheduledTask({
    // Give your task a unique ID
    id: 'clean-job-queue-indexed-sets',
    // A human-readable description of the task
    description: 'Cleans up the indexed sets used to speed up job queue listing operations',
    // Define a default schedule. This can be modified using the
    // `.configure()` method on the instance later.
    schedule: cron => cron.everyDayAt(0, 0),
    // This is the function that will be executed per the schedule.
    async execute({injector}) {
        const indexedSetService = injector.get(IndexedSetService);
        return indexedSetService.cleanupIndexedSets();
    },
});