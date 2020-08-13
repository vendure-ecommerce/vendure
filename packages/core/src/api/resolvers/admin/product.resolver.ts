import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    DeletionResponse,
    MutationAddOptionGroupToProductArgs,
    MutationAssignProductsToChannelArgs,
    MutationCreateProductArgs,
    MutationCreateProductVariantsArgs,
    MutationDeleteProductArgs,
    MutationDeleteProductVariantArgs,
    MutationRemoveOptionGroupFromProductArgs,
    MutationRemoveProductsFromChannelArgs,
    MutationUpdateProductArgs,
    MutationUpdateProductVariantsArgs,
    Permission,
    QueryProductArgs,
    QueryProductsArgs,
    QueryProductVariantArgs,
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
            const product = await this.productService.findOne(ctx, args.id);
            if (args.slug && product && product.slug !== args.slug) {
                throw new UserInputError(`error.product-id-slug-mismatch`);
            }
            return product;
        } else if (args.slug) {
            return this.productService.findOneBySlug(ctx, args.slug);
        } else {
            throw new UserInputError(`error.product-id-or-slug-must-be-provided`);
        }
    }

    @Query()
    @Allow(Permission.ReadCatalog)
    async productVariant(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryProductVariantArgs,
    ): Promise<Translated<ProductVariant> | undefined> {
        return this.productVariantService.findOne(ctx, args.id);
    }

    @Mutation()
    @Allow(Permission.CreateCatalog)
    async createProduct(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateProductArgs,
    ): Promise<Translated<Product>> {
        const { input } = args;
        return this.productService.create(ctx, input);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
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
    async addOptionGroupToProduct(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationAddOptionGroupToProductArgs,
    ): Promise<Translated<Product>> {
        const { productId, optionGroupId } = args;
        return this.productService.addOptionGroupToProduct(ctx, productId, optionGroupId);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async removeOptionGroupFromProduct(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationRemoveOptionGroupFromProductArgs,
    ): Promise<Translated<Product>> {
        const { productId, optionGroupId } = args;
        return this.productService.removeOptionGroupFromProduct(ctx, productId, optionGroupId);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async createProductVariants(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateProductVariantsArgs,
    ): Promise<Array<Translated<ProductVariant>>> {
        const { input } = args;
        return this.productVariantService.create(ctx, input);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async updateProductVariants(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateProductVariantsArgs,
    ): Promise<Array<Translated<ProductVariant>>> {
        const { input } = args;
        return this.productVariantService.update(ctx, input);
    }

    @Mutation()
    @Allow(Permission.DeleteCatalog)
    async deleteProductVariant(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationDeleteProductVariantArgs,
    ): Promise<DeletionResponse> {
        return this.productVariantService.softDelete(ctx, args.id);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async assignProductsToChannel(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationAssignProductsToChannelArgs,
    ): Promise<Array<Translated<Product>>> {
        return this.productService.assignProductsToChannel(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async removeProductsFromChannel(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationRemoveProductsFromChannelArgs,
    ): Promise<Array<Translated<Product>>> {
        return this.productService.removeProductsFromChannel(ctx, args.input);
    }
}
