import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateAdministratorInput } from '@vendure/common/lib/generated-types';
import { Allow, Ctx, Permission, RequestContext, Transaction } from '@vendure/core';

import { MultivendorService } from '../service/mv.service';

@Resolver()
export class MultivendorResolver {
    constructor(private multivendorService: MultivendorService) {}

    @Mutation()
    @Transaction()
    @Allow(Permission.SuperAdmin)
    registerNewSeller(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: { shopName: string; administrator: CreateAdministratorInput } },
    ) {
        return this.multivendorService.registerNewSeller(ctx, args.input);
    }
}
