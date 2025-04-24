import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { JobQueue, RequestContext, JobQueueService, SerializedRequestContext, Logger } from '@vendure/core';

import { loggerCtx, PLUGIN_INIT_OPTIONS } from '../constants';
import { DashboardPluginOptions } from '../types';

@Injectable()
export class IndexingService implements OnModuleInit {
    private jobQueue: JobQueue<{ operation: 'build' | 'rebuild'; ctx: SerializedRequestContext }>;

    constructor(
        @Inject(PLUGIN_INIT_OPTIONS) private readonly options: DashboardPluginOptions,
        private readonly jobQueueService: JobQueueService,
    ) {}

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
        const indexingStrategy = this.options.indexingStrategy;
        Logger.info(`Building global search index with ${indexingStrategy.constructor.name}`, loggerCtx);
        await indexingStrategy.buildIndex(ctx);
    }

    async rebuildIndex(ctx: RequestContext) {
        const indexingStrategy = this.options.indexingStrategy;
        Logger.info(`Rebuilding global search index with ${indexingStrategy.constructor.name}`, loggerCtx);
        await indexingStrategy.rebuildIndex(ctx);
    }

    async updateIndex(ctx: RequestContext, entityType: string, entityId: string) {
        const indexingStrategy = this.options.indexingStrategy;
        await indexingStrategy.updateIndex(ctx, entityType, entityId);
    }

    async removeFromIndex(ctx: RequestContext, entityType: string, entityId: string) {
        const indexingStrategy = this.options.indexingStrategy;
        await indexingStrategy.removeFromIndex(ctx, entityType, entityId);
    }
}
