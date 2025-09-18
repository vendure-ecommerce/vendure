import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Permission } from '@vendure/common/lib/generated-types';

import { ApiKey } from '../../../entity/api-key/api-key.entity';
import { ApiKeyService } from '../../../service/services/api-key.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';
import { Transaction } from '../../decorators/transaction.decorator';

@Resolver('ApiKey')
export class ApiKeyResolver {
    constructor(private readonly apiKeyService: ApiKeyService) {}

    @Transaction()
    @Mutation()
    @Allow(Permission.Authenticated)
    async createApiKey(
        @Ctx() ctx: RequestContext,
        @Args('name') name: string,
        @Args('expiresAt') expiresAt: string,
        @Args('notes') notes?: string,
    ): Promise<{ apiKey: ApiKey; rawKey: string }> {
        if (!ctx.activeUserId) {
            throw new Error('No active user');
        }
        if (!expiresAt) {
            throw new Error('expiresAt is required');
        }
        const expires = new Date(expiresAt);
        if (isNaN(expires.getTime())) {
            throw new Error('expiresAt must be a valid date');
        }
        return this.apiKeyService.create(ctx, {
            userId: ctx.activeUserId as any,
            name,
            expiresAt: expires,
            notes,
        });
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.Authenticated)
    async rotateApiKey(@Ctx() ctx: RequestContext, @Args('id') id: string) {
        return this.apiKeyService.rotate(ctx, id);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.Authenticated)
    async revokeApiKey(@Ctx() ctx: RequestContext, @Args('id') id: string) {
        return this.apiKeyService.revoke(ctx, id);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.Authenticated)
    async deleteApiKey(@Ctx() ctx: RequestContext, @Args('id') id: string) {
        return this.apiKeyService.delete(ctx, id);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.Authenticated)
    async invalidateApiKeySessions(@Ctx() ctx: RequestContext, @Args('id') id: string) {
        // Return number invalidated as an Int
        const count = await this.apiKeyService.invalidateSessionsForKey(ctx, id);
        return count;
    }

    @ResolveField()
    status(@Parent() apiKey: ApiKey): 'ACTIVE' | 'REVOKED' {
        return apiKey.status === 'active' ? 'ACTIVE' : 'REVOKED';
    }

    @Query()
    @Allow(Permission.Authenticated)
    async apiKeys(
        @Ctx() ctx: RequestContext,
        @Args('options') options?: any,
    ): Promise<{ items: ApiKey[]; totalItems: number }> {
        if (!ctx.activeUserId) {
            return { items: [], totalItems: 0 };
        }
        return this.apiKeyService.listByUser(ctx, ctx.activeUserId as any, options ?? undefined);
    }
}
