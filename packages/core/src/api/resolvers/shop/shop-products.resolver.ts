import { Args, Query, Resolver } from '@nestjs/graphql';
import {
    CollectionQueryArgs,
    CollectionsQueryArgs,
    ProductQueryArgs,
    SearchResponse,
} from '@vendure/common/lib/generated-shop-types';
import { ProductsQueryArgs } from '@vendure/common/lib/generated-shop-types';
import { Omit } from '@vendure/common/lib/omit';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { InternalServerError } from '../../../common/error/errors';
import { ListQueryOptions } from '../../../common/types/common-types';
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
        const options: ListQueryOptions<Product> = {
            ...args.options,
            filter: {
                ...(args.options && args.options.filter),
                enabled: { eq: true },
            },
        };
        return this.productService.findAll(ctx, options);
    }

    @Query()
    async product(
        @Ctx() ctx: RequestContext,
        @Args() args: ProductQueryArgs,
    ): Promise<Translated<Product> | undefined> {
        const result = await this.productService.findOne(ctx, args.id);
        if (!result) {
            return;
        }
        if (result.enabled === false) {
            return;
        }
        return result;
    }

    @Query()
    async collections(
        @Ctx() ctx: RequestContext,
        @Args() args: CollectionsQueryArgs,
    ): Promise<PaginatedList<Translated<Collection>>> {
        const options: ListQueryOptions<Collection> = {
            ...args.options,
            filter: {
                ...(args.options && args.options.filter),
                isPrivate: { eq: false },
            },
        };
        return this.collectionService.findAll(ctx, options || undefined);
    }

    @Query()
    async collection(
        @Ctx() ctx: RequestContext,
        @Args() args: CollectionQueryArgs,
    ): Promise<Translated<Collection> | undefined> {
        const collection = await this.collectionService.findOne(ctx, args.id);
        if (collection && collection.isPrivate) {
            return;
        }
        return collection;
    }

    @Query()
    async search(...args: any): Promise<Omit<SearchResponse, 'facetValues'>> {
        throw new InternalServerError(`error.no-search-plugin-configured`);
    }
}
