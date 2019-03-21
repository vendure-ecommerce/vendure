import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';

import { Translated } from '../../../common/types/locale-types';
import { Collection } from '../../../entity/collection/collection.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { Product } from '../../../entity/product/product.entity';
import { CollectionService } from '../../../service/services/collection.service';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { RequestContext } from '../../common/request-context';
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
    ): Promise<Array<Translated<ProductVariant>>> {
        return this.productVariantService.getVariantsByProductId(ctx, product.id);
    }

    @ResolveProperty()
    async collections(
        @Ctx() ctx: RequestContext,
        @Parent() product: Product,
    ): Promise<Array<Translated<Collection>>> {
        return this.collectionService.getCollectionsByProductId(ctx, product.id);
    }
}
