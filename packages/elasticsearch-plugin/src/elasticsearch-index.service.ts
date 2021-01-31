import { Injectable } from '@nestjs/common';
import { assertNever } from '@vendure/common/lib/shared-utils';
import {
    Asset,
    ID,
    Job,
    JobQueue,
    JobQueueService,
    Logger,
    Product,
    ProductVariant,
    RequestContext,
    WorkerMessage,
    WorkerService,
} from '@vendure/core';

import { ReindexMessageResponse } from './indexer.controller';
import {
    AssignProductToChannelMessage,
    AssignVariantToChannelMessage,
    DeleteAssetMessage,
    DeleteProductMessage,
    DeleteVariantMessage,
    ReindexMessage,
    RemoveProductFromChannelMessage,
    RemoveVariantFromChannelMessage,
    UpdateAssetMessage,
    UpdateIndexQueueJobData,
    UpdateProductMessage,
    UpdateVariantMessage,
    UpdateVariantsByIdMessage,
} from './types';

let updateIndexQueue: JobQueue<UpdateIndexQueueJobData> | undefined;

@Injectable()
export class ElasticsearchIndexService {
    constructor(private workerService: WorkerService, private jobService: JobQueueService) {}

    initJobQueue() {
        updateIndexQueue = this.jobService.createQueue({
            name: 'update-search-index',
            process: job => {
                const data = job.data;
                switch (data.type) {
                    case 'reindex':
                        Logger.verbose(`sending ReindexMessage`);
                        return this.sendMessageWithProgress(job, new ReindexMessage(data));
                    case 'update-product':
                        return this.sendMessage(job, new UpdateProductMessage(data));
                    case 'update-variants':
                        return this.sendMessage(job, new UpdateVariantMessage(data));
                    case 'delete-product':
                        return this.sendMessage(job, new DeleteProductMessage(data));
                    case 'delete-variant':
                        return this.sendMessage(job, new DeleteVariantMessage(data));
                    case 'update-variants-by-id':
                        return this.sendMessageWithProgress(job, new UpdateVariantsByIdMessage(data));
                    case 'update-asset':
                        return this.sendMessage(job, new UpdateAssetMessage(data));
                    case 'delete-asset':
                        return this.sendMessage(job, new DeleteAssetMessage(data));
                    case 'assign-product-to-channel':
                        return this.sendMessage(job, new AssignProductToChannelMessage(data));
                    case 'remove-product-from-channel':
                        return this.sendMessage(job, new RemoveProductFromChannelMessage(data));
                    case 'assign-variant-to-channel':
                        return this.sendMessage(job, new AssignVariantToChannelMessage(data));
                    case 'remove-variant-from-channel':
                        return this.sendMessage(job, new RemoveVariantFromChannelMessage(data));
                    default:
                        assertNever(data);
                        return Promise.resolve();
                }
            },
        });
    }

    reindex(ctx: RequestContext, dropIndices: boolean) {
        return this.addJobToQueue({ type: 'reindex', ctx: ctx.serialize(), dropIndices });
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

    assignProductToChannel(ctx: RequestContext, product: Product, channelId: ID) {
        this.addJobToQueue({
            type: 'assign-product-to-channel',
            ctx: ctx.serialize(),
            productId: product.id,
            channelId,
        });
    }

    removeProductFromChannel(ctx: RequestContext, product: Product, channelId: ID) {
        this.addJobToQueue({
            type: 'remove-product-from-channel',
            ctx: ctx.serialize(),
            productId: product.id,
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

    updateVariantsById(ctx: RequestContext, ids: ID[]) {
        this.addJobToQueue({ type: 'update-variants-by-id', ctx: ctx.serialize(), ids });
    }

    updateAsset(ctx: RequestContext, asset: Asset) {
        this.addJobToQueue({ type: 'update-asset', ctx: ctx.serialize(), asset: asset as any });
    }

    deleteAsset(ctx: RequestContext, asset: Asset) {
        this.addJobToQueue({ type: 'delete-asset', ctx: ctx.serialize(), asset: asset as any });
    }

    private addJobToQueue(data: UpdateIndexQueueJobData) {
        if (updateIndexQueue) {
            return updateIndexQueue.add(data);
        }
    }

    private sendMessage(job: Job<any>, message: WorkerMessage<any, any>) {
        return new Promise((resolve, reject) => {
            this.workerService.send(message).subscribe({
                complete: () => resolve(true),
                error: err => {
                    Logger.error(err);
                    reject(err);
                },
            });
        });
    }

    private sendMessageWithProgress(job: Job<any>, message: WorkerMessage<any, ReindexMessageResponse>) {
        return new Promise((resolve, reject) => {
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
                    const progress = total === 0 ? 100 : Math.ceil((completed / total) * 100);
                    job.setProgress(progress);
                },
                complete: () => {
                    resolve({
                        success: true,
                        indexedItemCount: total,
                        timeTaken: duration,
                    });
                },
                error: (err: any) => {
                    Logger.error(JSON.stringify(err));
                    reject(err);
                },
            });
        });
    }
}
