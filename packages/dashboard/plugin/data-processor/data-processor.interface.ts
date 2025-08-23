import { Injector } from '@vendure/core';
import { Serializable } from 'node:child_process';

export interface DataProcessorInterface {
    init(injector: Injector): void;

    /**
     * @description
     * Returns the total number of results that can be expected from this search index.
     * It will be used to determine the number of batches that will be processed
     */
    getTotalResults(metadata: Record<string, Serializable> | undefined): Promise<number>;

    /**
     * @description
     * Returns the number of results that should be processed within a single batch
     */
    getBatchSize(): number;

    /**
     * @description Processes a batch of results
     * @param skip
     * @param limit
     * @param metadata
     */
    processBatch(
        skip: number,
        limit: number,
        metadata: Record<string, Serializable> | undefined,
    ): AsyncGenerator<void>;

    /**
     * @description Processes a single result by its ID
     * @param id
     * @param metadata
     */
    processOne(id: string, metadata: Record<string, Serializable> | undefined): Promise<void>;
}
