import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { pick } from '@vendure/common/lib/pick';
import { ChildProcess, fork } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { Connection } from 'typeorm';
import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';

import { RequestContext } from '../../api/common/request-context';
import { ConfigService } from '../../config/config.service';
import { Logger } from '../../config/logger/vendure-logger';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { JobReporter } from '../../service/helpers/job-manager/job-manager';
import { translateDeep } from '../../service/helpers/utils/translate-entity';
import { ProductVariantService } from '../../service/services/product-variant.service';

import {
    CompletedMessage,
    ConnectedMessage,
    ConnectionOptionsMessage,
    GetRawBatchMessage,
    MessageOfType,
    MessageType,
    ReturnRawBatchMessage,
    SaveVariantsMessage,
    sendIPCMessage,
    VariantsSavedMessage,
} from './ipc';
import { SearchIndexItem } from './search-index-item.entity';
import { BATCH_SIZE, variantRelations } from './search-index-worker';

export type IncomingMessage = ConnectedMessage | ReturnRawBatchMessage | VariantsSavedMessage | CompletedMessage;

@Injectable()
export class SearchIndexService {
    private workerProcess: ChildProcess;

    constructor(@InjectConnection() private connection: Connection,
                private productVariantService: ProductVariantService,
                private configService: ConfigService) {}

    /**
     * Creates the search index worker process and has it connect to the database.
     */
    async connect() {
        try {
            this.workerProcess = this.getChildProcess(path.join(__dirname, 'search-index-worker.ts'));
        } catch (e) {
            Logger.error(e);
        }
        Logger.verbose(`Created search index worker process`, 'DefaultSearchPlugin');
        this.workerProcess.on('error', err => `Search index worker error: ` + err.message);
        await this.establishConnection(this.workerProcess);
    }

    async reindex(ctx: RequestContext, reporter: JobReporter) {
        const timeStart = Date.now();
        Logger.verbose('Reindexing search index...', 'DefaultSearchPlugin');
        const qb = await this.connection.getRepository(ProductVariant).createQueryBuilder('variants');
        FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, {
            relations: variantRelations,
        });
        FindOptionsUtils.joinEagerRelations(qb, qb.alias, this.connection.getMetadata(ProductVariant));
        const count = await qb.where('variants__product.deletedAt IS NULL').getCount();
        Logger.verbose(`Getting ${count} variants`, 'DefaultSearchPlugin');
        const batches = Math.ceil(count / BATCH_SIZE);

        Logger.verbose('Deleting existing index items...', 'DefaultSearchPlugin');
        await this.connection.getRepository(SearchIndexItem).delete({ languageCode: ctx.languageCode });
        Logger.verbose('Deleted!', 'DefaultSearchPlugin');

        return new Promise(async (resolve, reject) => {
            this.subscribe(MessageType.COMPLETED, (message, unsubscribe) => {
                Logger.verbose(`Reindexing completed in ${Date.now() - timeStart}ms`, 'DefaultSearchPlugin');
                unsubscribe();
                unsubscribeProgress();
                resolve({
                    success: true,
                    indexedItemCount: count,
                    timeTaken: Date.now() - timeStart,
                });
            });
            const unsubscribeProgress = this.subscribe(MessageType.VARIANTS_SAVED, (message, unsubscribe) => {
                reporter.setProgress(Math.ceil(((message.value.batchNumber + 1) / batches) * 100));
                Logger.verbose(`Completed batch ${message.value.batchNumber + 1} of ${batches}`, 'DefaultSearchPlugin');
            });

            for (let i = 0; i < batches; i++) {
                Logger.verbose(`Processing batch ${i + 1} of ${batches}`, 'DefaultSearchPlugin');

                const variants = await this.getBatch(this.workerProcess, i);
                const items = variants
                    .map((v: any) => this.productVariantService.applyChannelPriceAndTax(v, ctx))
                    .map((v: any) => translateDeep(v, ctx.languageCode, ['product']));

                sendIPCMessage(this.workerProcess, new SaveVariantsMessage({ variants: items, ctx, batch: i, total: batches }));
            }
        });
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

    establishConnection(child: ChildProcess): Promise<boolean> {
        const connectionOptions = pick(this.configService.dbConnectionOptions as any,
            ['type', 'name', 'database', 'host', 'port', 'username', 'password']);
        return new Promise(resolve => {
            sendIPCMessage(child, new ConnectionOptionsMessage(connectionOptions));
            this.subscribe(MessageType.CONNECTED, (message, unsubscribe) => {
                Logger.verbose(`Connection result: ${message.value}`, 'DefaultSearchPlugin');
                unsubscribe();
                resolve(message.value);
            });
        });
    }

    getBatch(child: ChildProcess, batch: number): Promise<ProductVariant[]> {
        return new Promise(resolve => {
            sendIPCMessage(child, new GetRawBatchMessage({ batchNumber: batch }));
            this.subscribe(MessageType.RETURN_RAW_BATCH, (message, unsubscribe) => {
                unsubscribe();
                resolve(message.value.variants);
            });
        });
    }

    /**
     * Subscribes to the given IPC message and executes the callback when the message is received. Returns an unsubscribe
     * function which should be called to clean up the event listener. Alternatively, if only the first such event is
     * important, call the `unsubscribe` function which is passed to the handler as the second argument.
     */
    private subscribe<T extends MessageType>(messageType: T, callback: (message: MessageOfType<T>, unsubscribe: () => void) => any): () => void {
        const handler = (messageString: string) => {
            const message = JSON.parse(messageString) as IncomingMessage;
            if (message.type === messageType) {
                callback(message as MessageOfType<T>, unsubscribe);
            }
        };
        const unsubscribe = () =>  this.workerProcess.off('message', handler);
        this.workerProcess.on('message', handler);
        return unsubscribe;
    }

}
