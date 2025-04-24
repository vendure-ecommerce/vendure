import { Inject, Injectable } from '@nestjs/common';
import { GlobalSearchInput } from '@vendure/common/lib/generated-types';
import { RequestContext } from '@vendure/core';

import { PLUGIN_INIT_OPTIONS } from '../constants';
import { GlobalSearchStrategy } from '../search-strategy/global-search-strategy';
import { DashboardPluginOptions } from '../types';

@Injectable()
export class SearchService {
    private readonly searchStrategy: GlobalSearchStrategy;

    constructor(@Inject(PLUGIN_INIT_OPTIONS) private readonly options: DashboardPluginOptions) {
        this.searchStrategy = options.searchStrategy;
    }

    async search(ctx: RequestContext, input: GlobalSearchInput) {
        return this.searchStrategy.getSearchResults(ctx, input);
    }
}
