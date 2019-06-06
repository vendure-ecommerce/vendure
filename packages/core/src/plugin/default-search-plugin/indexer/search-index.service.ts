import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { LanguageCode } from '@vendure/common/lib/generated-types';
import { pick } from '@vendure/common/lib/pick';
import { ID } from '@vendure/common/lib/shared-types';
import { ChildProcess, fork } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { Connection } from 'typeorm';

import { RequestContext } from '../../../api/common/request-context';
import { ConfigService } from '../../../config/config.service';
import { Logger } from '../../../config/logger/vendure-logger';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { Product } from '../../../entity/product/product.entity';
import { Job } from '../../../service/helpers/job-manager/job';
import { translateDeep } from '../../../service/helpers/utils/translate-entity';
import { JobService } from '../../../service/services/job.service';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { SEARCH_PLUGIN_OPTIONS } from '../constants';
import { DefaultSearchPluginOptions } from '../default-search-plugin';
import { SearchIndexItem } from '../search-index-item.entity';

import { BATCH_SIZE, getSearchIndexQueryBuilder, IndexBuilder, variantRelations } from './index-builder';
import {
    CompletedMessage,
    ConnectedMessage,
    ConnectionOptionsMessage,
    GetRawBatchByIdsMessage,
    GetRawBatchMessage,
    IpcChannel,
    MessageType,
    ReturnRawBatchMessage,
    SaveVariantsMessage,
    VariantsSavedMessage,
} from './ipc';
// This import is needed to ensure that the worker script gets compiled
// and emitted during build.
import './search-index-worker';

export type IncomingMessage = ConnectedMessage | ReturnRawBatchMessage | VariantsSavedMessage | CompletedMessage;
const loggerCtx = 'DefaultSearchPlugin';

/**
 * This service is responsible for all writes to the search index. It works together with the SearchIndexWorker
 * process to perform these often resource-intensive tasks in another thread, which keeps the main
 * server thread responsive.
 */
@Injectable()
export class SearchIndexService {
    private workerProcess: ChildProcess | IndexBuilder;
    private restartAttempts = 0;

    constructor(@InjectConnection() private connection: Connection,
                @Inject(SEARCH_PLUGIN_OPTIONS) private options: DefaultSearchPluginOptions,
                private productVariantService: ProductVariantService,
                private jobService: JobService,
                private configService: ConfigService) {}

    /**
     * Creates the search index worker process and has it connect to the database.
     */
    async connect() {
        if (this.options.runInForkedProcess && this.configService.dbConnectionOptions.type !== 'sqljs') {
            try {
                const workerProcess = this.getChildProcess(path.join(__dirname, 'search-index-worker.ts'));
                Logger.verbose(`IndexBuilder running as forked process`, loggerCtx);
                workerProcess.on('error', err => {
                    Logger.error(`IndexBuilder worker error: ` + err.message, loggerCtx);
                });
                workerProcess.on('close', () => {
                    this.restartAttempts++;
                    Logger.error(`IndexBuilder worker process died!`, loggerCtx);
                    if (this.restartAttempts <= 10) {
                        Logger.error(`Attempting to restart (${this.restartAttempts})...`, loggerCtx);
                        this.connect();
                    } else {
                        Logger.error(`Too many failed restart attempts. Sorry!`);
                    }
                });
                await this.establishConnection(workerProcess);
                this.workerProcess = workerProcess;
            } catch (e) {
                Logger.error(e);
            }

        } else {
            this.workerProcess = new IndexBuilder(this.connection);
            Logger.verbose(`IndexBuilder running in main process`, loggerCtx);
        }
    }

