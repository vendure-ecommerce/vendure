import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ID } from '@vendure/common/lib/shared-types';
import { assertNever } from '@vendure/common/lib/shared-utils';
import { Observable } from 'rxjs';

import { RequestContext } from '../../../api/common/request-context';
import { Logger } from '../../../config/logger/vendure-logger';
import { Asset } from '../../../entity/asset/asset.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { Product } from '../../../entity/product/product.entity';
import { Job } from '../../../job-queue/job';
import { JobQueue } from '../../../job-queue/job-queue';
import { JobQueueService } from '../../../job-queue/job-queue.service';
import { ReindexMessageResponse, UpdateIndexQueueJobData } from '../types';

import { IndexerController } from './indexer.controller';

/**
 * This service is responsible for messaging the {@link IndexerController} with search index updates.
 */
@Injectable()
export class SearchIndexService implements OnApplicationBootstrap {
    private updateIndexQueue: JobQueue<UpdateIndexQueueJobData>;

    constructor(private jobService: JobQueueService, private indexerController: IndexerController) {}

    async onApplicationBootstrap() {
        this.updateIndexQueue = await this.jobService.createQueue({
            name: 'update-search-index',
            process: job => {
                const data = job.data;
                switch (data.type) {
                    case 'reindex':
                        Logger.verbose(`sending ReindexMessage`);
                        return this.jobWithProgress(job, this.indexerController.reindex(data));
                    case 'update-product':
                        return this.indexerController.updateProduct(data);
                    case 'update-variants':
                        return this.indexerController.updateVariants(data);
                    case 'delete-product':
                        return this.indexerController.deleteProduct(data);
                    case 'delete-variant':
                        return this.indexerController.deleteVariant(data);
                    case 'update-variants-by-id':
                        return this.jobWithProgress(job, this.indexerController.updateVariantsById(data));
                    case 'update-asset':
                        return this.indexerController.updateAsset(data);
                    case 'delete-asset':
                        return this.indexerController.deleteAsset(data);
                    case 'assign-product-to-channel':
                        return this.indexerController.assignProductToChannel(data);
                    case 'remove-product-from-channel':
                        return this.indexerController.removeProductFromChannel(data);
                    case 'assign-variant-to-channel':
                        return this.indexerController.assignVariantToChannel(data);
                    case 'remove-variant-from-channel':
                        return this.indexerController.removeVariantFromChannel(data);
                    default:
                        assertNever(data);
                        return Promise.resolve();
                }
            },
        });
    }

    reindex(ctx: RequestContext) {
        return this.updateIndexQueue.add({ type: 'reindex', ctx: ctx.serialize() });
    }

    updateProduct(ctx: RequestContext, product: Product) {
        this.updateIndexQueue.add({ type: 'update-product', ctx: ctx.serialize(), productId: product.id });
    }

    updateVariants(ctx: RequestContext, variants: ProductVariant[]) {
        const variantIds = variants.map(v => v.id);
        this.updateIndexQueue.add({ type: 'update-variants', ctx: ctx.serialize(), variantIds });
    }

    deleteProduct(ctx: RequestContext, product: Product) {
        this.updateIndexQueue.add({ type: 'delete-product', ctx: ctx.serialize(), productId: product.id });
    }

    deleteVariant(ctx: RequestContext, variants: ProductVariant[]) {
        const variantIds = variants.map(v => v.id);
        this.updateIndexQueue.add({ type: 'delete-variant', ctx: ctx.serialize(), variantIds });
    }

    updateVariantsById(ctx: RequestContext, ids: ID[]) {
        this.updateIndexQueue.add({ type: 'update-variants-by-id', ctx: ctx.serialize(), ids });
    }

    updateAsset(ctx: RequestContext, asset: Asset) {
        this.updateIndexQueue.add({ type: 'update-asset', ctx: ctx.serialize(), asset: asset as any });
    }

    deleteAsset(ctx: RequestContext, asset: Asset) {
        this.updateIndexQueue.add({ type: 'delete-asset', ctx: ctx.serialize(), asset: asset as any });
    }

    assignProductToChannel(ctx: RequestContext, productId: ID, channelId: ID) {
        this.updateIndexQueue.add({
            type: 'assign-product-to-channel',
            ctx: ctx.serialize(),
            productId,
            channelId,
        });
    }

    removeProductFromChannel(ctx: RequestContext, productId: ID, channelId: ID) {
        this.updateIndexQueue.add({
            type: 'remove-product-from-channel',
            ctx: ctx.serialize(),
            productId,
            channelId,
        });
    }

    assignVariantToChannel(ctx: RequestContext, productVariantId: ID, channelId: ID) {
        this.updateIndexQueue.add({
            type: 'assign-variant-to-channel',
            ctx: ctx.serialize(),
            productVariantId,
            channelId,
        });
    }

    removeVariantFromChannel(ctx: RequestContext, productVariantId: ID, channelId: ID) {
        this.updateIndexQueue.add({
            type: 'remove-variant-from-channel',
            ctx: ctx.serialize(),
            productVariantId,
            channelId,
        });
    }

    private jobWithProgress(
        job: Job<UpdateIndexQueueJobData>,
        ob: Observable<ReindexMessageResponse>,
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            let total: number | undefined;
            let duration = 0;
            let completed = 0;
            ob.subscribe({
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
