import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';

import { Translated } from '../../../common/types/locale-types';
import { Collection } from '../../../entity/collection/collection.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { Product } from '../../../entity/product/product.entity';
import { CollectionService } from '../../../service/services/collection.service';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { RequestContext } from '../../common/request-context';
import { Api, ApiType } from '../../decorators/api.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Product')
export class ProductEntityResolver {
    constructor(
        private productVariantService: ProductVariantService,
        private collectionService: CollectionService,
    ) {}

    @ResolveProperty()
    async variants(
        @Ctx() ctx: RequestContext,
        @Parent() product: Product,
        @Api() apiType: ApiType,
    ): Promise<Array<Translated<ProductVariant>>> {
        // In the shop URL, the parent (Product type) does not have the "enabled"
        // field, in which case we should filter out any non-enabled variants too.
        const variants = await this.productVariantService.getVariantsByProductId(ctx, product.id);
        return variants.filter(v => apiType === 'admin' ? true : v.enabled);
    }

    @ResolveProperty()
    async collections(
        @Ctx() ctx: RequestContext,
        @Parent() product: Product,
        @Api() apiType: ApiType,
    ): Promise<Array<Translated<Collection>>> {
        return this.collectionService.getCollectionsByProductId(ctx, product.id, apiType === 'shop');
    }
}
