import { Args, Parent, ResolveProperty, Resolver } from '@nestjs/graphql';

import { ProductVariantListOptions } from '../../../../../shared/generated-types';
import { PaginatedList } from '../../../../../shared/shared-types';
import { Translated } from '../../../common/types/locale-types';
import { Collection, ProductVariant } from '../../../entity';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Collection')
export class CollectionEntityResolver {
    constructor(private productVariantService: ProductVariantService) {}

    @ResolveProperty()
    async productVariants(
        @Ctx() ctx: RequestContext,
        @Parent() collection: Collection,
        @Args() args: { options: ProductVariantListOptions },
    ): Promise<PaginatedList<Translated<ProductVariant>>> {
        return this.productVariantService.getVariantsByCollectionId(ctx, collection.id, args.options);
    }
}
