import { Args, Query, Resolver } from '@nestjs/graphql';
import {
    QueryCollectionArgs,
    QueryCollectionsArgs,
    QueryFacetArgs,
    QueryFacetsArgs,
    QueryProductArgs,
    SearchResponse,
} from '@vendure/common/lib/generated-shop-types';
import { QueryProductsArgs } from '@vendure/common/lib/generated-shop-types';
import { Omit } from '@vendure/common/lib/omit';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { InternalServerError, UserInputError } from '../../../common/error/errors';
import { ListQueryOptions } from '../../../common/types/common-types';
import { Translated } from '../../../common/types/locale-types';
import { Collection } from '../../../entity/collection/collection.entity';
import { Facet } from '../../../entity/facet/facet.entity';
import { Product } from '../../../entity/product/product.entity';
import { CollectionService, FacetService } from '../../../service';
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
        private facetService: FacetService,
    ) {}

    @Query()
    async products(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryProductsArgs,
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
        @Args() args: QueryProductArgs,
    ): Promise<Translated<Product> | undefined> {
        let result: Translated<Product> | undefined;
        if (args.id) {
            result = await this.productService.findOne(ctx, args.id);
        } else if (args.slug) {
            result = await this.productService.findOneBySlug(ctx, args.slug);
        } else {
            throw new UserInputError(`error.product-id-or-slug-must-be-provided`);
        }
        if (!result) {
            return;
        }
        if (result.enabled === false) {
            return;
        }
        result.facetValues = result.facetValues.filter(fv => !fv.facet.isPrivate) as any;
        return result;
    }

    @Query()
    async collections(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryCollectionsArgs,
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
        @Args() args: QueryCollectionArgs,
    ): Promise<Translated<Collection> | undefined> {
        let collection: Translated<Collection> | undefined;
        if (args.id) {
            collection = await this.collectionService.findOne(ctx, args.id);
            if (args.slug && collection && collection.slug !== args.slug) {
                throw new UserInputError(`error.collection-id-slug-mismatch`);
            }
        } else if (args.slug) {
            collection = await this.collectionService.findOneBySlug(ctx, args.slug);
        } else {
            throw new UserInputError(`error.collection-id-or-slug-must-be-provided`);
        }
        if (collection && collection.isPrivate) {
            return;
        }
        return collection;
    }

    @Query()
    async search(...args: any): Promise<Omit<SearchResponse, 'facetValues'>> {
        throw new InternalServerError(`error.no-search-plugin-configured`);
    }

    @Query()
    async facets(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryFacetsArgs,
    ): Promise<PaginatedList<Translated<Facet>>> {
        const options: ListQueryOptions<Facet> = {
            ...args.options,
            filter: {
                ...(args.options && args.options.filter),
                isPrivate: { eq: false },
            },
        };
        return this.facetService.findAll(ctx, options || undefined);
    }

    @Query()
    async facet(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryFacetArgs,
    ): Promise<Translated<Facet> | undefined> {
        const facet = await this.facetService.findOne(ctx, args.id);
        if (facet && facet.isPrivate) {
            return;
        }
        return facet;
    }
}
