import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DeletionResponse, Permission } from '@vendure/common/lib/generated-types';
import { Allow, Ctx, PaginatedList, RequestContext, Transaction, VendureEntity } from '@vendure/core';

class TemplateEntity extends VendureEntity {}

class TemplateService {
    findAll(ctx: RequestContext, options?: any): Promise<PaginatedList<TemplateEntity>> {
        throw new Error('Method not implemented.');
    }

    findOne(ctx: RequestContext, id: string): Promise<TemplateEntity | null> {
        throw new Error('Method not implemented.');
    }

    create(ctx: RequestContext, input: any): Promise<TemplateEntity> {
        throw new Error('Method not implemented.');
    }

    update(ctx: RequestContext, input: any): Promise<TemplateEntity> {
        throw new Error('Method not implemented.');
    }

    delete(ctx: RequestContext, id: string): Promise<DeletionResponse> {
        throw new Error('Method not implemented.');
    }
}

@Resolver()
export class EntityAdminResolver {
    constructor(private templateService: TemplateService) {}

    @Query()
    @Allow(Permission.SuperAdmin)
    async entity(@Ctx() ctx: RequestContext, @Args() args: any): Promise<TemplateEntity | null> {
        return this.templateService.findOne(ctx, args.id);
    }

    @Query()
    @Allow(Permission.SuperAdmin)
    async entities(@Ctx() ctx: RequestContext, @Args() args: any): Promise<PaginatedList<TemplateEntity>> {
        return this.templateService.findAll(ctx, args.options || undefined);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.SuperAdmin)
    async createEntity(@Ctx() ctx: RequestContext, @Args() args: any): Promise<TemplateEntity> {
        return this.templateService.create(ctx, args.input);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.SuperAdmin)
    async updateEntity(@Ctx() ctx: RequestContext, @Args() args: any): Promise<TemplateEntity> {
        return this.templateService.update(ctx, args.input);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.SuperAdmin)
    async deleteEntity(@Ctx() ctx: RequestContext, @Args() args: any): Promise<DeletionResponse> {
        return this.templateService.delete(ctx, args.id);
    }
}
