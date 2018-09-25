import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import * as ms from 'ms';
import { AttemptLoginVariables, Permission } from 'shared/generated-types';

import { User } from '../../entity/user/user.entity';
import { AuthService } from '../../service/providers/auth.service';
import { ChannelService } from '../../service/providers/channel.service';
import { Allow } from '../common/roles-guard';

@Resolver('Auth')
export class AuthResolver {
    constructor(private authService: AuthService, private channelService: ChannelService) {}

    /**
     * Attempts a login given the username and password of a user. If successful, returns
     * the user data and sets the session.
     */
    @Mutation()
    async login(@Args() args: AttemptLoginVariables, @Context('req') request: Request) {
        const session = await this.authService.authenticate(args.username, args.password);

        if (session) {
            if (request.session) {
                if (args.rememberMe) {
                    request.sessionOptions.maxAge = ms('1y');
                }
                request.session.token = session.token;
            }
            return {
                user: this.publiclyAccessibleUser(session.user),
            };
        }
    }

    @Mutation()
    @Allow(Permission.Authenticated)
    async logout(@Context('req') request: Request & { user: User }) {
        await this.authService.invalidateUserSessions(request.user);
        if (request.session) {
            request.session = undefined;
        }
        return true;
    }

    /**
     * Returns information about the current authenticated user.
     */
    @Query()
    @Allow(Permission.Authenticated)
    async me(@Context('req') request: Request & { user: User }) {
        const user = await this.authService.getUserById(request.user.id);
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
