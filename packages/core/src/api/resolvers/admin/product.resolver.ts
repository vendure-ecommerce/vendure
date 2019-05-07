import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    MutationAddOptionGroupToProductArgs,
    MutationCreateProductArgs,
    MutationDeleteProductArgs,
    DeletionResponse,
    MutationGenerateVariantsForProductArgs,
    Permission,
    QueryProductArgs,
    QueryProductsArgs,
    MutationRemoveOptionGroupFromProductArgs,
    MutationUpdateProductArgs,
    MutationUpdateProductVariantsArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { Translated } from '../../../common/types/locale-types';
import { assertFound } from '../../../common/utils';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { Product } from '../../../entity/product/product.entity';
import { FacetValueService } from '../../../service/services/facet-value.service';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { ProductService } from '../../../service/services/product.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Decode } from '../../decorators/decode.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver()
export class ProductResolver {
    constructor(
        private productService: ProductService,
        private productVariantService: ProductVariantService,
        private facetValueService: FacetValueService,
    ) {}

    @Query()
    @Allow(Permission.ReadCatalog)
    async products(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryProductsArgs,
    ): Promise<PaginatedList<Translated<Product>>> {
        return this.productService.findAll(ctx, args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadCatalog)
    async product(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryProductArgs,
    ): Promise<Translated<Product> | undefined> {
        return this.productService.findOne(ctx, args.id);
    }

    @Mutation()
    @Allow(Permission.CreateCatalog)
    @Decode('assetIds', 'featuredAssetId', 'facetValueIds')
    async createProduct(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateProductArgs,
    ): Promise<Translated<Product>> {
        const { input } = args;
        return this.productService.create(ctx, input);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    @Decode('assetIds', 'featuredAssetId', 'facetValueIds')
    async updateProduct(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateProductArgs,
    ): Promise<Translated<Product>> {
        const { input } = args;
        return this.productService.update(ctx, input);
    }

    @Mutation()
    @Allow(Permission.DeleteCatalog)
    async deleteProduct(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationDeleteProductArgs,
    ): Promise<DeletionResponse> {
        return this.productService.softDelete(ctx, args.id);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    @Decode('productId', 'optionGroupId')
    async addOptionGroupToProduct(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationAddOptionGroupToProductArgs,
    ): Promise<Translated<Product>> {
        const { productId, optionGroupId } = args;
        return this.productService.addOptionGroupToProduct(ctx, productId, optionGroupId);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    @Decode('productId', 'optionGroupId')
    async removeOptionGroupFromProduct(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationRemoveOptionGroupFromProductArgs,
    ): Promise<Translated<Product>> {
        const { productId, optionGroupId } = args;
        return this.productService.removeOptionGroupFromProduct(ctx, productId, optionGroupId);
    }

    @Mutation()
    @Allow(Permission.CreateCatalog)
    @Decode('productId', 'defaultTaxCategoryId')
    async generateVariantsForProduct(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationGenerateVariantsForProductArgs,
    ): Promise<Translated<Product>> {
        const { productId, defaultTaxCategoryId, defaultPrice, defaultSku } = args;
        await this.productVariantService.generateVariantsForProduct(
            ctx,
            productId,
            defaultTaxCategoryId,
            defaultPrice,
            defaultSku,
        );
        return assertFound(this.productService.findOne(ctx, productId));
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    @Decode('taxCategoryId', 'facetValueIds', 'featuredAssetId', 'assetIds')
    async updateProductVariants(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateProductVariantsArgs,
    ): Promise<Array<Translated<ProductVariant>>> {
        const { input } = args;
        return Promise.all(input.map(variant => this.productVariantService.update(ctx, variant)));
    }
}
