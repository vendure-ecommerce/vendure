import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { LoginMutationArgs, LoginResult, Permission } from 'shared/generated-types';

import { ConfigService } from '../../config/config.service';
import { AuthenticatedSession } from '../../entity/session/authenticated-session.entity';
import { User } from '../../entity/user/user.entity';
import { AuthService } from '../../service/services/auth.service';
import { ChannelService } from '../../service/services/channel.service';
import { extractAuthToken } from '../common/extract-auth-token';
import { RequestContext } from '../common/request-context';
import { setAuthToken } from '../common/set-auth-token';
import { Allow } from '../decorators/allow.decorator';
import { Ctx } from '../decorators/request-context.decorator';

@Resolver('Auth')
export class AuthResolver {
    constructor(
        private authService: AuthService,
        private channelService: ChannelService,
        private configService: ConfigService,
    ) {}

    /**
     * Attempts a login given the username and password of a user. If successful, returns
     * the user data and returns the token either in a cookie or in the response body.
     */
    @Mutation()
    async login(
        @Args() args: LoginMutationArgs,
        @Context('req') req: Request,
        @Context('res') res: Response,
    ): Promise<LoginResult> {
        const session = await this.authService.authenticate(args.username, args.password);
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

    @Mutation()
    async logout(@Context('req') req: Request, @Context('res') res: Response): Promise<boolean> {
        const token = extractAuthToken(req, this.configService.authOptions.tokenMethod);
        if (!token) {
            return false;
        }
        await this.authService.invalidateSessionByToken(token);
        setAuthToken({
            req,
            res,
            authOptions: this.configService.authOptions,
            rememberMe: false,
            authToken: '',
        });
        return true;
    }

    /**
     * Returns information about the current authenticated user.
     */
    @Query()
    @Allow(Permission.Authenticated)
    async me(@Ctx() ctx: RequestContext) {
        const sessionUser = (ctx.session as AuthenticatedSession).user;
        const user = sessionUser && (await this.authService.getUserById(sessionUser.id));
        return user ? this.publiclyAccessibleUser(user) : null;
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
