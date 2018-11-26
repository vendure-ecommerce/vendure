import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    CreateProductCategoryMutationArgs,
    Permission,
    ProductCategoriesQueryArgs,
    ProductCategoryQueryArgs,
    UpdateProductCategoryMutationArgs,
} from 'shared/generated-types';
import { PaginatedList } from 'shared/shared-types';

import { Translated } from '../../common/types/locale-types';
import { ProductCategory } from '../../entity/product-category/product-category.entity';
import { ProductCategoryService } from '../../service/services/product-category.service';
import { RequestContext } from '../common/request-context';
import { Allow } from '../decorators/allow.decorator';
import { Decode } from '../decorators/decode.decorator';
import { Ctx } from '../decorators/request-context.decorator';

@Resolver('ProductCategory')
export class ProductCategoryResolver {
    constructor(private productCategoryService: ProductCategoryService) {}

    @Query()
    @Allow(Permission.ReadCatalog, Permission.Public)
    async productCategories(
        @Ctx() ctx: RequestContext,
        @Args() args: ProductCategoriesQueryArgs,
    ): Promise<PaginatedList<Translated<ProductCategory>>> {
        return this.productCategoryService.findAll(ctx, args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadCatalog, Permission.Public)
    async productCategory(
        @Ctx() ctx: RequestContext,
        @Args() args: ProductCategoryQueryArgs,
    ): Promise<Translated<ProductCategory> | undefined> {
        return this.productCategoryService.findOne(ctx, args.id);
    }

    @Mutation()
    @Allow(Permission.CreateCatalog)
    @Decode('assetIds', 'featuredAssetId', 'parentId')
    async createProductCategory(
        @Ctx() ctx: RequestContext,
        @Args() args: CreateProductCategoryMutationArgs,
    ): Promise<Translated<ProductCategory>> {
        const { input } = args;
        return this.productCategoryService.create(ctx, input);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    @Decode('assetIds', 'featuredAssetId')
    async updateProductCategory(
        @Ctx() ctx: RequestContext,
        @Args() args: UpdateProductCategoryMutationArgs,
    ): Promise<Translated<ProductCategory>> {
        const { input } = args;
        return this.productCategoryService.update(ctx, input);
    }
}
