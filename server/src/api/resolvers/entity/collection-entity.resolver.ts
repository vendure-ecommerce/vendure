import { Args, Parent, ResolveProperty, Resolver } from '@nestjs/graphql';

import { CollectionBreadcrumb, ProductVariantListOptions } from '../../../../../shared/generated-types';
import { PaginatedList } from '../../../../../shared/shared-types';
import { Translated } from '../../../common/types/locale-types';
import { Collection, ProductVariant } from '../../../entity';
import { CollectionService } from '../../../service/services/collection.service';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { RequestContext } from '../../common/request-context';
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
    ): Promise<PaginatedList<Translated<ProductVariant>>> {
        return this.productVariantService.getVariantsByCollectionId(ctx, collection.id, args.options);
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
}
