import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { Permission } from 'shared/generated-types';
import { Connection } from 'typeorm';

import { JwtPayload } from '../common/types/auth-types';
import { ConfigService } from '../config/config.service';
import { User } from '../entity/user/user.entity';

import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
    constructor(
        private passwordService: PasswordService,
        @InjectConnection() private connection: Connection,
        private configService: ConfigService,
    ) {}

    async createToken(identifier: string, password: string): Promise<{ user: User; token: string }> {
        const user = await this.connection.getRepository(User).findOne({
            where: { identifier },
            relations: ['roles', 'roles.channels'],
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        const passwordMatches = await this.passwordService.check(password, user.passwordHash);

        if (!passwordMatches) {
            throw new UnauthorizedException();
        }
        const payload: JwtPayload = {
            identifier,
            roles: user.roles.reduce((roles, r) => [...roles, ...r.permissions], [] as Permission[]),
        };
        const token = jwt.sign(payload, this.configService.jwtSecret, { expiresIn: 3600 });

        return { user, token };
    }

    async validateUser(identifier: string): Promise<User | undefined> {
        return await this.connection.getRepository(User).findOne({
            where: { identifier },
            relations: ['roles', 'roles.channels'],
        });
    }
}
