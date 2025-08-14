import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
    MutationCreateAdministratorArgs,
    MutationUpdateAdministratorArgs,
    Permission,
} from '@vendure/common/lib/generated-types';

import { Allow, Ctx, RequestContext, Transaction } from '../../../api';
import { Administrator } from '../../../entity';
import { AdministratorService } from '../../../service';

@Resolver()
export class ChannelRoleResolver {
    constructor(private administratorService: AdministratorService) {}

    // TODO i18n as a proper Vendure error if we decide to keep this
    // this is just a placeholder for now
    private errorMessage =
        'ChannelRolePlugin introduces custom mutations for administrators.' +
        ' Please use `createChannelAdministrator` and `updateChannelAdministrator`' +
        ' instead of `createAdministrator` and `updateAdministrator`.';

    // // // OVERRIDES

    @Transaction()
    @Mutation()
    @Allow(Permission.CreateAdministrator)
    createAdministrator(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateAdministratorArgs,
    ): Promise<Administrator> {
        throw new Error(this.errorMessage);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateAdministrator)
    updateAdministrator(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateAdministratorArgs,
    ): Promise<Administrator> {
        throw new Error(this.errorMessage);
    }

    // // // EXTENSIONS

    @Transaction()
    @Mutation()
    @Allow(Permission.CreateAdministrator)
    createChannelAdministrator(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateAdministratorArgs, // TODO Type
    ): Promise<Administrator> {
        return this.administratorService.create(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateAdministrator)
    updateChannelAdministrator(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateAdministratorArgs, // TODO Type
    ): Promise<Administrator> {
        return this.administratorService.update(ctx, args.input);
    }
}
