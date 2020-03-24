import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ID } from '@vendure/common/lib/shared-types';

import { Translated } from '../../../common/types/locale-types';
import { Asset } from '../../../entity/asset/asset.entity';
import { Channel } from '../../../entity/channel/channel.entity';
import { Collection } from '../../../entity/collection/collection.entity';
import { ProductOptionGroup } from '../../../entity/product-option-group/product-option-group.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { Product } from '../../../entity/product/product.entity';
import { AssetService } from '../../../service/services/asset.service';
import { CollectionService } from '../../../service/services/collection.service';
import { ProductOptionGroupService } from '../../../service/services/product-option-group.service';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { ProductService } from '../../../service/services/product.service';
import { ApiType } from '../../common/get-api-type';
import { RequestContext } from '../../common/request-context';
import { Api } from '../../decorators/api.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Product')
export class ProductEntityResolver {
    constructor(
        private productVariantService: ProductVariantService,
        private collectionService: CollectionService,
        private productOptionGroupService: ProductOptionGroupService,
        private assetService: AssetService,
    ) {}

    @ResolveField()
    async variants(
        @Ctx() ctx: RequestContext,
        @Parent() product: Product,
        @Api() apiType: ApiType,
    ): Promise<Array<Translated<ProductVariant>>> {
        const variants = await this.productVariantService.getVariantsByProductId(ctx, product.id);
        return variants.filter(v => (apiType === 'admin' ? true : v.enabled));
    }

    @ResolveField()
    async collections(
        @Ctx() ctx: RequestContext,
        @Parent() product: Product,
        @Api() apiType: ApiType,
    ): Promise<Array<Translated<Collection>>> {
        return this.collectionService.getCollectionsByProductId(ctx, product.id, apiType === 'shop');
    }

    @ResolveField()
    async optionGroups(
        @Ctx() ctx: RequestContext,
        @Parent() product: Product,
    ): Promise<Array<Translated<ProductOptionGroup>>> {
        return this.productOptionGroupService.getOptionGroupsByProductId(ctx, product.id);
    }

    @ResolveField()
    async featuredAsset(@Ctx() ctx: RequestContext, @Parent() product: Product): Promise<Asset | undefined> {
        if (product.featuredAsset) {
            return product.featuredAsset;
        }
        return this.assetService.getFeaturedAsset(product);
    }

    @ResolveField()
    async assets(@Ctx() ctx: RequestContext, @Parent() product: Product): Promise<Asset[] | undefined> {
        return this.assetService.getEntityAssets(product);
    }
}

@Resolver('Product')
export class ProductAdminEntityResolver {
    constructor(private productService: ProductService) {}

    @ResolveField()
    async channels(@Ctx() ctx: RequestContext, @Parent() product: Product): Promise<Channel[]> {
        if (product.channels) {
            return product.channels;
        } else {
            return this.productService.getProductChannels(ctx, product.id);
        }
    }
}
