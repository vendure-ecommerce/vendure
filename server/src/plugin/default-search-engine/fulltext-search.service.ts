import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { unique } from '../../../../shared/unique';
import { RequestContext } from '../../api/common/request-context';
import { FacetValue, ProductVariant } from '../../entity';
import { EventBus } from '../../event-bus/event-bus';
import { CatalogModificationEvent } from '../../event-bus/events/catalog-modification-event';
import { translateDeep } from '../../service/helpers/utils/translate-entity';

import { SearchIndexItem } from './search-index-item.entity';

@Injectable()
export class FulltextSearchService {
    constructor(@InjectConnection() private connection: Connection, private eventBus: EventBus) {
        eventBus.subscribe(CatalogModificationEvent, event => this.reindex(event.ctx));
    }

    async search(ctx: RequestContext, term: string) {
        return this.connection
            .getRepository(SearchIndexItem)
            .createQueryBuilder('si')
            .addSelect(`MATCH (productName) AGAINST ('${term}')`, 'score')
            .orderBy('score', 'DESC')
            .getMany()
            .then(res => {
                return res;
            });
    }

    async reindex(ctx: RequestContext): Promise<boolean> {
        const { languageCode } = ctx;
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
        return true;
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