    reindex(ctx: RequestContext): Job {
        return this.jobService.createJob({
            name: 'reindex',
            singleInstance: true,
            work: async reporter => {
                const timeStart = Date.now();
                const qb = getSearchIndexQueryBuilder(this.connection);
                const count = await qb.where('variants__product.deletedAt IS NULL').getCount();
                Logger.verbose(`Reindexing ${count} variants`, loggerCtx);
                const batches = Math.ceil(count / BATCH_SIZE);

                await this.connection.getRepository(SearchIndexItem).delete({ languageCode: ctx.languageCode });
                Logger.verbose('Deleted existing index items', loggerCtx);

                return new Promise(async (resolve, reject) => {
                    const ipcChannel = new IpcChannel(this.workerProcess);
                    ipcChannel.subscribe(MessageType.COMPLETED, message => {
                        Logger.verbose(`Reindexing completed in ${Date.now() - timeStart}ms`, loggerCtx);
                        ipcChannel.close();
                        resolve({
                            success: true,
                            indexedItemCount: count,
                            timeTaken: Date.now() - timeStart,
                        });
                    });
                    ipcChannel.subscribe(MessageType.VARIANTS_SAVED, message => {
                        reporter.setProgress(Math.ceil(((message.value.batchNumber + 1) / batches) * 100));
                        Logger.verbose(`Completed batch ${message.value.batchNumber + 1} of ${batches}`, loggerCtx);
                    });

                    for (let i = 0; i < batches; i++) {
                        Logger.verbose(`Processing batch ${i + 1} of ${batches}`, loggerCtx);

                        const variants = await this.getBatch(this.workerProcess, i);
                        const hydratedVariants = this.hydrateVariants(ctx, variants);
                        Logger.verbose(`variants count: ${variants.length}`);

                        ipcChannel.send(new SaveVariantsMessage({
                            variants: hydratedVariants,
                            ctx,
                            batch: i,
                            total: batches,
                        }));
                    }
                });
            },
        });
    }

    /**
     * Updates the search index only for the affected entities.
     */
    async updateProductOrVariant(ctx: RequestContext, updatedEntity: Product | ProductVariant) {
        let updatedVariants: ProductVariant[] = [];
        let removedVariantIds: ID[] = [];
        if (updatedEntity instanceof Product) {
            const product = await this.connection.getRepository(Product).findOne(updatedEntity.id, {
                relations: ['variants'],
            });
            if (product) {
                if (product.deletedAt) {
                    removedVariantIds = product.variants.map(v => v.id);
                } else {
                    updatedVariants = await this.connection
                        .getRepository(ProductVariant)
                        .findByIds(product.variants.map(v => v.id), {
                            relations: variantRelations,
                        });
                    if (product.enabled === false) {
                        updatedVariants.forEach(v => v.enabled = false);
                    }
                }
            }
        } else {
            const variant = await this.connection.getRepository(ProductVariant).findOne(updatedEntity.id, {
                relations: variantRelations,
            });
            if (variant) {
                updatedVariants = [variant];
            }
        }

        if (updatedVariants.length) {
            await this.saveSearchIndexItems(ctx, updatedVariants);
        }
        if (removedVariantIds.length) {
            await this.removeSearchIndexItems(ctx.languageCode, removedVariantIds);
        }
    }

    async updateVariantsById(ctx: RequestContext, ids: ID[]) {
        return new Promise(async resolve => {
            if (ids.length) {
                const ipcChannel = new IpcChannel(this.workerProcess);
                const batches = Math.ceil(ids.length / BATCH_SIZE);
                Logger.verbose(`Updating ${ids.length} variants...`);

                ipcChannel.subscribe(MessageType.COMPLETED, message => {
                    Logger.verbose(`Completed updating variants`);
                    ipcChannel.close();
                    resolve();
                });

                for (let i = 0; i < batches; i++) {
                    const begin = i * BATCH_SIZE;
                    const end = begin + BATCH_SIZE;
                    Logger.verbose(`Updating ids from index ${begin} to ${end}`);
                    const batchIds = ids.slice(begin, end);
                    const batch = await this.getBatchByIds(this.workerProcess, batchIds);
                    const variants = this.hydrateVariants(ctx, batch);

                    ipcChannel.send(new SaveVariantsMessage({ variants, ctx, batch: i, total: batches }));
                }
            } else {
                resolve();
            }
        });
    }

