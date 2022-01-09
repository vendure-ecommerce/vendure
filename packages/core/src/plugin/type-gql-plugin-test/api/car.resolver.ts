import { Args, Query, Resolver } from '@nestjs/graphql';

import { Ctx, RequestContext } from '../../..';

@Resolver('Car')
export class CarResolver {
    @Query()
    cars(@Ctx() ctx: RequestContext, @Args() args: any) {
        return [];
    }
}
