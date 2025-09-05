import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { SetSettingsStoreValueResult } from '../../../config/settings-store/settings-store-types';
import { SettingsStoreService } from '../../../service/helpers/settings-store/settings-store.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

export class SettingsStoreInput {
    key: string;
    value: any;
}

/**
 * @description
 * Resolvers for settings store operations in the Admin API.
 */
@Resolver()
export class SettingsStoreAdminResolver {
    constructor(private readonly settingsStoreService: SettingsStoreService) {}

    @Query()
    async getSettingsStoreValue(@Ctx() ctx: RequestContext, @Args('key') key: string): Promise<any> {
        return this.settingsStoreService.get(key, ctx);
    }

    @Query()
    async getSettingsStoreValues(
        @Ctx() ctx: RequestContext,
        @Args('keys') keys: string[],
    ): Promise<Record<string, any>> {
        return this.settingsStoreService.getMany(keys, ctx);
    }

    @Mutation()
    async setSettingsStoreValue(
        @Ctx() ctx: RequestContext,
        @Args('input') input: SettingsStoreInput,
    ): Promise<SetSettingsStoreValueResult> {
        return this.settingsStoreService.set(input.key, input.value, ctx);
    }

    @Mutation()
    async setSettingsStoreValues(
        @Ctx() ctx: RequestContext,
        @Args('inputs') inputs: SettingsStoreInput[],
    ): Promise<SetSettingsStoreValueResult[]> {
        const values = inputs.reduce(
            (acc, input) => {
                acc[input.key] = input.value;
                return acc;
            },
            {} as Record<string, any>,
        );

        return this.settingsStoreService.setMany(values, ctx);
    }
}
