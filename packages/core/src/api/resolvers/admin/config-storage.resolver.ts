import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    DeletionResponse,
    MutationCreateConfigArgs,
    MutationDeleteConfigArgs,
    MutationUpdateConfigArgs,
    Permission,
    QueryConfigArgs,
    QueryConfigsArgs,
} from '@vendure/common/lib/generated-types';

import { Config } from '../../../entity/config/config.entity';
import { ConfigStorageService } from '../../../service/services/config-storage.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';
import { Transaction } from '../../decorators/transaction.decorator';

@Resolver('Config')
export class ConfigStorageResolver {
    constructor(private configStorageService: ConfigStorageService) {}

    @Query()
    @Allow(Permission.Authenticated)
    async configs(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryConfigsArgs,
    ): Promise<Config[]> {
        return this.configStorageService.getConfigs(ctx);
    }

    @Query()
    @Allow(Permission.Authenticated)
    async config(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryConfigArgs,
    ): Promise<Config | undefined> {
        return this.configStorageService.getConfig(ctx, args.key);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.Authenticated)
    async createConfig(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateConfigArgs,
    ): Promise<Config> {
        return this.configStorageService.createConfig(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.Authenticated)
    async updateConfig(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateConfigArgs,
    ): Promise<Config> {
        return this.configStorageService.updateConfig(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.Authenticated)
    async deleteConfig(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationDeleteConfigArgs,
    ): Promise<DeletionResponse> {
        return this.configStorageService.deleteConfig(ctx, args.key);
    }
}