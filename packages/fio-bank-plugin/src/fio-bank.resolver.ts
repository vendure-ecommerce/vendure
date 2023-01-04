import { Args, Field, Mutation, ObjectType, Resolver } from '@nestjs/graphql';
import { Allow, Ctx, Permission, RequestContext } from '@vendure/core';

import { FioBankService } from './fio-bank.service';
import { MutationGetTransactions } from './types/generated-types';

@ObjectType()
export class OrderMessage {
    @Field()
    id: string;
    @Field()
    cost: number;
    @Field()
    vs: string;
}

@Resolver()
export class FioBankResolver {
    constructor(private readonly fioBankService: FioBankService) {}

    @Mutation()
    @Allow(Permission.Public)
    async getTransactions(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationGetTransactions,
    ): Promise<OrderMessage[]> {
        const { from, to } = args;
        return this.fioBankService.getTransactions(ctx, from, to);
    }
}
