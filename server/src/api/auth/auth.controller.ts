import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { Role } from '../../auth/role';
import { RolesGuard } from '../../auth/roles-guard';
import { User } from '../../entity/user/user.entity';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    /**
     * Attempts a login given the username and password of a user. If successful, returns
     * the user data and a token to be used by Bearer auth.
     */
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const { user, token } = await this.authService.createToken(loginDto.username, loginDto.password);

        if (token) {
            return {
                token,
                user: this.publiclyAccessibleUser(user),
            };
        }
    }

    /**
     * Returns information about the current authenticated user.
     */
    @RolesGuard([Role.Authenticated])
    @Get('me')
    async me(@Req() request) {
        const user = request.user as User;
        return this.publiclyAccessibleUser(user);
    }

    /**
     * Exposes a subset of the User properties which we want to expose to the public API.
     */
    private publiclyAccessibleUser(user: User): Pick<User, 'id' | 'identifier' | 'roles'> {
        return {
            id: user.id,
            identifier: user.identifier,
            roles: user.roles,
        };
    }
}
