import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
    ID,
    Job,
    JobReporter,
    JobService,
    Logger,
    Product,
    ProductVariant,
    RequestContext,
    WorkerService,
} from '@vendure/core';

import { ReindexMessageResponse } from './indexer.controller';
import { ReindexMessage, UpdateProductOrVariantMessage, UpdateVariantsByIdMessage } from './types';

@Injectable()
export class ElasticsearchIndexService {
    constructor(private workerService: WorkerService, private jobService: JobService) {}

    reindex(ctx: RequestContext): Job {
        return this.jobService.createJob({
            name: 'reindex',
            singleInstance: true,
            work: async reporter => {
                Logger.verbose(`sending reindex message`);
                this.workerService.send(new ReindexMessage({ ctx })).subscribe(this.createObserver(reporter));
            },
        });
    }

    /**
     * Updates the search index only for the affected entities.
     */
    updateProductOrVariant(ctx: RequestContext, updatedEntity: Product | ProductVariant) {
        return this.jobService.createJob({
            name: 'update-index',
            work: reporter => {
                const data =
                    updatedEntity instanceof Product
                        ? { ctx, productId: updatedEntity.id }
                        : { ctx, variantId: updatedEntity.id };
                this.workerService.send(new UpdateProductOrVariantMessage(data)).subscribe({
                    complete: () => reporter.complete(true),
                    error: err => {
                        Logger.error(err);
                        reporter.complete(false);
                    },
                });
            },
        });
    }

    updateVariantsById(ctx: RequestContext, ids: ID[]) {
        return this.jobService.createJob({
            name: 'update-index',
            work: reporter => {
                Logger.verbose(`sending reindex message`);
                this.workerService
                    .send(new UpdateVariantsByIdMessage({ ctx, ids }))
                    .subscribe(this.createObserver(reporter));
            },
        });
    }

    private createObserver(reporter: JobReporter) {
        let total: number | undefined;
        let duration = 0;
        let completed = 0;
        return {
            next: (response: ReindexMessageResponse) => {
                if (!total) {
                    total = response.total;
                }
                duration = response.duration;
                completed = response.completed;
                const progress = Math.ceil((completed / total) * 100);
                reporter.setProgress(progress);
            },
            complete: () => {
                reporter.complete({
                    success: true,
                    indexedItemCount: total,
                    timeTaken: duration,
                });
            },
            error: (err: any) => {
                Logger.error(JSON.stringify(err));
                reporter.complete({
                    success: false,
                    indexedItemCount: 0,
                    timeTaken: 0,
                });
            },
        };
    }
}
