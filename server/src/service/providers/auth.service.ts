import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import * as ms from 'ms';
import { ID } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { ConfigService } from '../../config/config.service';
import { Session } from '../../entity/session/session.entity';
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
     * Authenticates a user's credentials and if okay, creates a new session.
     */
    async authenticate(identifier: string, password: string): Promise<Session> {
        const user = await this.getUserFromIdentifier(identifier);
        const passwordMatches = await this.passwordService.check(password, user.passwordHash);
        if (!passwordMatches) {
            throw new UnauthorizedException();
        }
        const token = await this.generateSessionToken();
        const session = new Session({
            token,
            user,
            expires: new Date(Date.now() + ms(this.configService.authOptions.sessionDuration)),
            invalidated: false,
        });
        await this.invalidateUserSessions(user);
        // save the new session
        const newSession = this.connection.getRepository(Session).save(session);
        return newSession;
    }

    /**
     * Looks for a valid session with the given token and returns one if found.
     */
    async validateSession(token: string): Promise<Session | undefined> {
        const session = await this.connection.getRepository(Session).findOne({
            where: { token, invalidated: false },
            relations: ['user', 'user.roles', 'user.roles.channels'],
        });
        if (session && session.expires > new Date()) {
            return session;
        }
    }

    /**
     * Invalidates all existing sessions for the given user.
     */
    async invalidateUserSessions(user: User): Promise<void> {
        await this.connection.getRepository(Session).update({ user }, { invalidated: true });
    }

    async getUserById(userId: ID): Promise<User | undefined> {
        return this.connection.getRepository(User).findOne(userId, {
            relations: ['roles', 'roles.channels'],
        });
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

    /**
     * Generates a random session token.
     */
    private generateSessionToken(): Promise<string> {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(32, (err, buf) => {
                if (err) {
                    reject(err);
                }
                resolve(buf.toString('hex'));
            });
        });
    }
}
