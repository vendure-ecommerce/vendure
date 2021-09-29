import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Asset } from '../../../entity/asset/asset.entity';
import { Tag } from '../../../entity/tag/tag.entity';
import { TagService } from '../../../service/services/tag.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Asset')
export class AssetEntityResolver {
    constructor(private tagService: TagService) {}

    @ResolveField()
    async tags(@Ctx() ctx: RequestContext, @Parent() asset: Asset): Promise<Tag[]> {
        if (asset.tags) {
            return asset.tags;
        }
        return this.tagService.getTagsForEntity(ctx, Asset, asset.id);
    }
}
