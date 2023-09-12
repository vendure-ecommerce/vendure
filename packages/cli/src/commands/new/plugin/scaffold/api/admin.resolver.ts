import { TemplateContext } from '../../types';

export function renderAdminResolverWithEntity(context: TemplateContext) {
    return /* language=TypeScript */ `
import { Args, Resolver, Mutation } from '@nestjs/graphql';
import { Allow, Ctx, RequestContext, Transaction, Permission } from '@vendure/core';

import { ${context.entity.instanceName}Permission } from '../constants';
import { ${context.service.className} } from '../services/${context.service.fileName}';
import { ${context.entity.className} } from '../entities/${context.entity.fileName}';

// TODO: Set up graphql-code-generator to generate the types for the following inputs
type Create${context.customEntityName}Input = any;
type Update${context.customEntityName}Input = any;

@Resolver()
export class AdminResolver {
    constructor(private ${context.service.instanceName}: ${context.service.className}) {
    }

    @Transaction()
    @Mutation()
    @Allow(${context.entity.instanceName}Permission.Create)
    create${context.entity.className}(@Ctx() ctx: RequestContext, @Args() args: { input: Create${context.customEntityName}Input }): Promise<${context.entity.className}> {
        return this.${context.service.instanceName}.create(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(${context.entity.instanceName}Permission.Update)
    update${context.entity.className}(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: Update${context.customEntityName}Input },
    ): Promise<${context.entity.className} | undefined> {
        return this.${context.service.instanceName}.update(ctx, args.input);
    }
}`;
}

export function renderAdminResolver(context: TemplateContext) {
    return /* language=TypeScript */ `
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Ctx, PaginatedList, RequestContext, Transaction } from '@vendure/core';

import { ${context.service.className} } from '../services/${context.service.fileName}';

@Resolver()
export class AdminResolver {
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
