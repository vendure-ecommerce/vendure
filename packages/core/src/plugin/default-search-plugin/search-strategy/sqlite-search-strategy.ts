import { LogicalOperator, SearchInput, SearchResult } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { Brackets, SelectQueryBuilder } from 'typeorm';

import { RequestContext } from '../../../api/common/request-context';
import { UserInputError } from '../../../common/error/errors';
import { TransactionalConnection } from '../../../service/transaction/transactional-connection';
import { SearchIndexItem } from '../search-index-item.entity';

import { SearchStrategy } from './search-strategy';
import { createCollectionIdCountMap, createFacetIdCountMap, mapToSearchResult } from './search-strategy-utils';

/**
 * A rather naive search for SQLite / SQL.js. Rather than proper
 * full-text searching, it uses a weighted `LIKE "%term%"` operator instead.
 */
export class SqliteSearchStrategy implements SearchStrategy {
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
            .select(['productId', 'productVariantId'])
            .addSelect('GROUP_CONCAT(si.facetValueIds)', 'facetValues');

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
            .select(['productId', 'productVariantId'])
            .addSelect('GROUP_CONCAT(si.collectionIds)', 'collections');

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
        const qb = this.connection.getRepository(SearchIndexItem).createQueryBuilder('si');
        if (input.groupByProduct) {
            qb.addSelect('MIN(price)', 'minPrice').addSelect('MAX(price)', 'maxPrice');
            qb.addSelect('MIN(priceWithTax)', 'minPriceWithTax').addSelect(
                'MAX(priceWithTax)',
                'maxPriceWithTax',
            );
        }
        this.applyTermAndFilters(ctx, qb, input);
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
        } else {
            qb.addOrderBy('productVariantId', 'ASC');
        }
        if (enabledOnly) {
            qb.andWhere('si.enabled = :enabled', { enabled: true });
        }

        return await qb
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
        if (facetValueIds?.length) {
            qb.andWhere(
                new Brackets(qb1 => {
                    for (const id of facetValueIds) {
                        const placeholder = '_' + id;
                        const clause = `(',' || facetValueIds || ',') LIKE :${placeholder}`;
                        const params = { [placeholder]: `%,${id},%` };
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
                                    const clause = `(',' || facetValueIds || ',') LIKE :${placeholder}`;
                                    const params = { [placeholder]: `%,${facetValueFilter.and},%` };
                                    qb2.where(clause, params);
                                }
                                if (facetValueFilter.or?.length) {
                                    for (const id of facetValueFilter.or) {
                                        const placeholder = '_' + id;
                                        const clause = `(',' || facetValueIds || ',') LIKE :${placeholder}`;
                                        const params = { [placeholder]: `%,${id},%` };
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
            qb.andWhere(`(',' || collectionIds || ',') LIKE :collectionId`, {
                collectionId: `%,${collectionId},%`,
            });
        }
        if (collectionSlug) {
            qb.andWhere(`(',' || collectionSlugs || ',') LIKE :collectionSlug`, {
                collectionSlug: `%,${collectionSlug},%`,
            });
        }
        qb.andWhere('languageCode = :languageCode', { languageCode: ctx.languageCode });
        qb.andWhere('channelId = :channelId', { channelId: ctx.channelId });
        if (input.groupByProduct === true) {
            qb.groupBy('productId');
        }
        return qb;
    }
}
