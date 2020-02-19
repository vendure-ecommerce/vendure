import { SearchInput, SearchResult } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';
import { Brackets, Connection, SelectQueryBuilder } from 'typeorm';

import { RequestContext } from '../../../api/common/request-context';
import { SearchIndexItem } from '../search-index-item.entity';

import { SearchStrategy } from './search-strategy';
import { createFacetIdCountMap, mapToSearchResult } from './search-strategy-utils';

/**
 * A weighted fulltext search for PostgeSQL.
 */
export class PostgresSearchStrategy implements SearchStrategy {
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
            .select(['"si"."productId"', 'MAX("si"."productVariantId")'])
            .addSelect(`string_agg("si"."facetValueIds",',')`, 'facetValues');

        this.applyTermAndFilters(ctx, facetValuesQb, input, true);
        if (!input.groupByProduct) {
            facetValuesQb.groupBy('"si"."productVariantId", "si"."productId"');
        }
        if (enabledOnly) {
            facetValuesQb.andWhere('"si"."enabled" = :enabled', { enabled: true });
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
        const qb = this.connection
            .getRepository(SearchIndexItem)
            .createQueryBuilder('si')
            .select(this.createPostgresSelect(!!input.groupByProduct));
        if (input.groupByProduct) {
            qb.addSelect('MIN(price)', 'minPrice')
                .addSelect('MAX(price)', 'maxPrice')
                .addSelect('MIN("priceWithTax")', 'minPriceWithTax')
                .addSelect('MAX("priceWithTax")', 'maxPriceWithTax');
        }
        this.applyTermAndFilters(ctx, qb, input);

        if (sort) {
            if (sort.name) {
                qb.addOrderBy('"si_productName"', sort.name);
            }
            if (sort.price) {
                qb.addOrderBy('"si_price"', sort.price);
            }
        } else {
            if (input.term && input.term.length > this.minTermLength) {
                qb.addOrderBy('score', 'DESC');
            } else {
                qb.addOrderBy('"si_productVariantId"', 'ASC');
            }
        }
        if (enabledOnly) {
            qb.andWhere('"si"."enabled" = :enabled', { enabled: true });
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
                .select(this.createPostgresSelect(!!input.groupByProduct)),
            input,
        );
        if (enabledOnly) {
            innerQb.andWhere('"si"."enabled" = :enabled', { enabled: true });
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
        forceGroup: boolean = false,
    ): SelectQueryBuilder<SearchIndexItem> {
        const { term, facetValueIds, collectionId } = input;
        // join multiple words with the logical AND operator
        const termLogicalAnd = term ? term.trim().replace(/\s+/, ' & ') : '';

        qb.where('1 = 1');
        if (term && term.length > this.minTermLength) {
            const minIfGrouped = (colName: string) =>
                input.groupByProduct || forceGroup ? `MIN(${colName})` : colName;
            qb.addSelect(
                `
                    (ts_rank_cd(to_tsvector(${minIfGrouped('si.sku')}), to_tsquery(:term)) * 10 +
                    ts_rank_cd(to_tsvector(${minIfGrouped('si.productName')}), to_tsquery(:term)) * 2 +
                    ts_rank_cd(to_tsvector(${minIfGrouped(
                        'si.productVariantName',
                    )}), to_tsquery(:term)) * 1.5 +
                    ts_rank_cd(to_tsvector(${minIfGrouped('si.description')}), to_tsquery(:term)) * 1)
                            `,
                'score',
            )
                .andWhere(
                    new Brackets(qb1 => {
                        qb1.where('to_tsvector(si.sku) @@ to_tsquery(:term)')
                            .orWhere('to_tsvector(si.productName) @@ to_tsquery(:term)')
                            .orWhere('to_tsvector(si.productVariantName) @@ to_tsquery(:term)')
                            .orWhere('to_tsvector(si.description) @@ to_tsquery(:term)');
                    }),
                )
                .setParameters({ term: termLogicalAnd });
        }
        if (facetValueIds) {
            for (const id of facetValueIds) {
                const placeholder = '_' + id;
                qb.andWhere(`:${placeholder} = ANY (string_to_array(si.facetValueIds, ','))`, {
                    [placeholder]: id,
                });
            }
        }
        if (collectionId) {
            qb.andWhere(`:collectionId = ANY (string_to_array(si.collectionIds, ','))`, { collectionId });
        }
        qb.andWhere('si.languageCode = :languageCode', { languageCode: ctx.languageCode });
        qb.andWhere('si.channelId = :channelId', { channelId: ctx.channelId });
        if (input.groupByProduct === true) {
            qb.groupBy('si.productId');
        }
        return qb;
    }

    /**
     * When a select statement includes a GROUP BY clause,
     * then all selected columns must be aggregated. So we just apply the
     * "MIN" function in this case to all other columns than the productId.
     */
    private createPostgresSelect(groupByProduct: boolean): string {
        return [
            'sku',
            'enabled',
            'slug',
            'price',
            'priceWithTax',
            'productVariantId',
            'languageCode',
            'productId',
            'productName',
            'productVariantName',
            'description',
            'facetIds',
            'facetValueIds',
            'collectionIds',
            'channelIds',
            'productAssetId',
            'productPreview',
            'productPreviewFocalPoint',
            'productVariantAssetId',
            'productVariantPreview',
            'productVariantPreviewFocalPoint',
        ]
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
                        return `string_agg(${qualifiedName}, ',') as "${alias}"`;
                    } else if (col === 'enabled') {
                        return `bool_or(${qualifiedName}) as "${alias}"`;
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
