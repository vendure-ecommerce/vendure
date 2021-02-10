import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { StockMovementListOptions } from '@vendure/common/lib/generated-types';
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { Translated } from '../../../common/types/locale-types';
import { idsAreEqual } from '../../../common/utils';
import { Asset, Channel, FacetValue, Product, ProductOption } from '../../../entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { StockMovement } from '../../../entity/stock-movement/stock-movement.entity';
import { AssetService } from '../../../service/services/asset.service';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { StockMovementService } from '../../../service/services/stock-movement.service';
import { ApiType } from '../../common/get-api-type';
import { RequestContext } from '../../common/request-context';
import { Api } from '../../decorators/api.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('ProductVariant')
export class ProductVariantEntityResolver {
    constructor(private productVariantService: ProductVariantService, private assetService: AssetService) {}

    @ResolveField()
    async product(
        @Ctx() ctx: RequestContext,
        @Parent() productVariant: ProductVariant,
    ): Promise<Product | undefined> {
        if (productVariant.product) {
            return productVariant.product;
        }
        return this.productVariantService.getProductForVariant(ctx, productVariant);
    }

    @ResolveField()
    async assets(
        @Ctx() ctx: RequestContext,
        @Parent() productVariant: ProductVariant,
    ): Promise<Asset[] | undefined> {
        return this.assetService.getEntityAssets(ctx, productVariant);
    }

    @ResolveField()
    async featuredAsset(
        @Ctx() ctx: RequestContext,
        @Parent() productVariant: ProductVariant,
    ): Promise<Asset | undefined> {
        if (productVariant.featuredAsset) {
            return productVariant.featuredAsset;
        }
        return this.assetService.getFeaturedAsset(ctx, productVariant);
    }

    @ResolveField()
    async options(
        @Ctx() ctx: RequestContext,
        @Parent() productVariant: ProductVariant,
    ): Promise<Array<Translated<ProductOption>>> {
        if (productVariant.options) {
            return productVariant.options as Array<Translated<ProductOption>>;
        }
        return this.productVariantService.getOptionsForVariant(ctx, productVariant.id);
    }

    @ResolveField()
    async facetValues(
        @Ctx() ctx: RequestContext,
        @Parent() productVariant: ProductVariant,
        @Api() apiType: ApiType,
    ): Promise<Array<Translated<FacetValue>>> {
        if (productVariant.facetValues?.length === 0) {
            return [];
        }
        let facetValues: Array<Translated<FacetValue>>;
        if (productVariant.facetValues?.[0]?.channels) {
            facetValues = productVariant.facetValues as Array<Translated<FacetValue>>;
        } else {
            facetValues = await this.productVariantService.getFacetValuesForVariant(ctx, productVariant.id);
        }

        return facetValues.filter(fv => {
            if (!fv.channels.find(c => idsAreEqual(c.id, ctx.channelId))) {
                return false;
            }
            if (apiType === 'shop' && fv.facet.isPrivate) {
                return false;
            }
            return true;
        });
    }
}

@Resolver('ProductVariant')
export class ProductVariantAdminEntityResolver {
    constructor(
        private productVariantService: ProductVariantService,
        private stockMovementService: StockMovementService,
    ) {}

    @ResolveField()
    async stockMovements(
        @Ctx() ctx: RequestContext,
        @Parent() productVariant: ProductVariant,
        @Args() args: { options: StockMovementListOptions },
    ): Promise<PaginatedList<StockMovement>> {
        return this.stockMovementService.getStockMovementsByProductVariantId(
            ctx,
            productVariant.id,
            args.options,
        );
    }

    @ResolveField()
    async channels(@Ctx() ctx: RequestContext, @Parent() productVariant: ProductVariant): Promise<Channel[]> {
        const isDefaultChannel = ctx.channel.code === DEFAULT_CHANNEL_CODE;
        const channels = await this.productVariantService.getProductVariantChannels(ctx, productVariant.id);
        return channels.filter(channel => (isDefaultChannel ? true : idsAreEqual(channel.id, ctx.channelId)));
    }
}
