import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { JobInfo, SearchInput, SearchResponse } from '@vendure/common/lib/generated-types';
import { Omit } from '@vendure/common/lib/omit';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { InternalServerError } from '../../common/error/errors';
import { FacetValue } from '../../entity';
import { EventBus } from '../../event-bus/event-bus';
import { FacetValueService } from '../../service/services/facet-value.service';
import { JobService } from '../../service/services/job.service';
import { ProductVariantService } from '../../service/services/product-variant.service';
import { SearchService } from '../../service/services/search.service';

import { SearchIndexService } from './indexer/search-index.service';
import { MysqlSearchStrategy } from './search-strategy/mysql-search-strategy';
import { PostgresSearchStrategy } from './search-strategy/postgres-search-strategy';
import { SearchStrategy } from './search-strategy/search-strategy';
import { SqliteSearchStrategy } from './search-strategy/sqlite-search-strategy';

/**
 * Search indexing and full-text search for supported databases. See the various
 * SearchStrategy implementations for db-specific code.
 */
@Injectable()
export class FulltextSearchService implements SearchService {
    private searchStrategy: SearchStrategy;
    private readonly minTermLength = 2;

    constructor(
        @InjectConnection() private connection: Connection,
        private jobService: JobService,
        private eventBus: EventBus,
        private facetValueService: FacetValueService,
        private productVariantService: ProductVariantService,
        private searchIndexService: SearchIndexService,
    ) {
        this.setSearchStrategy();
    }

    /**
     * Perform a fulltext search according to the provided input arguments.
     */
    async search(ctx: RequestContext, input: SearchInput, enabledOnly: boolean = false): Promise<Omit<SearchResponse, 'facetValues'>> {
        const items = await this.searchStrategy.getSearchResults(ctx, input, enabledOnly);
        const totalItems = await this.searchStrategy.getTotalCount(ctx, input, enabledOnly);
        return {
            items,
            totalItems,
        };
    }

    /**
     * Return a list of all FacetValues which appear in the result set.
     */
    async facetValues(
        ctx: RequestContext,
        input: SearchInput,
        enabledOnly: boolean = false,
    ): Promise<Array<{ facetValue: FacetValue; count: number }>> {
        const facetValueIdsMap = await this.searchStrategy.getFacetValueIds(ctx, input, enabledOnly);
        const facetValues = await this.facetValueService.findByIds(
            Array.from(facetValueIdsMap.keys()),
            ctx.languageCode,
        );
        return facetValues.map((facetValue, index) => {
            return {
                facetValue,
                count: facetValueIdsMap.get(facetValue.id.toString()) as number,
            };
        });
    }

    /**
     * Rebuilds the full search index.
     */
    async reindex(ctx: RequestContext): Promise<JobInfo> {
        const job = this.searchIndexService.reindex(ctx);
        job.start();
        return job;
    }

    /**
     * Sets the SearchStrategy appropriate to th configured database type.
     */
    private setSearchStrategy() {
        switch (this.connection.options.type) {
            case 'mysql':
            case 'mariadb':
                this.searchStrategy = new MysqlSearchStrategy(this.connection);
                break;
            case 'sqlite':
            case 'sqljs':
                this.searchStrategy = new SqliteSearchStrategy(this.connection);
                break;
            case 'postgres':
                this.searchStrategy = new PostgresSearchStrategy(this.connection);
                break;
            default:
                throw new InternalServerError(`error.database-not-supported-by-default-search-plugin`);
        }
    }
}
