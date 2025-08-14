import { Injector } from '@vendure/core';
import { Serializable } from 'node:child_process';

import { DASHBOARD_PLUGIN_OPTIONS } from '../constants';
import { SearchIndexingStrategy } from '../search-index/search-indexing.strategy';

import { DataProcessorInterface } from './data-processor.interface';

export abstract class BaseDataProcessor implements DataProcessorInterface {
    protected searchIndexingStrategy: SearchIndexingStrategy;

    init(injector: Injector) {
        const options = injector.get(DASHBOARD_PLUGIN_OPTIONS);
        this.searchIndexingStrategy = options.globalSearch?.indexingStrategy as SearchIndexingStrategy;
    }

    getBatchSize(): number {
        throw new Error('Not implemented');
    }

    getTotalResults(): Promise<number> {
        throw new Error('Not implemented');
    }

    processOne(id: string): Promise<void> {
        throw new Error('Not implemented');
    }

    processBatch(
        skip: number,
        limit: number,
        metadata: Record<string, Serializable> | undefined,
    ): AsyncGenerator<void> {
        throw new Error('Not implemented');
    }
}
