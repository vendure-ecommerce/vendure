import { Args, Query, Resolver } from '@nestjs/graphql';

import {
    ProductCategoriesQueryArgs,
    ProductCategoryQueryArgs,
    ProductQueryArgs,
    ProductsQueryArgs,
    SearchResponse,
} from '../../../../../shared/generated-types';
import { Omit } from '../../../../../shared/omit';
import { PaginatedList } from '../../../../../shared/shared-types';
import { InternalServerError } from '../../../common/error/errors';
import { Translated } from '../../../common/types/locale-types';
import { ProductCategory } from '../../../entity';
import { Product } from '../../../entity/product/product.entity';
import { ProductCategoryService } from '../../../service';
import { FacetValueService } from '../../../service/services/facet-value.service';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { ProductService } from '../../../service/services/product.service';
import { IdCodecService } from '../../common/id-codec.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver()
export class ShopProductsResolver {
    constructor(
        private productService: ProductService,
        private productVariantService: ProductVariantService,
        private facetValueService: FacetValueService,
        private idCodecService: IdCodecService,
        private productCategoryService: ProductCategoryService,
    ) {}

    @Query()
    async products(
        @Ctx() ctx: RequestContext,
        @Args() args: ProductsQueryArgs,
    ): Promise<PaginatedList<Translated<Product>>> {
        return this.productService.findAll(ctx, args.options || undefined);
    }

    @Query()
    async product(
        @Ctx() ctx: RequestContext,
        @Args() args: ProductQueryArgs,
    ): Promise<Translated<Product> | undefined> {
        return this.productService.findOne(ctx, args.id);
    }

    @Query()
    async productCategories(
        @Ctx() ctx: RequestContext,
        @Args() args: ProductCategoriesQueryArgs,
    ): Promise<PaginatedList<Translated<ProductCategory>>> {
        return this.productCategoryService.findAll(ctx, args.options || undefined);
    }

    @Query()
    async productCategory(
        @Ctx() ctx: RequestContext,
        @Args() args: ProductCategoryQueryArgs,
    ): Promise<Translated<ProductCategory> | undefined> {
        return this.productCategoryService.findOne(ctx, args.id);
    }

    @Query()
    async search(...args: any): Promise<Omit<SearchResponse, 'facetValues'>> {
        throw new InternalServerError(`error.no-search-plugin-configured`);
    }
}
