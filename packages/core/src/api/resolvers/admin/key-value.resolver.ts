import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { SetKeyValueResult } from '../../../config/key-value/key-value-types';
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
    async setKeyValue(
        @Ctx() ctx: RequestContext,
        @Args('input') input: KeyValueInput,
    ): Promise<SetKeyValueResult> {
        return this.keyValueService.setSafe(input.key, input.value, ctx);
    }

    @Mutation()
    async setKeyValues(
        @Ctx() ctx: RequestContext,
        @Args('inputs') inputs: KeyValueInput[],
    ): Promise<SetKeyValueResult[]> {
        const values = inputs.reduce(
            (acc, input) => {
                acc[input.key] = input.value;
                return acc;
            },
            {} as Record<string, any>,
        );

        return this.keyValueService.setManySafe(values, ctx);
    }
}
