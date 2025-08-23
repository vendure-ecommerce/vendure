import { ScheduledTask } from '@vendure/core';
import { SearchIndexService } from '../service/search-index.service';

export const indexEntitiesTask = new ScheduledTask({
    id: 'global-search-index-entities',
    description: 'Index all entities that are registered in the application',
    schedule: cron => cron.everyDay(),
    execute: async ({ scheduledContext, injector }) => {
        const searchIndexService = injector.get(SearchIndexService);

        await searchIndexService.indexEntities(scheduledContext);
    },
});
