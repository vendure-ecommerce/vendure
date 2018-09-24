import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { Permission } from 'shared/generated-types';

import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../../../../shared/shared-constants';
import { User } from '../../entity/user/user.entity';
import { AuthService } from '../../service/providers/auth.service';
import { ChannelService } from '../../service/providers/channel.service';
import { Allow } from '../common/roles-guard';

@Resolver('Auth')
export class AuthResolver {
    constructor(private authService: AuthService, private channelService: ChannelService) {}

    /**
     * Attempts a login given the username and password of a user. If successful, returns
     * the user data and a token to be used by Bearer auth.
     */
    @Mutation()
    async login(@Args() args: { username: string; password: string }) {
        const { user, authToken, refreshToken } = await this.authService.createTokens(
            args.username,
            args.password,
        );

        if (authToken) {
            return {
                [AUTH_TOKEN_KEY]: authToken,
                [REFRESH_TOKEN_KEY]: refreshToken,
                user: this.publiclyAccessibleUser(user),
            };
        }
    }

    /**
     * Returns information about the current authenticated user.
     */
    @Query()
    @Allow(Permission.Authenticated)
    async me(@Context('req') request: Request & { user: User }) {
        const user = await this.authService.validateUser(request.user.identifier);
        return user ? this.publiclyAccessibleUser(user) : null;
    }

    /**
     * Exposes a subset of the User properties which we want to expose to the public API.
     */
    private publiclyAccessibleUser(user: User): any {
        return {
            id: user.id,
            identifier: user.identifier,
            roles: user.roles.reduce(
                (roleTypes, role) => [...roleTypes, ...role.permissions],
                [] as Permission[],
            ),
            channelTokens: this.getAvailableChannelTokens(user),
        };
    }

    private getAvailableChannelTokens(user: User): string[] {
        return user.roles.reduce((tokens, role) => role.channels.map(c => c.token), [] as string[]);
    }
}
