import { Injectable } from '@nestjs/common';
import { Injector, ScheduledTask } from '@vendure/core';

import { IndexingService } from '../service/indexing.service';

export const buildIndexTask = new ScheduledTask({
    id: 'global-search-build-index',
    description: 'Builds the global search index',
    schedule: cron => cron.everyDayAt(2, 0),
    execute: async (injector: Injector, params) => {
        const indexingService = injector.get(IndexingService);
        await indexingService.triggerBuildIndex(params.ctx);
    },
});
