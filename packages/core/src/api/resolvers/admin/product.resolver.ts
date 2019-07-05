import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    DeletionResponse,
    MutationAddOptionGroupToProductArgs,
    MutationCreateProductArgs,
    MutationCreateProductVariantsArgs,
    MutationDeleteProductArgs,
    MutationRemoveOptionGroupFromProductArgs,
    MutationUpdateProductArgs,
    MutationUpdateProductVariantsArgs,
    Permission,
    QueryProductArgs,
    QueryProductsArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { UserInputError } from '../../../common/error/errors';
import { Translated } from '../../../common/types/locale-types';
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
        if (args.id) {
            return this.productService.findOne(ctx, args.id);
        } else if (args.slug) {
            return this.productService.findOneBySlug(ctx, args.slug);
        } else {
            throw new UserInputError(`error.product-id-or-slug-must-be-provided`);
        }
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
    @Allow(Permission.UpdateCatalog)
    @Decode('taxCategoryId', 'facetValueIds', 'featuredAssetId', 'assetIds', 'optionIds')
    async createProductVariants(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateProductVariantsArgs,
    ): Promise<Array<Translated<ProductVariant>>> {
        const { input } = args;
        return Promise.all(input.map(i => this.productVariantService.create(ctx, i)));
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    @Decode('taxCategoryId', 'facetValueIds', 'featuredAssetId', 'assetIds')
    async updateProductVariants(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateProductVariantsArgs,
    ): Promise<Array<Translated<ProductVariant>>> {
        const { input } = args;
        return Promise.all(input.map(i => this.productVariantService.update(ctx, i)));
    }
}
