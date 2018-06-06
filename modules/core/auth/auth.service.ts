import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { Connection } from 'typeorm';
import { UserEntity } from '../entity/user/user.entity';
import { JwtPayload } from './auth-types';
import { PasswordService } from './password.service';
import { Role } from './role';

// TODO: make this configurable e.g. from environment
export const JWT_SECRET = 'some_secret';

@Injectable()
export class AuthService {
    constructor(private passwordService: PasswordService, @InjectConnection() private connection: Connection) {}

    async createToken(identifier: string, password: string): Promise<{ user: UserEntity; token: string }> {
        const user = await this.connection.getRepository(UserEntity).findOne({
            where: {
                identifier,
            },
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        const passwordMatches = await this.passwordService.check(password, user.passwordHash);

        if (!passwordMatches) {
            throw new UnauthorizedException();
        }
        const payload: JwtPayload = { identifier, roles: user.roles };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 });

        return { user, token };
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        return await this.connection.getRepository(UserEntity).findOne({
            where: {
                identifier: payload.identifier,
            },
        });
    }
}
