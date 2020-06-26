import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    LoginResult,
    MutationAuthenticateArgs,
    MutationLoginArgs,
    MutationRefreshCustomerVerificationArgs,
    MutationRegisterCustomerAccountArgs,
    MutationRequestPasswordResetArgs,
    MutationRequestUpdateCustomerEmailAddressArgs,
    MutationResetPasswordArgs,
    MutationUpdateCustomerEmailAddressArgs,
    MutationUpdateCustomerPasswordArgs,
    MutationVerifyCustomerAccountArgs,
    Permission,
} from '@vendure/common/lib/generated-shop-types';
import { HistoryEntryType } from '@vendure/common/lib/generated-types';
import { Request, Response } from 'express';

import {
    ForbiddenError,
    InternalServerError,
    PasswordResetTokenError,
    VerificationTokenError,
} from '../../../common/error/errors';
import { NATIVE_AUTH_STRATEGY_NAME } from '../../../config/auth/native-authentication-strategy';
import { ConfigService } from '../../../config/config.service';
import { Logger } from '../../../config/logger/vendure-logger';
import { AdministratorService } from '../../../service/services/administrator.service';
import { AuthService } from '../../../service/services/auth.service';
import { CustomerService } from '../../../service/services/customer.service';
import { HistoryService } from '../../../service/services/history.service';
import { UserService } from '../../../service/services/user.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';
import { BaseAuthResolver } from '../base/base-auth.resolver';

@Resolver()
export class ShopAuthResolver extends BaseAuthResolver {
    private nativeAuthStrategyIsConfigured = false;

    constructor(
        authService: AuthService,
        userService: UserService,
        administratorService: AdministratorService,
        configService: ConfigService,
        protected customerService: CustomerService,
        protected historyService: HistoryService,
    ) {
        super(authService, userService, administratorService, configService);
        this.nativeAuthStrategyIsConfigured = !!this.configService.authOptions.shopAuthenticationStrategy.find(
            strategy => strategy.name === NATIVE_AUTH_STRATEGY_NAME,
        );
    }

    @Mutation()
    @Allow(Permission.Public)
    login(
        @Args() args: MutationLoginArgs,
        @Ctx() ctx: RequestContext,
        @Context('req') req: Request,
        @Context('res') res: Response,
    ): Promise<LoginResult> {
        this.requireNativeAuthStrategy();
        return super.login(args, ctx, req, res);
    }

    @Mutation()
    @Allow(Permission.Public)
    authenticate(
        @Args() args: MutationAuthenticateArgs,
        @Ctx() ctx: RequestContext,
        @Context('req') req: Request,
        @Context('res') res: Response,
    ): Promise<LoginResult> {
        return this.createAuthenticatedSession(ctx, args, req, res);
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
    @Allow(Permission.Authenticated)
    me(@Ctx() ctx: RequestContext) {
        return super.me(ctx, 'shop');
    }

    @Mutation()
    @Allow(Permission.Public)
    async registerCustomerAccount(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationRegisterCustomerAccountArgs,
    ) {
        this.requireNativeAuthStrategy();
        return this.customerService.registerCustomerAccount(ctx, args.input).then(() => true);
    }

    @Mutation()
    @Allow(Permission.Public)
    async verifyCustomerAccount(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationVerifyCustomerAccountArgs,
        @Context('req') req: Request,
        @Context('res') res: Response,
    ) {
        this.requireNativeAuthStrategy();
        const customer = await this.customerService.verifyCustomerEmailAddress(
            ctx,
            args.token,
            args.password,
        );
        if (customer && customer.user) {
            return super.createAuthenticatedSession(
                ctx,
                {
                    input: {
                        [NATIVE_AUTH_STRATEGY_NAME]: {
                            username: customer.user.identifier,
                            password: args.password,
                        },
                    },
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
        @Args() args: MutationRefreshCustomerVerificationArgs,
    ) {
        this.requireNativeAuthStrategy();
        return this.customerService.refreshVerificationToken(ctx, args.emailAddress).then(() => true);
    }

    @Mutation()
    @Allow(Permission.Public)
    async requestPasswordReset(@Ctx() ctx: RequestContext, @Args() args: MutationRequestPasswordResetArgs) {
        return this.customerService.requestPasswordReset(ctx, args.emailAddress).then(() => true);
    }

    @Mutation()
    @Allow(Permission.Public)
    async resetPassword(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationResetPasswordArgs,
        @Context('req') req: Request,
        @Context('res') res: Response,
    ) {
        this.requireNativeAuthStrategy();
        const { token, password } = args;
        const customer = await this.customerService.resetPassword(ctx, token, password);
        if (customer && customer.user) {
            return super.createAuthenticatedSession(
                ctx,
                {
                    input: {
                        [NATIVE_AUTH_STRATEGY_NAME]: {
                            username: customer.user.identifier,
                            password: args.password,
                        },
                    },
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
        @Args() args: MutationUpdateCustomerPasswordArgs,
    ): Promise<boolean> {
        this.requireNativeAuthStrategy();
        const result = await super.updatePassword(ctx, args.currentPassword, args.newPassword);
        if (result && ctx.activeUserId) {
            const customer = await this.customerService.findOneByUserId(ctx.activeUserId);
            if (customer) {
                await this.historyService.createHistoryEntryForCustomer({
                    ctx,
                    customerId: customer.id,
                    type: HistoryEntryType.CUSTOMER_PASSWORD_UPDATED,
                    data: {},
                });
            }
        }
        return result;
    }

    @Mutation()
    @Allow(Permission.Owner)
    async requestUpdateCustomerEmailAddress(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationRequestUpdateCustomerEmailAddressArgs,
    ): Promise<boolean> {
        this.requireNativeAuthStrategy();
        if (!ctx.activeUserId) {
            throw new ForbiddenError();
        }
        await this.authService.verifyUserPassword(ctx.activeUserId, args.password);
        return this.customerService.requestUpdateEmailAddress(ctx, ctx.activeUserId, args.newEmailAddress);
    }

    @Mutation()
    @Allow(Permission.Owner)
    async updateCustomerEmailAddress(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateCustomerEmailAddressArgs,
    ): Promise<boolean> {
        this.requireNativeAuthStrategy();
        return this.customerService.updateEmailAddress(ctx, args.token);
    }

    private requireNativeAuthStrategy() {
        if (!this.nativeAuthStrategyIsConfigured) {
            const authStrategyNames = this.configService.authOptions.shopAuthenticationStrategy
                .map(s => s.name)
                .join(', ');
            const errorMessage =
                'This GraphQL operation requires that the NativeAuthenticationStrategy be configured for the Shop API.\n' +
                `Currently the following AuthenticationStrategies are enabled: ${authStrategyNames}`;
            Logger.error(errorMessage);
            throw new InternalServerError('error.');
        }
    }
}
