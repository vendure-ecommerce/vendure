import { TemplateContext } from '../../types';

export function renderShopResolverWithEntity(context: TemplateContext) {
    return /* language=TypeScript */ `
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Ctx, PaginatedList, RequestContext, ListQueryOptions } from '@vendure/core';

import { ${context.service.className} } from '../services/${context.service.fileName}';
import { ${context.entity.className} } from '../entities/${context.entity.fileName}';

@Resolver()
export class ShopResolver {
    constructor(private ${context.service.instanceName}: ${context.service.className}) {
    }

    @Query()
    ${context.entity.instanceName}s(
        @Ctx() ctx: RequestContext,
        @Args() args: { options: ListQueryOptions<${context.customEntityName}> },
    ): Promise<PaginatedList<${context.customEntityName}>> {
        return this.${context.service.instanceName}.findAll(ctx, args.options || undefined);
    }

    @Query()
    ${context.entity.instanceName}(@Ctx() ctx: RequestContext, @Args() args: { id: string }): Promise<${context.customEntityName} | null> {
        return this.${context.service.instanceName}.findOne(ctx, args.id);
    }
}`;
}

export function renderShopResolver(context: TemplateContext) {
    return /* language=TypeScript */ `
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Ctx, PaginatedList, RequestContext, Transaction } from '@vendure/core';

import { ${context.service.className} } from '../services/${context.service.fileName}';

@Resolver()
export class ShopResolver {
    constructor(private ${context.service.instanceName}: ${context.service.className}) {
    }

    @Query()
    exampleShopQuery(@Ctx() ctx: RequestContext) {
        return this.${context.service.instanceName}.exampleMethod(ctx);
    }

    @Mutation()
    @Transaction()
    exampleShopMutation(@Ctx() ctx: RequestContext, @Args() args: { input: string }) {
        return this.${context.service.instanceName}.exampleMethod(ctx, args);
    }
}`;
}
