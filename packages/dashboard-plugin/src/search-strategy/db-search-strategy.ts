import { Injectable } from '@nestjs/common';
import { GlobalSearchInput, GlobalSearchResult } from '@vendure/common/lib/generated-types';
import { Injector, RequestContext, TransactionalConnection } from '@vendure/core';

import { GlobalSearchStrategy } from './global-search-strategy';

@Injectable()
export class DbSearchStrategy implements GlobalSearchStrategy {
    private connection: TransactionalConnection;

    init(injector: Injector): void | Promise<void> {
        this.connection = injector.get(TransactionalConnection);
    }

    getSearchResults(ctx: RequestContext, input: GlobalSearchInput): Promise<GlobalSearchResult[]> {
        throw new Error('Method not implemented.');
    }
    getTotalCount(ctx: RequestContext, input: GlobalSearchInput): Promise<number> {
        throw new Error('Method not implemented.');
    }
}
