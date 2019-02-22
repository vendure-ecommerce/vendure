import { Args, Mutation, Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';

import {
    CreateProductCategoryMutationArgs,
    MoveProductCategoryMutationArgs,
    Permission,
    ProductCategoriesQueryArgs,
    ProductCategoryQueryArgs,
    UpdateProductCategoryMutationArgs,
} from '../../../../../shared/generated-types';
import { PaginatedList } from '../../../../../shared/shared-types';
import { Translated } from '../../../common/types/locale-types';
import { FacetValue } from '../../../entity/facet-value/facet-value.entity';
import { ProductCategory } from '../../../entity/product-category/product-category.entity';
import { FacetValueService } from '../../../service/services/facet-value.service';
import { ProductCategoryService } from '../../../service/services/product-category.service';
import { IdCodecService } from '../../common/id-codec.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Decode } from '../../decorators/decode.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver()
export class ProductCategoryResolver {
    constructor(
        private productCategoryService: ProductCategoryService,
        private facetValueService: FacetValueService,
        private idCodecService: IdCodecService,
    ) {}

    @Query()
    @Allow(Permission.ReadCatalog)
    async productCategories(
        @Ctx() ctx: RequestContext,
        @Args() args: ProductCategoriesQueryArgs,
    ): Promise<PaginatedList<Translated<ProductCategory>>> {
        return this.productCategoryService.findAll(ctx, args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadCatalog)
    async productCategory(
        @Ctx() ctx: RequestContext,
        @Args() args: ProductCategoryQueryArgs,
    ): Promise<Translated<ProductCategory> | undefined> {
        return this.productCategoryService.findOne(ctx, args.id);
    }

    @Mutation()
    @Allow(Permission.CreateCatalog)
    @Decode('assetIds', 'featuredAssetId', 'parentId', 'facetValueIds')
    async createProductCategory(
        @Ctx() ctx: RequestContext,
        @Args() args: CreateProductCategoryMutationArgs,
    ): Promise<Translated<ProductCategory>> {
        const { input } = args;
        return this.productCategoryService.create(ctx, input);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    @Decode('assetIds', 'featuredAssetId', 'facetValueIds')
    async updateProductCategory(
        @Ctx() ctx: RequestContext,
        @Args() args: UpdateProductCategoryMutationArgs,
    ): Promise<Translated<ProductCategory>> {
        const { input } = args;
        return this.productCategoryService.update(ctx, input);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    @Decode('categoryId', 'parentId')
    async moveProductCategory(
        @Ctx() ctx: RequestContext,
        @Args() args: MoveProductCategoryMutationArgs,
    ): Promise<Translated<ProductCategory>> {
        const { input } = args;
        return this.productCategoryService.move(ctx, input);
    }
}
