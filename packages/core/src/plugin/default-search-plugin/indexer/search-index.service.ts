import { Injectable } from '@nestjs/common';
import { ID } from '@vendure/common/lib/shared-types';
import { assertNever } from '@vendure/common/lib/shared-utils';

import { RequestContext } from '../../../api/common/request-context';
import { Logger } from '../../../config/logger/vendure-logger';
import { Asset } from '../../../entity/asset/asset.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { Product } from '../../../entity/product/product.entity';
import { Job } from '../../../job-queue/job';
import { JobQueue } from '../../../job-queue/job-queue';
import { JobQueueService } from '../../../job-queue/job-queue.service';
import { WorkerMessage } from '../../../worker/types';
import { WorkerService } from '../../../worker/worker.service';
import {
    AssignProductToChannelMessage,
    AssignVariantToChannelMessage,
    DeleteAssetMessage,
    DeleteProductMessage,
    DeleteVariantMessage,
    ReindexMessage,
    ReindexMessageResponse,
    RemoveProductFromChannelMessage,
    RemoveVariantFromChannelMessage,
    UpdateAssetMessage,
    UpdateIndexQueueJobData,
    UpdateProductMessage,
    UpdateVariantMessage,
    UpdateVariantsByIdMessage,
} from '../types';

let updateIndexQueue: JobQueue<UpdateIndexQueueJobData> | undefined;

/**
 * This service is responsible for messaging the {@link IndexerController} with search index updates.
 */
@Injectable()
export class SearchIndexService {
    constructor(private workerService: WorkerService, private jobService: JobQueueService) {}

    initJobQueue() {
        updateIndexQueue = this.jobService.createQueue({
            name: 'update-search-index',
            concurrency: 1,
            process: job => {
                const data = job.data;
                switch (data.type) {
                    case 'reindex':
                        Logger.verbose(`sending ReindexMessage`);
                        this.sendMessageWithProgress(job, new ReindexMessage(data));
                        break;
                    case 'update-product':
                        this.sendMessage(job, new UpdateProductMessage(data));
                        break;
                    case 'update-variants':
                        this.sendMessage(job, new UpdateVariantMessage(data));
                        break;
                    case 'delete-product':
                        this.sendMessage(job, new DeleteProductMessage(data));
                        break;
                    case 'delete-variant':
                        this.sendMessage(job, new DeleteVariantMessage(data));
                        break;
                    case 'update-variants-by-id':
                        this.sendMessageWithProgress(job, new UpdateVariantsByIdMessage(data));
                        break;
                    case 'update-asset':
                        this.sendMessage(job, new UpdateAssetMessage(data));
                        break;
                    case 'delete-asset':
                        this.sendMessage(job, new DeleteAssetMessage(data));
                        break;
                    case 'assign-product-to-channel':
                        this.sendMessage(job, new AssignProductToChannelMessage(data));
                        break;
                    case 'remove-product-from-channel':
                        this.sendMessage(job, new RemoveProductFromChannelMessage(data));
                        break;
                    case 'assign-variant-to-channel':
                        this.sendMessage(job, new AssignVariantToChannelMessage(data));
                        break;
                    case 'remove-variant-from-channel':
                        this.sendMessage(job, new RemoveVariantFromChannelMessage(data));
                        break;
                    default:
                        assertNever(data);
                }
            },
        });
    }

    reindex(ctx: RequestContext) {
        return this.addJobToQueue({ type: 'reindex', ctx: ctx.serialize() });
    }

    updateProduct(ctx: RequestContext, product: Product) {
        this.addJobToQueue({ type: 'update-product', ctx: ctx.serialize(), productId: product.id });
    }

    updateVariants(ctx: RequestContext, variants: ProductVariant[]) {
        const variantIds = variants.map(v => v.id);
        this.addJobToQueue({ type: 'update-variants', ctx: ctx.serialize(), variantIds });
    }

    deleteProduct(ctx: RequestContext, product: Product) {
        this.addJobToQueue({ type: 'delete-product', ctx: ctx.serialize(), productId: product.id });
    }

    deleteVariant(ctx: RequestContext, variants: ProductVariant[]) {
        const variantIds = variants.map(v => v.id);
        this.addJobToQueue({ type: 'delete-variant', ctx: ctx.serialize(), variantIds });
    }

    updateVariantsById(ctx: RequestContext, ids: ID[]) {
        this.addJobToQueue({ type: 'update-variants-by-id', ctx: ctx.serialize(), ids });
    }

    updateAsset(ctx: RequestContext, asset: Asset) {
        this.addJobToQueue({ type: 'update-asset', ctx: ctx.serialize(), asset: asset as any });
    }

    deleteAsset(ctx: RequestContext, asset: Asset) {
        this.addJobToQueue({ type: 'delete-asset', ctx: ctx.serialize(), asset: asset as any });
    }

    assignProductToChannel(ctx: RequestContext, productId: ID, channelId: ID) {
        this.addJobToQueue({
            type: 'assign-product-to-channel',
            ctx: ctx.serialize(),
            productId,
            channelId,
        });
    }

    removeProductFromChannel(ctx: RequestContext, productId: ID, channelId: ID) {
        this.addJobToQueue({
            type: 'remove-product-from-channel',
            ctx: ctx.serialize(),
            productId,
            channelId,
        });
    }

    assignVariantToChannel(ctx: RequestContext, productVariantId: ID, channelId: ID) {
        this.addJobToQueue({
            type: 'assign-variant-to-channel',
            ctx: ctx.serialize(),
            productVariantId,
            channelId,
        });
    }

    removeVariantFromChannel(ctx: RequestContext, productVariantId: ID, channelId: ID) {
        this.addJobToQueue({
            type: 'remove-variant-from-channel',
            ctx: ctx.serialize(),
            productVariantId,
            channelId,
        });
    }

    private addJobToQueue(data: UpdateIndexQueueJobData) {
        if (updateIndexQueue) {
            return updateIndexQueue.add(data);
        }
    }

    private sendMessage(job: Job<any>, message: WorkerMessage<any, any>) {
        this.workerService.send(message).subscribe({
            complete: () => job.complete(true),
            error: err => {
                Logger.error(err);
                job.fail(err);
            },
        });
    }

    private sendMessageWithProgress(job: Job<any>, message: ReindexMessage | UpdateVariantsByIdMessage) {
        let total: number | undefined;
        let duration = 0;
        let completed = 0;
        this.workerService.send(message).subscribe({
            next: (response: ReindexMessageResponse) => {
                if (!total) {
                    total = response.total;
                }
                duration = response.duration;
                completed = response.completed;
                const progress = Math.ceil((completed / total) * 100);
                job.setProgress(progress);
            },
            complete: () => {
                job.complete({
                    success: true,
                    indexedItemCount: total,
                    timeTaken: duration,
                });
            },
            error: (err: any) => {
                Logger.error(JSON.stringify(err));
                job.fail();
            },
        });
    }
}
