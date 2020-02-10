import { Injectable } from '@nestjs/common';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../../api/common/request-context';
import { Logger } from '../../../config/logger/vendure-logger';
import { Asset } from '../../../entity/asset/asset.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { Product } from '../../../entity/product/product.entity';
import { Job } from '../../../service/helpers/job-manager/job';
import { JobReporter, JobService } from '../../../service/services/job.service';
import { WorkerMessage } from '../../../worker/types';
import { WorkerService } from '../../../worker/worker.service';
import {
    AssignProductToChannelMessage,
    DeleteProductMessage,
    DeleteVariantMessage,
    ReindexMessage,
    ReindexMessageResponse,
    RemoveProductFromChannelMessage,
    UpdateAssetMessage,
    UpdateProductMessage,
    UpdateVariantMessage,
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

    updateProduct(ctx: RequestContext, product: Product) {
        const data = { ctx, productId: product.id };
        return this.createShortWorkerJob(new UpdateProductMessage(data), {
            entity: 'Product',
            id: product.id,
        });
    }

    updateVariants(ctx: RequestContext, variants: ProductVariant[]) {
        const variantIds = variants.map(v => v.id);
        const data = { ctx, variantIds };
        return this.createShortWorkerJob(new UpdateVariantMessage(data), {
            entity: 'ProductVariant',
            ids: variantIds,
        });
    }

    deleteProduct(ctx: RequestContext, product: Product) {
        const data = { ctx, productId: product.id };
        return this.createShortWorkerJob(new DeleteProductMessage(data), {
            entity: 'Product',
            id: product.id,
        });
    }

    deleteVariant(ctx: RequestContext, variants: ProductVariant[]) {
        const variantIds = variants.map(v => v.id);
        const data = { ctx, variantIds };
        return this.createShortWorkerJob(new DeleteVariantMessage(data), {
            entity: 'ProductVariant',
            id: variantIds,
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

    updateAsset(ctx: RequestContext, asset: Asset) {
        return this.createShortWorkerJob(new UpdateAssetMessage({ ctx, asset }), {
            entity: 'Asset',
            id: asset.id,
        });
    }

    assignProductToChannel(ctx: RequestContext, productId: ID, channelId: ID) {
        const data = { ctx, productId, channelId };
        return this.createShortWorkerJob(new AssignProductToChannelMessage(data), {
            entity: 'Product',
            id: productId,
        });
    }

    removeProductFromChannel(ctx: RequestContext, productId: ID, channelId: ID) {
        const data = { ctx, productId, channelId };
        return this.createShortWorkerJob(new RemoveProductFromChannelMessage(data), {
            entity: 'Product',
            id: productId,
        });
    }

    /**
     * Creates a short-running job that does not expect progress updates.
     */
    private createShortWorkerJob<T extends WorkerMessage<any, any>>(message: T, metadata: any) {
        return this.jobService.createJob({
            name: 'update-index',
            metadata,
            work: reporter => {
                this.workerService.send(message).subscribe({
                    complete: () => reporter.complete(true),
                    error: err => {
                        Logger.error(err);
                        reporter.complete(false);
                    },
                });
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
