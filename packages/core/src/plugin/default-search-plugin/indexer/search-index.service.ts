import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectConnection } from '@nestjs/typeorm';
import { ID } from '@vendure/common/lib/shared-types';
import { Connection } from 'typeorm';

import { RequestContext } from '../../../api/common/request-context';
import { ConfigService } from '../../../config/config.service';
import { Logger } from '../../../config/logger/vendure-logger';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { Product } from '../../../entity/product/product.entity';
import { Job } from '../../../service/helpers/job-manager/job';
import { JobService } from '../../../service/services/job.service';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { VENDURE_WORKER_CLIENT } from '../../../worker/constants';
import { Message } from '../constants';

import { ReindexMessageResponse } from './indexer.controller';

/**
 * This service is responsible for messaging the {@link IndexerController} with search index updates.
 */
@Injectable()
export class SearchIndexService implements OnModuleDestroy {

    constructor(@InjectConnection() private connection: Connection,
                @Inject(VENDURE_WORKER_CLIENT) private readonly client: ClientProxy,
                private productVariantService: ProductVariantService,
                private jobService: JobService,
                private configService: ConfigService) {}

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

    onModuleDestroy(): any {
        this.client.close();
    }
}
