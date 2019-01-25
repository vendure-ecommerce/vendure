import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Brackets, Connection, Like, SelectQueryBuilder } from 'typeorm';
import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';

import { LanguageCode, SearchInput, SearchResponse } from '../../../../shared/generated-types';
import { Omit } from '../../../../shared/omit';
import { ID } from '../../../../shared/shared-types';
import { unique } from '../../../../shared/unique';
import { RequestContext } from '../../api/common/request-context';
import { Translated } from '../../common/types/locale-types';
import { FacetValue, Product, ProductVariant } from '../../entity';
import { EventBus } from '../../event-bus/event-bus';
import { CatalogModificationEvent } from '../../event-bus/events/catalog-modification-event';
import { translateDeep } from '../../service/helpers/utils/translate-entity';
import { FacetValueService } from '../../service/services/facet-value.service';

import { DefaultSearceReindexResonse } from './default-search-plugin';
import { SearchIndexItem } from './search-index-item.entity';

/**
 * MySQL / MariaDB Fulltext-based product search implementation.
 * TODO: Needs implementing for postgres, sql server etc.
 */
@Injectable()
export class FulltextSearchService {
    private readonly minTermLength = 2;
    private readonly variantRelations = [
        'product',
        'product.featuredAsset',
        'product.facetValues',
        'product.facetValues.facet',
        'featuredAsset',
        'facetValues',
        'facetValues.facet',
    ];

    constructor(
        @InjectConnection() private connection: Connection,
        private eventBus: EventBus,
        private facetValueService: FacetValueService,
    ) {
        eventBus.subscribe(CatalogModificationEvent, event => {
            if (event.entity instanceof Product || event.entity instanceof ProductVariant) {
                return this.update(event.ctx, event.entity);
            }
        });
    }

    /**
     * Perform a fulltext search according to the provided input arguments.
     */
    async search(ctx: RequestContext, input: SearchInput): Promise<Omit<SearchResponse, 'facetValues'>> {
        const take = input.take || 25;
        const skip = input.skip || 0;
        const qb = this.connection.getRepository(SearchIndexItem).createQueryBuilder('si');
        this.applyTermAndFilters(qb, input);
        if (input.term && input.term.length > this.minTermLength) {
            qb.orderBy('score', 'DESC');
        }

        const items = await qb
            .take(take)
            .skip(skip)
            .getRawMany()
            .then(res =>
                res.map(r => {
                    return {
                        sku: r.si_sku,
                        productVariantId: r.si_productVariantId,
                        languageCode: r.si_languageCode,
                        productId: r.si_productId,
                        productName: r.si_productName,
                        productVariantName: r.si_productVariantName,
                        description: r.si_description,
                        facetIds: r.si_facetIds.split(',').map(x => x.trim()),
                        facetValueIds: r.si_facetValueIds.split(',').map(x => x.trim()),
                        productPreview: r.si_productPreview,
                        productVariantPreview: r.si_productVariantPreview,
                        score: r.score || 0,
                    };
                }),
            );

        const innerQb = this.applyTermAndFilters(
            this.connection.getRepository(SearchIndexItem).createQueryBuilder('si'),
            input,
        );

        const totalItemsQb = this.connection
            .createQueryBuilder()
            .select('COUNT(*) as total')
            .from(`(${innerQb.getQuery()})`, 'inner')
            .setParameters(innerQb.getParameters());
        const totalResult = await totalItemsQb.getRawOne();

        return {
            items,
            totalItems: totalResult.total,
        };
    }

    async facetValues(ctx: RequestContext, input: SearchInput): Promise<Array<Translated<FacetValue>>> {
        const facetValuesQb = this.connection
            .getRepository(SearchIndexItem)
            .createQueryBuilder('si')
            .select('GROUP_CONCAT(facetValueIds)', 'allFacetValues');

        const facetValuesResult = await this.applyTermAndFilters(facetValuesQb, input).getRawOne();
        const allFacetValues = facetValuesResult ? facetValuesResult.allFacetValues || '' : '';
        const facetValueIds = unique(allFacetValues.split(',').filter(x => x !== '') as string[]);
        return this.facetValueService.findByIds(facetValueIds, ctx.languageCode);
    }

