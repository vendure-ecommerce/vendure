import { Injectable } from '@nestjs/common';
import {
    Job,
    JobQueue,
    JobQueueService,
    RequestContext,
    SerializedRequestContext,
    TransactionalConnection,
} from '@vendure/core';
import { SearchIndexItemType } from '../types';

interface IndexJobData {
    type: SearchIndexItemType;
    ctx: SerializedRequestContext;

}

@Injectable()
export class SearchIndexService {
    private indexingQueue: JobQueue<IndexJobData>;

    constructor(
        private readonly jobQueueService: JobQueueService,
        private readonly transactionalConnection: TransactionalConnection,
    ) {
        this.indexingQueue = jobQueueService.createQueue({
            name: 'global-search-index',
            process: this.processJob,
        });
    }

    async indexEntities(ctx: RequestContext) {
        const entityMetadatas = this.transactionalConnection.rawConnection.entityMetadatas;

        for (const entity of entityMetadatas) {
            this.indexingQueue.add({
                ctx: ctx.serialize(),
                type: SearchIndexItemType.Entity,
            });
        }
    }

    async processJob(job: Job<IndexJobData>) {}
}
