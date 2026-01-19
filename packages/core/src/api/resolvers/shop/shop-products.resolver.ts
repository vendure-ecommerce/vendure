import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import {
    QueryCollectionArgs,
    QueryCollectionsArgs,
    QueryFacetArgs,
    QueryFacetsArgs,
    QueryProductArgs,
    QueryProductsArgs,
    SearchResponse,
} from '@vendure/common/lib/generated-shop-types';
import { Omit } from '@vendure/common/lib/omit';
import { PaginatedList } from '@vendure/common/lib/shared-types';
import { GraphQLResolveInfo } from 'graphql';

import { RequestContextCacheService } from '../../../cache/request-context-cache.service';
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
import { RelationPaths, Relations } from '../../decorators/relations.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver()
export class ShopProductsResolver {
    constructor(
        private productService: ProductService,
        private productVariantService: ProductVariantService,
        private facetValueService: FacetValueService,
        private collectionService: CollectionService,
        private facetService: FacetService,
        private requestContextCache: RequestContextCacheService,
    ) {}

    @Query()
    async products(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryProductsArgs,
        @Relations({ entity: Product, omit: ['variants', 'assets'] }) relations: RelationPaths<Product>,
    ): Promise<PaginatedList<Translated<Product>>> {
        const options: ListQueryOptions<Product> = {
            ...args.options,
            filter: {
                ...(args.options && args.options.filter),
                enabled: { eq: true },
            },
        };
        return this.productService.findAll(ctx, options, relations);
    }

    @Query()
    async product(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryProductArgs,
        @Relations({ entity: Product, omit: ['variants', 'assets'] }) relations: RelationPaths<Product>,
    ): Promise<Translated<Product> | undefined> {
        let result: Translated<Product> | undefined;
        if (args.id) {
            result = await this.productService.findOne(ctx, args.id, relations);
        } else if (args.slug) {
            result = await this.productService.findOneBySlug(ctx, args.slug, relations);
        } else {
            throw new UserInputError('error.product-id-or-slug-must-be-provided');
        }
        if (!result) {
            return;
        }
        if (result.enabled === false) {
            return;
        }
        result.facetValues = result.facetValues?.filter(fv => !fv.facet.isPrivate) as any;
        return result;
    }

    @Query()
    async collections(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryCollectionsArgs,
        @Relations({
            entity: Collection,
            omit: ['productVariants', 'assets', 'parent.productVariants', 'children.productVariants'],
        })
        relations: RelationPaths<Collection>,
        @Info() info: GraphQLResolveInfo,
    ): Promise<PaginatedList<Translated<Collection>>> {
        const options: ListQueryOptions<Collection> = {
            ...args.options,
            filter: {
                ...(args.options && args.options.filter),
                isPrivate: { eq: false },
            },
        };
        const collections = await this.collectionService.findAll(ctx, options || undefined, relations);
        // Only cache collection IDs if productVariantCount is requested in the query
        if (this.isFieldRequested(info, 'productVariantCount')) {
            const collectionIds = collections.items.map(c => c.id);
            this.requestContextCache.set(ctx, 'CollectionService.collectionIds', collectionIds);
        }
        return collections;
    }

    /**
     * Checks if a specific field is requested in the GraphQL query selection set.
     * Looks for the field within the 'items' selection of a paginated list.
     */
    private isFieldRequested(info: GraphQLResolveInfo, fieldName: string): boolean {
        for (const fieldNode of info.fieldNodes) {
            const selections = fieldNode.selectionSet?.selections ?? [];
            for (const selection of selections) {
                if (selection.kind === 'Field' && selection.name.value === 'items') {
                    const itemSelections = selection.selectionSet?.selections ?? [];
                    for (const itemSelection of itemSelections) {
                        if (itemSelection.kind === 'Field' && itemSelection.name.value === fieldName) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    @Query()
    async collection(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryCollectionArgs,
        @Relations({
            entity: Collection,
            omit: ['productVariants', 'assets', 'parent.productVariants', 'children.productVariants'],
        })
        relations: RelationPaths<Collection>,
    ): Promise<Translated<Collection> | undefined> {
        let collection: Translated<Collection> | undefined;
        if (args.id) {
            collection = await this.collectionService.findOne(ctx, args.id, relations);
            if (args.slug && collection && collection.slug !== args.slug) {
                throw new UserInputError('error.collection-id-slug-mismatch');
            }
        } else if (args.slug) {
            collection = await this.collectionService.findOneBySlug(ctx, args.slug, relations);
        } else {
            throw new UserInputError('error.collection-id-or-slug-must-be-provided');
        }
        if (collection && collection.isPrivate) {
            return;
        }
        return collection;
    }

    @Query()
    async search(...args: any): Promise<Omit<SearchResponse, 'facetValues'>> {
        throw new InternalServerError('error.no-search-plugin-configured');
    }

    @Query()
    async facets(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryFacetsArgs,
        @Relations(Facet) relations: RelationPaths<Facet>,
    ): Promise<PaginatedList<Translated<Facet>>> {
        const options: ListQueryOptions<Facet> = {
            ...args.options,
            filter: {
                ...(args.options && args.options.filter),
                isPrivate: { eq: false },
            },
        };
        return this.facetService.findAll(ctx, options || undefined, relations);
    }

    @Query()
    async facet(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryFacetArgs,
        @Relations(Facet) relations: RelationPaths<Facet>,
    ): Promise<Translated<Facet> | undefined> {
        const facet = await this.facetService.findOne(ctx, args.id, relations);
        if (facet && facet.isPrivate) {
            return;
        }
        return facet;
    }
}
