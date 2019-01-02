import { Connection } from 'typeorm';

import { LanguageCode } from '../../../../shared/generated-types';
import { Type } from '../../../../shared/shared-types';
import { unique } from '../../../../shared/unique';
import { VendureConfig, VendurePlugin } from '../../config';
import { FacetValue, Product, ProductVariant } from '../../entity';
import { EventBus } from '../../event-bus/event-bus';
import { CatalogModificationEvent } from '../../event-bus/events/catalog-modification-event';
import { translateDeep } from '../../service/helpers/utils/translate-entity';

import { FulltextSearchResolver } from './fulltext-search-resolver';
import { SearchIndexItem } from './search-index-item.entity';

export class DefaultSearchPlugin implements VendurePlugin {
    private connection: Connection;

    async init(config: Required<VendureConfig>): Promise<Required<VendureConfig>> {
        return config;
    }

    onBootstrap(inject: <T>(type: Type<T>) => T): void | Promise<void> {
        this.connection = inject(Connection);
        const eventBus = inject(EventBus);

        eventBus.subscribe(CatalogModificationEvent, event => this.buildSearchIndex(event.ctx.languageCode));
    }

    defineEntities(): Array<Type<any>> {
        return [SearchIndexItem];
    }

    defineResolvers(): Array<Type<any>> {
        return [FulltextSearchResolver];
    }

    /**
     * Clears the search index for the given language and rebuilds from scratch.
     */
    private async buildSearchIndex(languageCode: LanguageCode) {
        const variants = await this.connection.getRepository(ProductVariant).find({
            relations: [
                'product',
                'product.featuredAsset',
                'product.facetValues',
                'product.facetValues.facet',
                'featuredAsset',
                'facetValues',
                'facetValues.facet',
            ],
        });

        await this.connection.getRepository(SearchIndexItem).delete({ languageCode });
        const items = variants
            .map(v => translateDeep(v, languageCode, ['product']))
            .map(
                v =>
                    new SearchIndexItem({
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

    private async updateSearchIndex(languageCode: LanguageCode, entity: Product | ProductVariant) {
        //
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
