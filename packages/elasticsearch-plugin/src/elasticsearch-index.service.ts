import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ID, Job, JobService, Logger, Product, ProductVariant, RequestContext, VENDURE_WORKER_CLIENT } from '@vendure/core';

import { Message } from './constants';
import { ReindexMessageResponse } from './indexer.controller';

@Injectable()
export class ElasticsearchIndexService implements OnModuleDestroy {

    constructor(@Inject(VENDURE_WORKER_CLIENT) private readonly client: ClientProxy,
                private jobService: JobService) {}

    /**
     * Updates the search index only for the affected entities.
     */
    updateProductOrVariant(ctx: RequestContext, updatedEntity: Product | ProductVariant) {
        return this.jobService.createJob({
            name: 'update-index',
            work: async () => {
                if (updatedEntity instanceof Product) {
                    return this.client.send(Message.UpdateProductOrVariant, { ctx, productId: updatedEntity.id })
                        .toPromise()
                        .catch(err => Logger.error(err));
                } else {
                    return this.client.send(Message.UpdateProductOrVariant, { ctx, variantId: updatedEntity.id })
                        .toPromise()
                        .catch(err => Logger.error(err));
                }
            },
        });
    }

    updateVariantsById(ctx: RequestContext, ids: ID[]) {
        return this.jobService.createJob({
            name: 'update-index',
            work: async reporter => {
                return new Promise((resolve, reject) => {
                    Logger.verbose(`sending reindex message`);
                    let total: number | undefined;
                    let duration = 0;
                    let completed = 0;
                    this.client.send<ReindexMessageResponse>(Message.UpdateVariantsById, { ctx, ids })
                        .subscribe({
                            next: response => {
                                if (!total) {
                                    total = response.total;
                                }
                                duration = response.duration;
                                completed = response.completed;
                                const progress = Math.ceil((completed / total) * 100);
                                reporter.setProgress(progress);
                            },
                            complete: () => {
                                resolve({
                                    success: true,
                                    indexedItemCount: total,
                                    timeTaken: duration,
                                });
                            },
                            error: (err) => {
                                Logger.error(JSON.stringify(err));
                                resolve({
                                    success: false,
                                    indexedItemCount: 0,
                                    timeTaken: 0,
                                });
                            },
                        });
                });
            },
        });
    }

    reindex(ctx: RequestContext): Job {
        return this.jobService.createJob({
            name: 'reindex',
            singleInstance: true,
            work: async reporter => {
                return new Promise((resolve, reject) => {
                    Logger.verbose(`sending reindex message`);
                    let total: number | undefined;
                    let duration = 0;
                    let completed = 0;
                    this.client.send<ReindexMessageResponse>(Message.Reindex, { ctx })
                        .subscribe({
                            next: response => {
                                if (!total) {
                                    total = response.total;
                                }
                                duration = response.duration;
                                completed = response.completed;
                                const progress = Math.ceil((completed / total) * 100);
                                reporter.setProgress(progress);
                            },
                            complete: () => {
                                resolve({
                                    success: true,
                                    indexedItemCount: total,
                                    timeTaken: duration,
                                });
                            },
                            error: (err) => {
                                Logger.error(JSON.stringify(err));
                                resolve({
                                    success: false,
                                    indexedItemCount: 0,
                                    timeTaken: 0,
                                });
                            },
                        });
                });
            },
        });
    }

    onModuleDestroy(): any {
        this.client.close();
    }
}
