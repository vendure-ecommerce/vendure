import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    LoginMutationArgs,
    LoginResult,
    Permission,
    RefreshCustomerVerificationMutationArgs,
    RegisterCustomerAccountMutationArgs,
    RequestPasswordResetMutationArgs,
    ResetPasswordMutationArgs,
    UpdateCustomerPasswordMutationArgs,
    VerifyCustomerAccountMutationArgs,
} from '@vendure/common/generated-shop-types';
import { Request, Response } from 'express';

import { PasswordResetTokenError, VerificationTokenError } from '../../../common/error/errors';
import { ConfigService } from '../../../config/config.service';
import { AuthService } from '../../../service/services/auth.service';
import { CustomerService } from '../../../service/services/customer.service';
import { UserService } from '../../../service/services/user.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';
import { BaseAuthResolver } from '../base/base-auth.resolver';

@Resolver()
export class ShopAuthResolver extends BaseAuthResolver {
    constructor(
        protected authService: AuthService,
        protected userService: UserService,
        protected customerService: CustomerService,
        protected configService: ConfigService,
    ) {
        super(authService, userService, configService);
    }

    @Mutation()
    @Allow(Permission.Public)
    login(
        @Args() args: LoginMutationArgs,
        @Ctx() ctx: RequestContext,
        @Context('req') req: Request,
        @Context('res') res: Response,
    ): Promise<LoginResult> {
        return super.login(args, ctx, req, res);
    }

    @Mutation()
    @Allow(Permission.Public)
    logout(@Context('req') req: Request, @Context('res') res: Response): Promise<boolean> {
        return super.logout(req, res);
    }

    @Query()
    @Allow(Permission.Authenticated)
    me(@Ctx() ctx: RequestContext) {
        return super.me(ctx);
    }

    @Mutation()
    @Allow(Permission.Public)
    async registerCustomerAccount(
        @Ctx() ctx: RequestContext,
        @Args() args: RegisterCustomerAccountMutationArgs,
    ) {
        return this.customerService.registerCustomerAccount(ctx, args.input).then(() => true);
    }

    @Mutation()
    @Allow(Permission.Public)
    async verifyCustomerAccount(
        @Ctx() ctx: RequestContext,
        @Args() args: VerifyCustomerAccountMutationArgs,
        @Context('req') req: Request,
        @Context('res') res: Response,
    ) {
        const customer = await this.customerService.verifyCustomerEmailAddress(args.token, args.password);
        if (customer && customer.user) {
            return super.createAuthenticatedSession(
                ctx,
                {
                    username: customer.user.identifier,
                    password: args.password,
                    rememberMe: true,
                },
                req,
                res,
            );
        } else {
            throw new VerificationTokenError();
        }
    }

    @Mutation()
    @Allow(Permission.Public)
    async refreshCustomerVerification(
        @Ctx() ctx: RequestContext,
        @Args() args: RefreshCustomerVerificationMutationArgs,
    ) {
        return this.customerService.refreshVerificationToken(ctx, args.emailAddress).then(() => true);
    }

    @Mutation()
    @Allow(Permission.Public)
    async requestPasswordReset(@Ctx() ctx: RequestContext, @Args() args: RequestPasswordResetMutationArgs) {
        return this.customerService.requestPasswordReset(ctx, args.emailAddress).then(() => true);
    }

    @Mutation()
    @Allow(Permission.Public)
    async resetPassword(
        @Ctx() ctx: RequestContext,
        @Args() args: ResetPasswordMutationArgs,
        @Context('req') req: Request,
        @Context('res') res: Response,
    ) {
        const { token, password } = args;
        const customer = await this.customerService.resetPassword(token, password);
        if (customer && customer.user) {
            return super.createAuthenticatedSession(
                ctx,
                {
                    username: customer.user.identifier,
                    password: args.password,
                    rememberMe: true,
                },
                req,
                res,
            );
        } else {
            throw new PasswordResetTokenError();
        }
    }

    @Mutation()
    @Allow(Permission.Owner)
    async updateCustomerPassword(
        @Ctx() ctx: RequestContext,
        @Args() args: UpdateCustomerPasswordMutationArgs,
    ): Promise<boolean> {
        return super.updatePassword(ctx, args.currentPassword, args.newPassword);
    }
}
