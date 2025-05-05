import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { JobQueue, JobQueueService, Logger, RequestContext, SerializedRequestContext } from '@vendure/core';

import { loggerCtx, PLUGIN_INIT_OPTIONS } from '../constants';
import { GlobalIndexingStrategy } from '../indexing-strategy/global-indexing-strategy';
import { DashboardPluginOptions } from '../types';
@Injectable()
export class IndexingService implements OnModuleInit {
    private jobQueue: JobQueue<{ operation: 'build' | 'rebuild'; ctx: SerializedRequestContext }>;
    private indexingStrategy: GlobalIndexingStrategy;

    constructor(
        @Inject(PLUGIN_INIT_OPTIONS) private readonly options: DashboardPluginOptions,
        private readonly jobQueueService: JobQueueService,
    ) {
        this.indexingStrategy = options.indexingStrategy;
    }

    async onModuleInit() {
        this.jobQueue = await this.jobQueueService.createQueue({
            name: 'global-search-index',
            process: async job => {
                const { operation } = job.data;
                const ctx = RequestContext.deserialize(job.data.ctx);

                if (operation === 'build') {
                    await this.buildIndex(ctx);
                } else if (operation === 'rebuild') {
                    await this.rebuildIndex(ctx);
                } else {
                    throw new Error(`Unknown operation: ${String(operation)}`);
                }
            },
        });
    }

    async triggerBuildIndex(ctx: RequestContext) {
        await this.jobQueue.add(
            {
                operation: 'build',
                ctx: ctx.serialize(),
            },
            {
                retries: 3,
            },
        );
    }

    async triggerRebuildIndex(ctx: RequestContext) {
        await this.jobQueue.add({
            operation: 'rebuild',
            ctx: ctx.serialize(),
        });
    }

    async buildIndex(ctx: RequestContext) {
        Logger.info(`Building global search index with ${this.indexingStrategy.constructor.name}`, loggerCtx);
        await this.indexingStrategy.buildIndex(ctx);
    }

    async rebuildIndex(ctx: RequestContext) {
        Logger.info(
            `Rebuilding global search index with ${this.indexingStrategy.constructor.name}`,
            loggerCtx,
        );
        await this.indexingStrategy.rebuildIndex(ctx);
    }

    async updateIndex(ctx: RequestContext, entityType: string, entityId: string) {
        await this.indexingStrategy.updateIndex(ctx, entityType, entityId);
    }

    async removeFromIndex(ctx: RequestContext, entityType: string, entityId: string) {
        await this.indexingStrategy.removeFromIndex(ctx, entityType, entityId);
    }

    getIndexableEntities(ctx: RequestContext) {
        return this.indexingStrategy.getIndexableEntities(ctx);
    }
}
