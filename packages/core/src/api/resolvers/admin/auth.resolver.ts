import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginResult, MutationLoginArgs, Permission } from '@vendure/common/lib/generated-types';
import { Request, Response } from 'express';

import { ConfigService } from '../../../config/config.service';
import { AdministratorService } from '../../../service/services/administrator.service';
import { AuthService } from '../../../service/services/auth.service';
import { ChannelService } from '../../../service/services/channel.service';
import { CustomerService } from '../../../service/services/customer.service';
import { UserService } from '../../../service/services/user.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';
import { BaseAuthResolver } from '../base/base-auth.resolver';

@Resolver()
export class AuthResolver extends BaseAuthResolver {
    constructor(
        authService: AuthService,
        userService: UserService,
        configService: ConfigService,
        administratorService: AdministratorService,
    ) {
        super(authService, userService, administratorService, configService);
    }

    @Mutation()
    @Allow(Permission.Public)
    login(
        @Args() args: MutationLoginArgs,
        @Ctx() ctx: RequestContext,
        @Context('req') req: Request,
        @Context('res') res: Response,
    ): Promise<LoginResult> {
        return super.login(args, ctx, req, res, 'admin');
    }

    @Mutation()
    @Allow(Permission.Public)
    logout(
        @Ctx() ctx: RequestContext,
        @Context('req') req: Request,
        @Context('res') res: Response,
    ): Promise<boolean> {
        return super.logout(ctx, req, res);
    }

    @Query()
    @Allow(Permission.Authenticated, Permission.Owner)
    me(@Ctx() ctx: RequestContext) {
        return super.me(ctx, 'admin');
    }
}
