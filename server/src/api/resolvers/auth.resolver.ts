import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request, Response } from 'express';

import {
    LoginMutationArgs,
    LoginResult,
    Permission,
    RefreshCustomerVerificationMutationArgs,
    RegisterCustomerAccountMutationArgs,
    VerifyCustomerAccountMutationArgs,
} from '../../../../shared/generated-types';
import { VerificationTokenError } from '../../common/error/errors';
import { ConfigService } from '../../config/config.service';
import { User } from '../../entity/user/user.entity';
import { AuthService } from '../../service/services/auth.service';
import { ChannelService } from '../../service/services/channel.service';
import { CustomerService } from '../../service/services/customer.service';
import { UserService } from '../../service/services/user.service';
import { extractAuthToken } from '../common/extract-auth-token';
import { RequestContext } from '../common/request-context';
import { setAuthToken } from '../common/set-auth-token';
import { Allow } from '../decorators/allow.decorator';
import { Ctx } from '../decorators/request-context.decorator';

@Resolver('Auth')
export class AuthResolver {
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private channelService: ChannelService,
        private customerService: CustomerService,
        private configService: ConfigService,
    ) {}

    /**
     * Attempts a login given the username and password of a user. If successful, returns
     * the user data and returns the token either in a cookie or in the response body.
     */
    @Mutation()
    @Allow(Permission.Public)
    async login(
        @Args() args: LoginMutationArgs,
        @Ctx() ctx: RequestContext,
        @Context('req') req: Request,
        @Context('res') res: Response,
    ): Promise<LoginResult> {
        return await this.createAuthenticatedSession(ctx, args, req, res);
    }

    @Mutation()
    @Allow(Permission.Public)
    async logout(@Context('req') req: Request, @Context('res') res: Response): Promise<boolean> {
        const token = extractAuthToken(req, this.configService.authOptions.tokenMethod);
        if (!token) {
            return false;
        }
        await this.authService.deleteSessionByToken(token);
        setAuthToken({
            req,
            res,
            authOptions: this.configService.authOptions,
            rememberMe: false,
            authToken: '',
        });
        return true;
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
        const customer = await this.customerService.verifyCustomerEmailAddress(
            ctx,
            args.token,
            args.password,
        );
        if (customer && customer.user) {
            return this.createAuthenticatedSession(
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

    /**
     * Returns information about the current authenticated user.
     */
    @Query()
    @Allow(Permission.Authenticated)
    async me(@Ctx() ctx: RequestContext) {
        const userId = ctx.activeUserId;
        const user = userId && (await this.userService.getUserById(userId));
        return user ? this.publiclyAccessibleUser(user) : null;
    }

    /**
     * Creates an authenticated session and sets the session token.
     */
    private async createAuthenticatedSession(
        ctx: RequestContext,
        args: LoginMutationArgs,
        req: Request,
        res: Response,
    ) {
        const session = await this.authService.authenticate(ctx, args.username, args.password);
        setAuthToken({
            req,
            res,
            authOptions: this.configService.authOptions,
            rememberMe: args.rememberMe || false,
            authToken: session.token,
        });
        return {
            user: this.publiclyAccessibleUser(session.user),
        };
    }

    /**
     * Exposes a subset of the User properties which we want to expose to the public API.
     */
    private publiclyAccessibleUser(user: User): any {
        return {
            id: user.id,
            identifier: user.identifier,
            channelTokens: this.getAvailableChannelTokens(user),
        };
    }

    private getAvailableChannelTokens(user: User): string[] {
        return user.roles.reduce((tokens, role) => role.channels.map(c => c.token), [] as string[]);
    }
}
