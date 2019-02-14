import { Brackets, Connection, SelectQueryBuilder } from 'typeorm';

import { SearchInput, SearchResult } from '../../../../../shared/generated-types';
import { ID } from '../../../../../shared/shared-types';
import { unique } from '../../../../../shared/unique';
import { RequestContext } from '../../../api/common/request-context';
import { SearchIndexItem } from '../search-index-item.entity';

import { mapToSearchResult } from './map-to-search-result';
import { SearchStrategy } from './search-strategy';

/**
 * A rather naive search for SQLite / SQL.js. Rather than proper
 * full-text searching, it uses a weighted `LIKE "%term%"` operator instead.
 */
export class SqliteSearchStrategy implements SearchStrategy {
    private readonly minTermLength = 2;

    constructor(private connection: Connection) {}

    async getFacetValueIds(ctx: RequestContext, input: SearchInput): Promise<ID[]> {
        const facetValuesQb = this.connection
            .getRepository(SearchIndexItem)
            .createQueryBuilder('si')
            .select('GROUP_CONCAT(si.facetValueIds)', 'allFacetValues');

        const facetValuesResult = await this.applyTermAndFilters(facetValuesQb, input).getRawOne();
        const allFacetValues = facetValuesResult ? facetValuesResult.allFacetValues || '' : '';
        return unique(allFacetValues.split(',').filter(x => x !== ''));
    }

    async getSearchResults(ctx: RequestContext, input: SearchInput): Promise<SearchResult[]> {
        const take = input.take || 25;
        const skip = input.skip || 0;
        const qb = this.connection.getRepository(SearchIndexItem).createQueryBuilder('si');
        this.applyTermAndFilters(qb, input);
        if (input.term && input.term.length > this.minTermLength) {
            qb.orderBy('score', 'DESC');
        }

        return await qb
            .take(take)
            .skip(skip)
            .getRawMany()
            .then(res => res.map(r => mapToSearchResult(r, ctx.channel.currencyCode)));
    }

    async getTotalCount(ctx: RequestContext, input: SearchInput): Promise<number> {
        const innerQb = this.applyTermAndFilters(
            this.connection.getRepository(SearchIndexItem).createQueryBuilder('si'),
            input,
        );

        const totalItemsQb = this.connection
            .createQueryBuilder()
            .select('COUNT(*) as total')
            .from(`(${innerQb.getQuery()})`, 'inner')
            .setParameters(innerQb.getParameters());
        return totalItemsQb.getRawOne().then(res => res.total);
    }

    private applyTermAndFilters(
        qb: SelectQueryBuilder<SearchIndexItem>,
        input: SearchInput,
    ): SelectQueryBuilder<SearchIndexItem> {
        const { term, facetIds } = input;

        qb.where('1 = 1');
        if (term && term.length > this.minTermLength) {
            // Note: SQLite does not natively have fulltext search capabilities,
            // so we just use a weighted LIKE match
            qb.addSelect(
                `
                    CASE WHEN sku LIKE :like_term THEN 10 ELSE 0 END +
                    CASE WHEN productName LIKE :like_term THEN 3 ELSE 0 END +
                    CASE WHEN productVariantName LIKE :like_term THEN 2 ELSE 0 END +
                    CASE WHEN description LIKE :like_term THEN 1 ELSE 0 END`,
                'score',
            )
                .andWhere(
                    new Brackets(qb1 => {
                        qb1.where('sku LIKE :like_term')
                            .orWhere('productName LIKE :like_term')
                            .orWhere('productVariantName LIKE :like_term')
                            .orWhere('description LIKE :like_term');
                    }),
                )
                .setParameters({ term, like_term: `%${term}%` });
        }
        if (facetIds) {
            for (const id of facetIds) {
                const placeholder = '_' + id;
                qb.andWhere(`(',' || facetValueIds || ',') LIKE :${placeholder}`, {
                    [placeholder]: `%,${id},%`,
                });
            }
        }
        if (input.groupByProduct === true) {
            qb.groupBy('productId');
        }
        return qb;
    }
}
