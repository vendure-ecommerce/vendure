import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Permission } from '@vendure/common/lib/generated-types';
import { Allow, Ctx, RequestContext } from '@vendure/core';

class TemplateService {}

@Resolver()
export class SimpleAdminResolver {
    constructor(private templateService: TemplateService) {}

    @Query()
    @Allow(Permission.SuperAdmin)
    async exampleQuery(@Ctx() ctx: RequestContext, @Args() args: { id: string }): Promise<boolean> {
        return true;
    }

    @Mutation()
    @Allow(Permission.SuperAdmin)
    async exampleMutation(@Ctx() ctx: RequestContext, @Args() args: { id: string }): Promise<boolean> {
        return true;
    }
}
