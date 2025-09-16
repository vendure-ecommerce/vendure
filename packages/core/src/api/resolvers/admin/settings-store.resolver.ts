import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { SetSettingsStoreValueResult } from '../../../config/settings-store/settings-store-types';
import { SettingsStoreService } from '../../../service/helpers/settings-store/settings-store.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

export class SettingsStoreInput {
    key: string;
    value: any;
}

const ErrorMessage = {
    permissions: 'Insufficient permissions to set settings store value',
    readonly: 'Cannot modify readonly settings store field via API',
};

/**
 * @description
 * Resolvers for settings store operations in the Admin API.
 */
@Resolver()
export class SettingsStoreAdminResolver {
    constructor(private readonly settingsStoreService: SettingsStoreService) {}

    @Query()
    async getSettingsStoreValue(@Ctx() ctx: RequestContext, @Args('key') key: string): Promise<any> {
        if (!this.settingsStoreService.hasPermission(ctx, key)) {
            return undefined;
        }
        return this.settingsStoreService.get(ctx, key);
    }

    @Query()
    async getSettingsStoreValues(
        @Ctx() ctx: RequestContext,
        @Args('keys') keys: string[],
    ): Promise<Record<string, any>> {
        const permittedKeys = [];
        for (const key of keys) {
            if (this.settingsStoreService.hasPermission(ctx, key)) {
                permittedKeys.push(key);
            }
        }
        return this.settingsStoreService.getMany(ctx, permittedKeys);
    }

    @Mutation()
    async setSettingsStoreValue(
        @Ctx() ctx: RequestContext,
        @Args('input') input: SettingsStoreInput,
    ): Promise<SetSettingsStoreValueResult> {
        if (!this.settingsStoreService.hasPermission(ctx, input.key)) {
            return {
                key: input.key,
                result: false,
                error: ErrorMessage.permissions,
            };
        }
        if (this.settingsStoreService.isReadonly(input.key)) {
            return {
                key: input.key,
                result: false,
                error: ErrorMessage.readonly,
            };
        }
        return this.settingsStoreService.set(ctx, input.key, input.value);
    }

    @Mutation()
    async setSettingsStoreValues(
        @Ctx() ctx: RequestContext,
        @Args('inputs') inputs: SettingsStoreInput[],
    ): Promise<SetSettingsStoreValueResult[]> {
        const results: SetSettingsStoreValueResult[] = [];
        for (const input of inputs) {
            const hasPermission = this.settingsStoreService.hasPermission(ctx, input.key);
            const isWritable = !this.settingsStoreService.isReadonly(input.key);
            if (!hasPermission) {
                results.push({
                    key: input.key,
                    result: false,
                    error: ErrorMessage.permissions,
                });
            } else if (!isWritable) {
                results.push({
                    key: input.key,
                    result: false,
                    error: ErrorMessage.readonly,
                });
            } else {
                const result = await this.settingsStoreService.set(ctx, input.key, input.value);
                results.push(result);
            }
        }
        return results;
    }
}
