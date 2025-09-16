import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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

    @Query()
    @Allow(Permission.ReadServiceAccount)
    async apiKeys(
        @Ctx() ctx: RequestContext,
        @Args('administratorId') administratorId: string,
        @Args('options') options?: any,
    ): Promise<{ items: ApiKey[]; totalItems: number }> {
        // Simple list by administrator with pagination
        return this.apiKeyService.listByAdministrator(ctx, administratorId, options ?? undefined);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.CreateServiceAccount)
    async createApiKey(
        @Ctx() ctx: RequestContext,
        @Args('administratorId') administratorId: string,
        @Args('name') name: string,
        @Args('expiresAt') expiresAt?: string,
        @Args('notes') notes?: string,
    ): Promise<{ apiKey: ApiKey; rawKey: string }> {
        const expires = expiresAt ? new Date(expiresAt) : null;
        return this.apiKeyService.create(ctx, { administratorId, name, expiresAt: expires, notes });
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateServiceAccount)
    async rotateApiKey(@Ctx() ctx: RequestContext, @Args('id') id: string) {
        return this.apiKeyService.rotate(ctx, id);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateServiceAccount)
    async revokeApiKey(@Ctx() ctx: RequestContext, @Args('id') id: string) {
        return this.apiKeyService.revoke(ctx, id);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateServiceAccount)
    async invalidateApiKeySessions(@Ctx() ctx: RequestContext, @Args('id') id: string) {
        // Return number invalidated as an Int
        const count = await this.apiKeyService.invalidateSessionsForKey(ctx, id);
        return count;
    }
}
