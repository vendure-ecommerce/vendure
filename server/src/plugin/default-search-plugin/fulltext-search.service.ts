import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';

import { LanguageCode, SearchInput, SearchResponse } from '../../../../shared/generated-types';
import { Omit } from '../../../../shared/omit';
import { ID } from '../../../../shared/shared-types';
import { unique } from '../../../../shared/unique';
import { RequestContext } from '../../api/common/request-context';
import { InternalServerError } from '../../common/error/errors';
import { FacetValue, Product, ProductVariant } from '../../entity';
import { EventBus } from '../../event-bus/event-bus';
import { translateDeep } from '../../service/helpers/utils/translate-entity';
import { FacetValueService } from '../../service/services/facet-value.service';
import { ProductVariantService } from '../../service/services/product-variant.service';
import { SearchService } from '../../service/services/search.service';

import { DefaultSearchReindexResponse } from './default-search-plugin';
import { SearchIndexItem } from './search-index-item.entity';
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
    private readonly variantRelations = [
        'product',
        'product.featuredAsset',
        'product.facetValues',
        'product.facetValues.facet',
        'featuredAsset',
        'facetValues',
        'facetValues.facet',
        'collections',
        'taxCategory',
    ];

    constructor(
        @InjectConnection() private connection: Connection,
        private eventBus: EventBus,
        private facetValueService: FacetValueService,
        private productVariantService: ProductVariantService,
    ) {
        this.setSearchStrategy();
    }

    /**
     * Perform a fulltext search according to the provided input arguments.
     */
    async search(ctx: RequestContext, input: SearchInput): Promise<Omit<SearchResponse, 'facetValues'>> {
        const items = await this.searchStrategy.getSearchResults(ctx, input);
        const totalItems = await this.searchStrategy.getTotalCount(ctx, input);
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
    ): Promise<Array<{ facetValue: FacetValue; count: number }>> {
        const facetValueIdsMap = await this.searchStrategy.getFacetValueIds(ctx, input);
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
    async reindex(ctx: RequestContext): Promise<DefaultSearchReindexResponse> {
        const timeStart = Date.now();
        const qb = await this.connection.getRepository(ProductVariant).createQueryBuilder('variants');
        FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, {
            relations: this.variantRelations,
        });
        FindOptionsUtils.joinEagerRelations(qb, qb.alias, this.connection.getMetadata(ProductVariant));
        const variants = await qb.where('variants__product.deletedAt IS NULL').getMany();
        await this.connection.getRepository(SearchIndexItem).delete({ languageCode: ctx.languageCode });
        await this.saveSearchIndexItems(ctx, variants);
        return {
            success: true,
            indexedItemCount: variants.length,
            timeTaken: Date.now() - timeStart,
        };
    }

    /**
     * Updates the search index only for the affected entities.
     */
    async updateProductOrVariant(ctx: RequestContext, updatedEntity: Product | ProductVariant) {
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
            await this.saveSearchIndexItems(ctx, updatedVariants);
        }
        if (removedVariantIds.length) {
            await this.removeSearchIndexItems(ctx.languageCode, removedVariantIds);
        }
    }

    async updateVariantsById(ctx: RequestContext, ids: ID[]) {
        if (ids.length) {
            const updatedVariants = await this.connection.getRepository(ProductVariant).findByIds(ids, {
                relations: this.variantRelations,
            });
            await this.saveSearchIndexItems(ctx, updatedVariants);
        }
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

    /**
     * Add or update items in the search index
     */
    private async saveSearchIndexItems(ctx: RequestContext, variants: ProductVariant[]) {
        const items = variants
            .map(v => this.productVariantService.applyChannelPriceAndTax(v, ctx))
            .map(v => translateDeep(v, ctx.languageCode, ['product']))
            .map(
                v =>
                    new SearchIndexItem({
                        sku: v.sku,
                        slug: v.product.slug,
                        price: v.price,
                        priceWithTax: v.priceWithTax,
                        languageCode: ctx.languageCode,
                        productVariantId: v.id,
                        productId: v.product.id,
                        productName: v.product.name,
                        description: v.product.description,
                        productVariantName: v.name,
                        productPreview: v.product.featuredAsset ? v.product.featuredAsset.preview : '',
                        productVariantPreview: v.featuredAsset ? v.featuredAsset.preview : '',
                        facetIds: this.getFacetIds(v),
                        facetValueIds: this.getFacetValueIds(v),
                        collectionIds: v.collections.map(c => c.id.toString()),
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
