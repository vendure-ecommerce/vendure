import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { Permission } from 'shared/generated-types';
import { Connection } from 'typeorm';

import { JwtPayload } from '../../common/types/auth-types';
import { ConfigService } from '../../config/config.service';
import { User } from '../../entity/user/user.entity';

import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
    constructor(
        private passwordService: PasswordService,
        @InjectConnection() private connection: Connection,
        private configService: ConfigService,
    ) {}

    /**
     * Creates auth & refresh tokens after user login.
     */
    async createTokens(
        identifier: string,
        password: string,
    ): Promise<{ user: User; authToken: string; refreshToken: string }> {
        const user = await this.getUserFromIdentifier(identifier);
        const passwordMatches = await this.passwordService.check(password, user.passwordHash);
        if (!passwordMatches) {
            throw new UnauthorizedException();
        }
        const { authToken, refreshToken } = this.createTokensForUser(user);
        return { user, authToken, refreshToken };
    }

    /**
     * Attempts to refresh the authToken based on the provided refreshToken.
     */
    async refreshTokens(
        token: string,
        refreshToken: string,
    ): Promise<{ user: User; authToken: string; refreshToken: string } | null> {
        const jwtPayload = jwt.decode(token) as JwtPayload | null;

        if (jwtPayload) {
            const user = await this.getUserFromIdentifier(jwtPayload.identifier);

            try {
                jwt.verify(refreshToken, this.getRefreshTokenSecret(user));
            } catch (e) {
                throw new UnauthorizedException();
            }

            const newTokens = this.createTokensForUser(user);
            return {
                user,
                authToken: newTokens.authToken,
                refreshToken: newTokens.refreshToken,
            };
        } else {
            return null;
        }
    }

    async validateUser(identifier: string): Promise<User | undefined> {
        return await this.connection.getRepository(User).findOne({
            where: { identifier },
            relations: ['roles', 'roles.channels'],
        });
    }

    private createTokensForUser(user: User): { authToken: string; refreshToken: string } {
        const payload: JwtPayload = {
            identifier: user.identifier,
            roles: user.roles.reduce((roles, r) => [...roles, ...r.permissions], [] as Permission[]),
        };
        const authToken = jwt.sign(payload, this.configService.authOptions.jwtSecret, {
            expiresIn: this.configService.authOptions.expiresIn,
            algorithm: 'HS256',
        });

        // The refreshToken is signed with a combination of the JWT secret and the user's password hash.
        // This means that changing the password will invalidate any active refresh tokens automatically.
        const refreshToken = jwt.sign({ identifier: user.identifier }, this.getRefreshTokenSecret(user), {
            expiresIn: this.configService.authOptions.refreshEvery,
            algorithm: 'HS256',
        });

        return { authToken, refreshToken };
    }

    private async getUserFromIdentifier(identifier: string): Promise<User> {
        const user = await this.connection.getRepository(User).findOne({
            where: { identifier },
            relations: ['roles', 'roles.channels'],
        });
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }

    private getRefreshTokenSecret(user: User): string {
        return this.configService.authOptions.jwtSecret + '_' + user.passwordHash;
    }
}
