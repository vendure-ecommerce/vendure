import { Args, Query, Resolver } from '@nestjs/graphql';
import { Permission, QuerySlugForEntityArgs } from '@vendure/common/lib/generated-types';

import { EntitySlugService } from '../../../service/services/entity-slug.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver()
export class SlugResolver {
    constructor(private entitySlugService: EntitySlugService) {}

    @Query()
    @Allow(Permission.Authenticated)
    async slugForEntity(@Ctx() ctx: RequestContext, @Args() args: QuerySlugForEntityArgs): Promise<string> {
        const { entityName, fieldName, inputValue, entityId } = args.input;
        return this.entitySlugService.generateSlugFromInput(ctx, entityName, fieldName, inputValue, entityId);
    }
}
