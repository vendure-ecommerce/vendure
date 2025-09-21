import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
    CreateApiKeyResult,
    MutationCreateApiKeyArgs,
    Permission,
} from '@vendure/common/lib/generated-types';

import { Ctx, RequestContext } from '../..';
import { ApiKeyService } from '../../../service/services/api-key.service';
import { Allow } from '../../decorators/allow.decorator';
import { Transaction } from '../../decorators/transaction.decorator';

@Resolver('ApiKey')
export class ApiKeyResolver {
    constructor(private apiKeyService: ApiKeyService) {}

    @Transaction()
    @Mutation()
    @Allow(Permission.CreateApiKey)
    async createApiKey(
        @Ctx() ctx: RequestContext,
        @Args() { input }: MutationCreateApiKeyArgs,
    ): Promise<CreateApiKeyResult> {
        return this.apiKeyService.create(ctx, input);
    }
}
