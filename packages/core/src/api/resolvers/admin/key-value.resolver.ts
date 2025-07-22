import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { KeyValueService } from '../../../service/helpers/key-value/key-value.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

export class KeyValueInput {
    key: string;
    value: any;
}

/**
 * @description
 * Resolvers for key-value operations in the Admin API.
 */
@Resolver()
export class KeyValueAdminResolver {
    constructor(private keyValueService: KeyValueService) {}

    @Query()
    async getKeyValue(@Ctx() ctx: RequestContext, @Args('key') key: string): Promise<any> {
        return this.keyValueService.get(key, ctx);
    }

    @Query()
    async getKeyValues(
        @Ctx() ctx: RequestContext,
        @Args('keys') keys: string[],
    ): Promise<Record<string, any>> {
        return this.keyValueService.getMany(keys, ctx);
    }

    @Mutation()
    async setKeyValue(@Ctx() ctx: RequestContext, @Args('input') input: KeyValueInput): Promise<boolean> {
        await this.keyValueService.set(input.key, input.value, ctx);
        return true;
    }

    @Mutation()
    async setKeyValues(
        @Ctx() ctx: RequestContext,
        @Args('inputs') inputs: KeyValueInput[],
    ): Promise<boolean> {
        const values = inputs.reduce(
            (acc, input) => {
                acc[input.key] = input.value;
                return acc;
            },
            {} as Record<string, any>,
        );

        await this.keyValueService.setMany(values, ctx);
        return true;
    }
}
