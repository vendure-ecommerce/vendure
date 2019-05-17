import { Args, Parent, ResolveProperty, Resolver } from '@nestjs/graphql';
import { CollectionBreadcrumb, ProductVariantListOptions } from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { ListQueryOptions } from '../../../common/types/common-types';
import { Translated } from '../../../common/types/locale-types';
import { Collection, Product, ProductVariant } from '../../../entity';
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
    ) {}

    @ResolveProperty()
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

    @ResolveProperty()
    async breadcrumbs(
        @Ctx() ctx: RequestContext,
        @Parent() collection: Collection,
    ): Promise<CollectionBreadcrumb[]> {
        return this.collectionService.getBreadcrumbs(ctx, collection) as any;
    }

    @ResolveProperty()
    async parent(@Ctx() ctx: RequestContext, @Parent() collection: Collection): Promise<Collection> {
        if (collection.parent) {
            return collection.parent;
        }
        return this.collectionService.getParent(ctx, collection.id) as any;
    }

    @ResolveProperty()
    async children(@Ctx() ctx: RequestContext, @Parent() collection: Collection): Promise<Collection[]> {
        if (collection.children) {
            return collection.children;
        }
        return this.collectionService.getChildren(ctx, collection.id) as any;
    }
}
