import { LogicalOperator, SearchInput, SearchResult } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { Brackets, SelectQueryBuilder } from 'typeorm';

import { RequestContext } from '../../../api/common/request-context';
import { UserInputError } from '../../../common/error/errors';
import { TransactionalConnection } from '../../../service/transaction/transactional-connection';
import { SearchIndexItem } from '../search-index-item.entity';

import { SearchStrategy } from './search-strategy';
import { fieldsToSelect } from './search-strategy-common';
import { createCollectionIdCountMap, createFacetIdCountMap, mapToSearchResult } from './search-strategy-utils';

/**
 * A weighted fulltext search for MySQL / MariaDB.
 */
export class MysqlSearchStrategy implements SearchStrategy {
    private readonly minTermLength = 2;

    constructor(private connection: TransactionalConnection) {}

    async getFacetValueIds(
        ctx: RequestContext,
        input: SearchInput,
        enabledOnly: boolean,
    ): Promise<Map<ID, number>> {
        const facetValuesQb = this.connection
            .getRepository(SearchIndexItem)
            .createQueryBuilder('si')
            .select(['MIN(productId)', 'MIN(productVariantId)'])
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

    async getCollectionIds(
        ctx: RequestContext,
        input: SearchInput,
        enabledOnly: boolean,
    ): Promise<Map<ID, number>> {
        const collectionsQb = this.connection
            .getRepository(SearchIndexItem)
            .createQueryBuilder('si')
            .select(['MIN(productId)', 'MIN(productVariantId)'])
            .addSelect('GROUP_CONCAT(collectionIds)', 'collections');

        this.applyTermAndFilters(ctx, collectionsQb, input);
        if (!input.groupByProduct) {
            collectionsQb.groupBy('productVariantId');
        }
        if (enabledOnly) {
            collectionsQb.andWhere('si.enabled = :enabled', { enabled: true });
        }
        const collectionsResult = await collectionsQb.getRawMany();
        return createCollectionIdCountMap(collectionsResult);
    }

    async getSearchResults(
        ctx: RequestContext,
        input: SearchInput,
        enabledOnly: boolean,
    ): Promise<SearchResult[]> {
        const take = input.take || 25;
        const skip = input.skip || 0;
        const sort = input.sort;
        const qb = this.connection
            .getRepository(SearchIndexItem)
            .createQueryBuilder('si')
            .select(this.createMysqlSelect(!!input.groupByProduct));
        if (input.groupByProduct) {
            qb.addSelect('MIN(price)', 'minPrice')
                .addSelect('MAX(price)', 'maxPrice')
                .addSelect('MIN(priceWithTax)', 'minPriceWithTax')
                .addSelect('MAX(priceWithTax)', 'maxPriceWithTax');
        }
        this.applyTermAndFilters(ctx, qb, input);
        if (sort) {
            if (sort.name) {
                qb.addOrderBy(input.groupByProduct ? 'MIN(productName)' : 'productName', sort.name);
            }
            if (sort.price) {
                qb.addOrderBy(input.groupByProduct ? 'MIN(price)' : 'price', sort.price);
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
            this.connection
                .getRepository(SearchIndexItem)
                .createQueryBuilder('si')
                .select(this.createMysqlSelect(!!input.groupByProduct)),
            input,
        );
        if (enabledOnly) {
            innerQb.andWhere('si.enabled = :enabled', { enabled: true });
        }

        const totalItemsQb = this.connection.rawConnection
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
        const {
            term,
            facetValueFilters,
            facetValueIds,
            facetValueOperator,
            collectionId,
            collectionSlug,
        } = input;

        if (term && term.length > this.minTermLength) {
            const termScoreQuery = this.connection
                .getRepository(SearchIndexItem)
                .createQueryBuilder('si_inner')
                .select('si_inner.productId', 'inner_productId')
                .addSelect('si_inner.productVariantId', 'inner_productVariantId')
                .addSelect(`IF (sku LIKE :like_term, 10, 0)`, 'sku_score')
                .addSelect(
                    `(SELECT sku_score) +
                     MATCH (productName) AGAINST (:term) * 2 +
                     MATCH (productVariantName) AGAINST (:term) * 1.5 +
                     MATCH (description) AGAINST (:term)* 1`,
                    'score',
                )
                .where(
                    new Brackets(qb1 => {
                        qb1.where('sku LIKE :like_term')
                            .orWhere('MATCH (productName) AGAINST (:term)')
                            .orWhere('MATCH (productVariantName) AGAINST (:term)')
                            .orWhere('MATCH (description) AGAINST (:term)');
                    }),
                )
                .andWhere('channelId = :channelId')
                .setParameters({ term, like_term: `%${term}%`, channelId: ctx.channelId });

            qb.innerJoin(`(${termScoreQuery.getQuery()})`, 'term_result', 'inner_productId = si.productId')
                .addSelect(input.groupByProduct ? 'MAX(term_result.score)' : 'term_result.score', 'score')
                .andWhere('term_result.inner_productVariantId = si.productVariantId')
                .setParameters(termScoreQuery.getParameters());
        } else {
            qb.addSelect('1 as score');
        }
        if (facetValueIds?.length) {
            qb.andWhere(
                new Brackets(qb1 => {
                    for (const id of facetValueIds) {
                        const placeholder = '_' + id;
                        const clause = `FIND_IN_SET(:${placeholder}, facetValueIds)`;
                        const params = { [placeholder]: id };
                        if (facetValueOperator === LogicalOperator.AND) {
                            qb1.andWhere(clause, params);
                        } else {
                            qb1.orWhere(clause, params);
                        }
                    }
                }),
            );
        }
        if (facetValueFilters?.length) {
            qb.andWhere(
                new Brackets(qb1 => {
                    for (const facetValueFilter of facetValueFilters) {
                        qb1.andWhere(
                            new Brackets(qb2 => {
                                if (facetValueFilter.and && facetValueFilter.or?.length) {
                                    throw new UserInputError('error.facetfilterinput-invalid-input');
                                }
                                if (facetValueFilter.and) {
                                    const placeholder = '_' + facetValueFilter.and;
                                    const clause = `FIND_IN_SET(:${placeholder}, facetValueIds)`;
                                    const params = { [placeholder]: facetValueFilter.and };
                                    qb2.where(clause, params);
                                }
                                if (facetValueFilter.or?.length) {
                                    for (const id of facetValueFilter.or) {
                                        const placeholder = '_' + id;
                                        const clause = `FIND_IN_SET(:${placeholder}, facetValueIds)`;
                                        const params = { [placeholder]: id };
                                        qb2.orWhere(clause, params);
                                    }
                                }
                            }),
                        );
                    }
                }),
            );
        }
        if (collectionId) {
            qb.andWhere(`FIND_IN_SET (:collectionId, collectionIds)`, { collectionId });
        }
        if (collectionSlug) {
            qb.andWhere(`FIND_IN_SET (:collectionSlug, collectionSlugs)`, { collectionSlug });
        }
        qb.andWhere('languageCode = :languageCode', { languageCode: ctx.languageCode });
        qb.andWhere('channelId = :channelId', { channelId: ctx.channelId });
        if (input.groupByProduct === true) {
            qb.groupBy('productId');
            qb.addSelect('BIT_OR(enabled)', 'productEnabled');
        }
        return qb;
    }
    /**
     * When a select statement includes a GROUP BY clause,
     * then all selected columns must be aggregated. So we just apply the
     * "MIN" function in this case to all other columns than the productId.
     */
    private createMysqlSelect(groupByProduct: boolean): string {
        return fieldsToSelect
            .map(col => {
                const qualifiedName = `si.${col}`;
                const alias = `si_${col}`;
                if (groupByProduct && col !== 'productId') {
                    if (
                        col === 'facetIds' ||
                        col === 'facetValueIds' ||
                        col === 'collectionIds' ||
                        col === 'channelIds'
                    ) {
                        return `GROUP_CONCAT(${qualifiedName}) as "${alias}"`;
                    } else if (col === 'enabled') {
                        return `MAX(${qualifiedName}) as "${alias}"`;
                    } else {
                        return `MIN(${qualifiedName}) as "${alias}"`;
                    }
                } else {
                    return `${qualifiedName} as "${alias}"`;
                }
            })
            .join(', ');
    }
}
