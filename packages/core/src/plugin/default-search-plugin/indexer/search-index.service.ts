import { Injectable } from '@nestjs/common';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../../api/common/request-context';
import { Logger } from '../../../config/logger/vendure-logger';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { Product } from '../../../entity/product/product.entity';
import { Job } from '../../../service/helpers/job-manager/job';
import { JobReporter, JobService } from '../../../service/services/job.service';
import { WorkerService } from '../../../worker/worker.service';
import {
    ReindexMessage,
    ReindexMessageResponse,
    UpdateProductOrVariantMessage,
    UpdateVariantsByIdMessage,
} from '../types';

/**
 * This service is responsible for messaging the {@link IndexerController} with search index updates.
 */
@Injectable()
export class SearchIndexService {
    constructor(private workerService: WorkerService, private jobService: JobService) {}

    reindex(ctx: RequestContext): Job {
        return this.jobService.createJob({
            name: 'reindex',
            singleInstance: true,
            work: async reporter => {
                Logger.verbose(`sending ReindexMessage`);
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
            metadata: {
                entity: updatedEntity.constructor.name,
                id: updatedEntity.id,
            },
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
            name: 'update-variants',
            metadata: {
                variantIds: ids,
            },
            work: reporter => {
                Logger.verbose(`sending UpdateVariantsByIdMessage`);
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
