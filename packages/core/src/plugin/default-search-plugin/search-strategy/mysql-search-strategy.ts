import { SearchInput, SearchResult } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';
import { Brackets, Connection, SelectQueryBuilder } from 'typeorm';

import { RequestContext } from '../../../api/common/request-context';
import { SearchIndexItem } from '../search-index-item.entity';

import { SearchStrategy } from './search-strategy';
import { createFacetIdCountMap, mapToSearchResult } from './search-strategy-utils';

/**
 * A weighted fulltext search for MySQL / MariaDB.
 */
export class MysqlSearchStrategy implements SearchStrategy {
    private readonly minTermLength = 2;

    constructor(private connection: Connection) {}

    async getFacetValueIds(
        ctx: RequestContext,
        input: SearchInput,
        enabledOnly: boolean,
    ): Promise<Map<ID, number>> {
        const facetValuesQb = this.connection
            .getRepository(SearchIndexItem)
            .createQueryBuilder('si')
            .select(['productId', 'productVariantId'])
            .addSelect('GROUP_CONCAT(facetValueIds)', 'facetValues');

        this.applyTermAndFilters(ctx, facetValuesQb, input);
        if (!input.groupByProduct) {
            facetValuesQb.groupBy('productVariantId');
        }
        if (enabledOnly) {
            facetValuesQb.andWhere('si.enabled = :enabled', { enabled: true });
        }
        const facetValuesResult = await facetValuesQb.getRawMany();
        return createFacetIdCountMap(facetValuesResult);
    }

    async getSearchResults(
        ctx: RequestContext,
        input: SearchInput,
        enabledOnly: boolean,
    ): Promise<SearchResult[]> {
        const take = input.take || 25;
        const skip = input.skip || 0;
        const sort = input.sort;
        const qb = this.connection.getRepository(SearchIndexItem).createQueryBuilder('si');
        if (input.groupByProduct) {
            qb.addSelect('MIN(price)', 'minPrice')
                .addSelect('MAX(price)', 'maxPrice')
                .addSelect('MIN(priceWithTax)', 'minPriceWithTax')
                .addSelect('MAX(priceWithTax)', 'maxPriceWithTax');
        }
        this.applyTermAndFilters(ctx, qb, input);
        if (sort) {
            if (sort.name) {
                qb.addOrderBy('productName', sort.name);
            }
            if (sort.price) {
                qb.addOrderBy('price', sort.price);
            }
        } else {
            if (input.term && input.term.length > this.minTermLength) {
                qb.orderBy('score', 'DESC');
            }
        }
        if (enabledOnly) {
            qb.andWhere('si.enabled = :enabled', { enabled: true });
        }

        return qb
            .take(take)
            .skip(skip)
            .getRawMany()
            .then(res => res.map(r => mapToSearchResult(r, ctx.channel.currencyCode)));
    }

    async getTotalCount(ctx: RequestContext, input: SearchInput, enabledOnly: boolean): Promise<number> {
        const innerQb = this.applyTermAndFilters(
            ctx,
            this.connection.getRepository(SearchIndexItem).createQueryBuilder('si'),
            input,
        );
        if (enabledOnly) {
            innerQb.andWhere('si.enabled = :enabled', { enabled: true });
        }

        const totalItemsQb = this.connection
            .createQueryBuilder()
            .select('COUNT(*) as total')
            .from(`(${innerQb.getQuery()})`, 'inner')
            .setParameters(innerQb.getParameters());
        return totalItemsQb.getRawOne().then(res => res.total);
    }

    private applyTermAndFilters(
        ctx: RequestContext,
        qb: SelectQueryBuilder<SearchIndexItem>,
        input: SearchInput,
    ): SelectQueryBuilder<SearchIndexItem> {
        const { term, facetValueIds, collectionId } = input;

        qb.where('1 = 1');
        if (term && term.length > this.minTermLength) {
            qb.addSelect(`IF (sku LIKE :like_term, 10, 0)`, 'sku_score')
                .addSelect(
                    `
                            (SELECT sku_score) +
                            MATCH (productName) AGAINST (:term) * 2 +
                            MATCH (productVariantName) AGAINST (:term) * 1.5 +
                            MATCH (description) AGAINST (:term)* 1`,
                    'score',
                )
                .andWhere(
                    new Brackets(qb1 => {
                        qb1.where('sku LIKE :like_term')
                            .orWhere('MATCH (productName) AGAINST (:term)')
                            .orWhere('MATCH (productVariantName) AGAINST (:term)')
                            .orWhere('MATCH (description) AGAINST (:term)');
                    }),
                )
                .setParameters({ term, like_term: `%${term}%` });
        }
        if (facetValueIds) {
            for (const id of facetValueIds) {
                const placeholder = '_' + id;
                qb.andWhere(`FIND_IN_SET(:${placeholder}, facetValueIds)`, { [placeholder]: id });
            }
        }
        if (collectionId) {
            qb.andWhere(`FIND_IN_SET (:collectionId, collectionIds)`, { collectionId });
        }
        qb.andWhere('languageCode = :languageCode', { languageCode: ctx.languageCode });
        qb.andWhere('channelId = :channelId', { channelId: ctx.channelId });
        if (input.groupByProduct === true) {
            qb.groupBy('productId');
            qb.addSelect('BIT_OR(enabled)', 'productEnabled');
        }
        return qb;
    }
}
