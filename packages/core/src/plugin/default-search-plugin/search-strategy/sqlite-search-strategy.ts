import { SearchInput, SearchResult } from '@vendure/common/generated-types';
import { ID } from '@vendure/common/shared-types';
import { unique } from '@vendure/common/unique';
import { Brackets, Connection, SelectQueryBuilder } from 'typeorm';

import { RequestContext } from '../../../api/common/request-context';
import { SearchIndexItem } from '../search-index-item.entity';

import { SearchStrategy } from './search-strategy';
import { createFacetIdCountMap, mapToSearchResult } from './search-strategy-utils';

/**
 * A rather naive search for SQLite / SQL.js. Rather than proper
 * full-text searching, it uses a weighted `LIKE "%term%"` operator instead.
 */
export class SqliteSearchStrategy implements SearchStrategy {
    private readonly minTermLength = 2;

    constructor(private connection: Connection) {}

    async getFacetValueIds(ctx: RequestContext, input: SearchInput): Promise<Map<ID, number>> {
        const facetValuesQb = this.connection
            .getRepository(SearchIndexItem)
            .createQueryBuilder('si')
            .select(['productId', 'productVariantId'])
            .addSelect('GROUP_CONCAT(si.facetValueIds)', 'facetValues');

        this.applyTermAndFilters(facetValuesQb, input);
        if (!input.groupByProduct) {
            facetValuesQb.groupBy('productVariantId');
        }
        const facetValuesResult = await facetValuesQb.getRawMany();
        return createFacetIdCountMap(facetValuesResult);
    }

    async getSearchResults(ctx: RequestContext, input: SearchInput): Promise<SearchResult[]> {
        const take = input.take || 25;
        const skip = input.skip || 0;
        const sort = input.sort;
        const qb = this.connection.getRepository(SearchIndexItem).createQueryBuilder('si');
        if (input.groupByProduct) {
            qb.addSelect('MIN(price)', 'minPrice').addSelect('MAX(price)', 'maxPrice');
            qb.addSelect('MIN(priceWithTax)', 'minPriceWithTax').addSelect(
                'MAX(priceWithTax)',
                'maxPriceWithTax',
            );
        }
        this.applyTermAndFilters(qb, input);
        if (input.term && input.term.length > this.minTermLength) {
            qb.orderBy('score', 'DESC');
        }
        if (sort) {
            if (sort.name) {
                qb.addOrderBy('productName', sort.name);
            }
            if (sort.price) {
                qb.addOrderBy('price', sort.price);
            }
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
        const { term, facetIds, collectionId } = input;

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
        if (collectionId) {
            qb.andWhere(`(',' || collectionIds || ',') LIKE :collectionId`, {
                collectionId: `%,${collectionId},%`,
            });
        }
        if (input.groupByProduct === true) {
            qb.groupBy('productId');
        }
        return qb;
    }
}
