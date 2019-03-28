import { Args, Query, Resolver } from '@nestjs/graphql';

import {
    CollectionQueryArgs,
    CollectionsQueryArgs,
    ProductQueryArgs,
    SearchResponse,
} from '../../../../../shared/generated-shop-types';
import { ProductsQueryArgs } from '../../../../../shared/generated-shop-types';
import { Omit } from '../../../../../../shared/omit';
import { PaginatedList } from '../../../../../../shared/shared-types';
import { InternalServerError } from '../../../common/error/errors';
import { Translated } from '../../../common/types/locale-types';
import { Collection } from '../../../entity/collection/collection.entity';
import { Product } from '../../../entity/product/product.entity';
import { CollectionService } from '../../../service';
import { FacetValueService } from '../../../service/services/facet-value.service';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { ProductService } from '../../../service/services/product.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver()
export class ShopProductsResolver {
    constructor(
        private productService: ProductService,
        private productVariantService: ProductVariantService,
        private facetValueService: FacetValueService,
        private collectionService: CollectionService,
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
    async collections(
        @Ctx() ctx: RequestContext,
        @Args() args: CollectionsQueryArgs,
    ): Promise<PaginatedList<Translated<Collection>>> {
        return this.collectionService.findAll(ctx, args.options || undefined);
    }

    @Query()
    async collection(
        @Ctx() ctx: RequestContext,
        @Args() args: CollectionQueryArgs,
    ): Promise<Translated<Collection> | undefined> {
        return this.collectionService.findOne(ctx, args.id);
    }

    @Query()
    async search(...args: any): Promise<Omit<SearchResponse, 'facetValues'>> {
        throw new InternalServerError(`error.no-search-plugin-configured`);
    }
}