    /**
     * Add or update items in the search index
     */
    private async saveSearchIndexItems(ctx: RequestContext, variants: ProductVariant[]) {
        const items = this.hydrateVariants(ctx, variants);
        Logger.verbose(`Updating search index for ${variants.length} variants`, loggerCtx);
        return new Promise(resolve => {
            const ipcChannel = new IpcChannel(this.workerProcess);
            ipcChannel.subscribe(MessageType.COMPLETED, message => {
                Logger.verbose(`Done!`, loggerCtx);
                ipcChannel.close();
                resolve();
            });
            ipcChannel.send(new SaveVariantsMessage({ variants: items, ctx, batch: 0, total: 1 }));
        });
    }

    /**
     * Remove items from the search index
     */
    private async removeSearchIndexItems(languageCode: LanguageCode, variantIds: ID[]) {
        const compositeKeys = variantIds.map(id => ({
            productVariantId: id,
            languageCode,
        })) as any[];
        await this.connection.getRepository(SearchIndexItem).delete(compositeKeys);
    }

    /**
     * Given an array of ProductVariants, this method applies the correct taxes and translations.
     */
    private hydrateVariants(ctx: RequestContext, variants: ProductVariant[]): ProductVariant[] {
        return variants
            .map(v => this.productVariantService.applyChannelPriceAndTax(v, ctx))
            .map(v => translateDeep(v, ctx.languageCode, ['product']));
    }

    /**
     * Forks a child process based on the given filename. The filename can be a JS or TS file, as this method will attempt to
     * use either (attempts JS first).
     */
    private getChildProcess(filename: string): ChildProcess {
        const ext = path.extname(filename);
        const fileWithoutExt = filename.replace(new RegExp(`${ext}$`), '');
        let error: any;
        try {
            const jsFile = fileWithoutExt + '.js';
            if (fs.existsSync(jsFile)) {
                return fork(jsFile, [], { execArgv: [] });
            }
        } catch (e) {
            // ignore and try ts
            error = e;
        }
        try {
            const tsFile = fileWithoutExt + '.ts';
            if (fs.existsSync(tsFile)) {
                // Fork the TS file using ts-node. This is useful when running in dev mode or
                // for e2e tests.
                return fork(tsFile, [], { execArgv: ['-r', 'ts-node/register'] });
            }
        } catch (e) {
            // ignore and thow at the end.
            error = e;
        }
        throw error;
    }

    private establishConnection(child: ChildProcess): Promise<boolean> {
        const connectionOptions = pick(this.configService.dbConnectionOptions as any,
            ['type', 'name', 'database', 'host', 'port', 'username', 'password', 'location', 'autoSave']);
        return new Promise(resolve => {
            const ipcChannel = new IpcChannel(child);
            ipcChannel.subscribe(MessageType.CONNECTED, message => {
                Logger.verbose(`IndexBuilder connection result: ${message.value}`, loggerCtx);
                ipcChannel.close();
                resolve(message.value);
            });
            ipcChannel.send(new ConnectionOptionsMessage(connectionOptions));
        });
    }

    private getBatch(child: ChildProcess | IndexBuilder, batch: number): Promise<ProductVariant[]> {
        return new Promise(resolve => {
            const ipcChannel = new IpcChannel(child);
            ipcChannel.subscribe(MessageType.RETURN_RAW_BATCH, message => {
                ipcChannel.close();
                resolve(message.value.variants);
            });
            ipcChannel.send(new GetRawBatchMessage({ batchNumber: batch }));
        });
    }

    private getBatchByIds(child: ChildProcess | IndexBuilder, ids: ID[]): Promise<ProductVariant[]> {
        return new Promise(resolve => {
            const ipcChannel = new IpcChannel(child);
            ipcChannel.subscribe(MessageType.RETURN_RAW_BATCH, message => {
                ipcChannel.close();
                resolve(message.value.variants);
            });
            ipcChannel.send(new GetRawBatchByIdsMessage({ ids }));
        });
    }

}