    /**
     * Rebuilds the full search index.
     */
    async reindex(languageCode: LanguageCode): Promise<DefaultSearceReindexResonse> {
        const timeStart = Date.now();
        const qb = await this.connection.getRepository(ProductVariant).createQueryBuilder('variants');
        FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, {
            relations: this.variantRelations,
        });
        const variants = await qb.where('variants_product.deletedAt IS NULL').getMany();
        await this.connection.getRepository(SearchIndexItem).delete({ languageCode });
        await this.saveSearchIndexItems(languageCode, variants);
        return {
            success: true,
            indexedItemCount: variants.length,
            timeTaken: Date.now() - timeStart,
        };
    }

    /**
     * Updates the search index only for the affected entities.
     */
    async update(ctx: RequestContext, updatedEntity: Product | ProductVariant) {
        let updatedVariants: ProductVariant[] = [];
        let removedVariantIds: ID[] = [];
        if (updatedEntity instanceof Product) {
            const product = await this.connection.getRepository(Product).findOne(updatedEntity.id, {
                relations: ['variants'],
            });
            if (product) {
                if (product.deletedAt) {
                    removedVariantIds = product.variants.map(v => v.id);
                } else {
                    updatedVariants = await this.connection
                        .getRepository(ProductVariant)
                        .findByIds(product.variants.map(v => v.id), {
                            relations: this.variantRelations,
                        });
                }
            }
        } else {
            const variant = await this.connection.getRepository(ProductVariant).findOne(updatedEntity.id, {
                relations: this.variantRelations,
            });
            if (variant) {
                updatedVariants = [variant];
            }
        }
        if (updatedVariants.length) {
            await this.saveSearchIndexItems(ctx.languageCode, updatedVariants);
        }
        if (removedVariantIds.length) {
            await this.removeSearchIndexItems(ctx.languageCode, removedVariantIds);
        }
    }

    /**
     * Checks to see if the index is empty, and if so triggers a re-index operation.
     */
    async checkIndex(languageCode: LanguageCode) {
        const indexSize = await this.connection.getRepository(SearchIndexItem).count({
            where: {
                languageCode,
            },
        });
        if (indexSize === 0) {
            await this.reindex(languageCode);
        }
    }

    private applyTermAndFilters(
        qb: SelectQueryBuilder<SearchIndexItem>,
        input: SearchInput,
    ): SelectQueryBuilder<SearchIndexItem> {
        const { term, facetIds } = input;
        qb.where('true');
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
        if (facetIds) {
            for (const id of facetIds) {
                const placeholder = '_' + id;
                qb.andWhere(`FIND_IN_SET(:${placeholder}, facetValueIds)`, { [placeholder]: id });
            }
        }
        if (input.groupByProduct === true) {
            qb.groupBy('productId');
        }
        return qb;
    }

    /**
     * Add or update items in the search index
     */
    private async saveSearchIndexItems(languageCode: LanguageCode, variants: ProductVariant[]) {
        const items = variants
            .map(v => translateDeep(v, languageCode, ['product']))
            .map(
                v =>
                    new SearchIndexItem({
                        sku: v.sku,
                        languageCode,
                        productVariantId: v.id,
                        productId: v.product.id,
                        productName: v.product.name,
                        description: v.product.description,
                        productVariantName: v.name,
                        productPreview: v.product.featuredAsset ? v.product.featuredAsset.preview : '',
                        productVariantPreview: v.featuredAsset ? v.featuredAsset.preview : '',
                        facetIds: this.getFacetIds(v),
                        facetValueIds: this.getFacetValueIds(v),
                    }),
            );
        await this.connection.getRepository(SearchIndexItem).save(items);
    }

    /**
     * Remove items from the search index
     */
    private async removeSearchIndexItems(languageCode: LanguageCode, variantIds: ID[]) {
        const compositeKeys = variantIds.map(id => ({
            productVariantId: id,
            languageCode,
        })) as any[];
        await this.connection.getRepository(SearchIndexItem).delete(compositeKeys);
    }

    private getFacetIds(variant: ProductVariant): string[] {
        const facetIds = (fv: FacetValue) => fv.facet.id.toString();
        const variantFacetIds = variant.facetValues.map(facetIds);
        const productFacetIds = variant.product.facetValues.map(facetIds);
        return unique([...variantFacetIds, ...productFacetIds]);
    }

    private getFacetValueIds(variant: ProductVariant): string[] {
        const facetValueIds = (fv: FacetValue) => fv.id.toString();
        const variantFacetValueIds = variant.facetValues.map(facetValueIds);
        const productFacetValueIds = variant.product.facetValues.map(facetValueIds);
        return unique([...variantFacetValueIds, ...productFacetValueIds]);
    }
}
