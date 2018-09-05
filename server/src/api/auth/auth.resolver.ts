import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Role } from '../../common/types/role';
import { User } from '../../entity/user/user.entity';
import { AuthService } from '../../service/auth.service';
import { ChannelService } from '../../service/channel.service';
import { RolesGuard } from '../roles-guard';

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
    @RolesGuard([Role.Authenticated])
    @Query()
    me(@Context('req') request: any) {
        const user = request.user as User;
        return user ? this.publiclyAccessibleUser(user) : null;
    }

    /**
     * Exposes a subset of the User properties which we want to expose to the public API.
     */
    private publiclyAccessibleUser(
        user: User,
    ): Pick<User, 'id' | 'identifier' | 'roles'> & { channelTokens: string[] } {
        return {
            id: user.id,
            identifier: user.identifier,
            roles: user.roles,
            channelTokens: user.roles.includes(Role.SuperAdmin)
                ? [this.channelService.getDefaultChannel().token]
                : [],
        };
    }
}
