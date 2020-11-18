import { Info, Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Translated } from '../../../common/types/locale-types';
import { Asset } from '../../../entity/asset/asset.entity';
import { Channel } from '../../../entity/channel/channel.entity';
import { Collection } from '../../../entity/collection/collection.entity';
import { FacetValue } from '../../../entity/facet-value/facet-value.entity';
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
        private productService: ProductService,
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
        @Info() info: any,
        @Ctx() ctx: RequestContext,
        @Parent() product: Product,
    ): Promise<Array<Translated<ProductOptionGroup>>> {
        const a = info;
        return this.productOptionGroupService.getOptionGroupsByProductId(ctx, product.id);
    }

    @ResolveField()
    async facetValues(
        @Ctx() ctx: RequestContext,
        @Parent() product: Product,
    ): Promise<Array<Translated<FacetValue>>> {
        if (product.facetValues) {
            return product.facetValues as Array<Translated<FacetValue>>;
        }
        return this.productService.getFacetValuesForProduct(ctx, product.id);
    }

    @ResolveField()
    async featuredAsset(@Ctx() ctx: RequestContext, @Parent() product: Product): Promise<Asset | undefined> {
        if (product.featuredAsset) {
            return product.featuredAsset;
        }
        return this.assetService.getFeaturedAsset(ctx, product);
    }

    @ResolveField()
    async assets(@Ctx() ctx: RequestContext, @Parent() product: Product): Promise<Asset[] | undefined> {
        return this.assetService.getEntityAssets(ctx, product);
    }
}

@Resolver('Product')
export class ProductAdminEntityResolver {
    constructor(private productService: ProductService) {}

    @ResolveField()
    async channels(@Ctx() ctx: RequestContext, @Parent() product: Product): Promise<Channel[]> {
        return this.productService.getProductChannels(ctx, product.id);
    }
}
