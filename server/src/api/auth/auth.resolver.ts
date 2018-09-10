import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Permission } from '../../entity/role/permission';
import { User } from '../../entity/user/user.entity';
import { AuthService } from '../../service/auth.service';
import { ChannelService } from '../../service/channel.service';
import { Allow } from '../roles-guard';

@Resolver('Auth')
export class AuthResolver {
    constructor(private authService: AuthService, private channelService: ChannelService) {}

    /**
     * Attempts a login given the username and password of a user. If successful, returns
     * the user data and a token to be used by Bearer auth.
     */
    @Mutation()
    async login(@Args() args: { username: string; password: string }) {
        const { user, token } = await this.authService.createToken(args.username, args.password);

        if (token) {
            return {
                authToken: token,
                user: this.publiclyAccessibleUser(user),
            };
        }
    }

    /**
     * Returns information about the current authenticated user.
     */
    @Query()
    @Allow(Permission.Authenticated)
    async me(@Context('req') request: any) {
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
