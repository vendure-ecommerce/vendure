import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { Connection } from 'typeorm';
import { User } from '../entity/user/user.entity';
import { ConfigService } from '../service/config.service';
import { JwtPayload } from './auth-types';
import { PasswordService } from './password.service';
import { Role } from './role';

@Injectable()
export class AuthService {
    constructor(
        private passwordService: PasswordService,
        @InjectConnection() private connection: Connection,
        private configService: ConfigService,
    ) {}

    async createToken(identifier: string, password: string): Promise<{ user: User; token: string }> {
        const user = await this.connection.getRepository(User).findOne({
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
        const token = jwt.sign(payload, this.configService.jwtSecret, { expiresIn: 3600 });

        return { user, token };
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        return await this.connection.getRepository(User).findOne({
            where: {
                identifier: payload.identifier,
            },
        });
    }
}
