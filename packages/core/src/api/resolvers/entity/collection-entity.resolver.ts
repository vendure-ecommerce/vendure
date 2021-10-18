import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { CollectionBreadcrumb, ProductVariantListOptions } from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { ListQueryOptions } from '../../../common/types/common-types';
import { Translated } from '../../../common/types/locale-types';
import { Asset, Collection, Product, ProductVariant } from '../../../entity';
import { LocaleStringHydrator } from '../../../service/helpers/locale-string-hydrator/locale-string-hydrator';
import { AssetService } from '../../../service/services/asset.service';
import { CollectionService } from '../../../service/services/collection.service';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { ApiType } from '../../common/get-api-type';
import { RequestContext } from '../../common/request-context';
import { Api } from '../../decorators/api.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Collection')
export class CollectionEntityResolver {
    constructor(
        private productVariantService: ProductVariantService,
        private collectionService: CollectionService,
        private assetService: AssetService,
        private localeStringHydrator: LocaleStringHydrator,
    ) {}

    @ResolveField()
    name(@Ctx() ctx: RequestContext, @Parent() collection: Collection): Promise<string> {
        return this.localeStringHydrator.hydrateLocaleStringField(ctx, collection, 'name');
    }

    @ResolveField()
    slug(@Ctx() ctx: RequestContext, @Parent() collection: Collection): Promise<string> {
        return this.localeStringHydrator.hydrateLocaleStringField(ctx, collection, 'slug');
    }

    @ResolveField()
    description(@Ctx() ctx: RequestContext, @Parent() collection: Collection): Promise<string> {
        return this.localeStringHydrator.hydrateLocaleStringField(ctx, collection, 'description');
    }

    @ResolveField()
    async productVariants(
        @Ctx() ctx: RequestContext,
        @Parent() collection: Collection,
        @Args() args: { options: ProductVariantListOptions },
        @Api() apiType: ApiType,
    ): Promise<PaginatedList<Translated<ProductVariant>>> {
        let options: ListQueryOptions<Product> = args.options;
        if (apiType === 'shop') {
            options = {
                ...args.options,
                filter: {
                    ...(args.options ? args.options.filter : {}),
                    enabled: { eq: true },
                },
            };
        }
        return this.productVariantService.getVariantsByCollectionId(ctx, collection.id, options);
    }

    @ResolveField()
    async breadcrumbs(
        @Ctx() ctx: RequestContext,
        @Parent() collection: Collection,
    ): Promise<CollectionBreadcrumb[]> {
        return this.collectionService.getBreadcrumbs(ctx, collection) as any;
    }

    @ResolveField()
    async parent(
        @Ctx() ctx: RequestContext,
        @Parent() collection: Collection,
        @Api() apiType: ApiType,
    ): Promise<Collection | undefined> {
        let parent: Collection | undefined;
        if (collection.parent) {
            parent = collection.parent;
        } else {
            parent = await this.collectionService.getParent(ctx, collection.id);
        }
        return apiType === 'shop' && parent?.isPrivate ? undefined : parent;
    }

    @ResolveField()
    async children(
        @Ctx() ctx: RequestContext,
        @Parent() collection: Collection,
        @Api() apiType: ApiType,
    ): Promise<Collection[]> {
        let children: Collection[] = [];
        if (collection.children) {
            children = collection.children;
        } else {
            children = (await this.collectionService.getChildren(ctx, collection.id)) as any;
        }
        return children.filter(c => (apiType === 'shop' ? !c.isPrivate : true));
    }

    @ResolveField()
    async featuredAsset(
        @Ctx() ctx: RequestContext,
        @Parent() collection: Collection,
    ): Promise<Asset | undefined> {
        if (collection.featuredAsset) {
            return collection.featuredAsset;
        }
        return this.assetService.getFeaturedAsset(ctx, collection);
    }

    @ResolveField()
    async assets(@Ctx() ctx: RequestContext, @Parent() collection: Collection): Promise<Asset[] | undefined> {
        return this.assetService.getEntityAssets(ctx, collection);
    }
}
