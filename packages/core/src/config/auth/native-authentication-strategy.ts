import { ExecutionContext } from '@nestjs/common';
import { ID } from '@vendure/common/lib/shared-types';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { UnauthorizedError } from '../../common/error/errors';
import { Injector } from '../../common/injector';
import { AuthenticationMethod } from '../../entity/authentication-method/authentication-method.entity';
import { NativeAuthenticationMethod } from '../../entity/authentication-method/native-authentication-method.entity';
import { User } from '../../entity/user/user.entity';
import { PasswordCiper } from '../../service/helpers/password-cipher/password-ciper';

import { AuthenticationStrategy } from './authentication-strategy';

export interface NativeAuthenticationData {
    username: string;
    password: string;
}

export const NATIVE_AUTH_STRATEGY_NAME = 'native';

export class NativeAuthenticationStrategy implements AuthenticationStrategy<NativeAuthenticationData> {
    readonly name = NATIVE_AUTH_STRATEGY_NAME;

    private connection: Connection;
    private passwordCipher: PasswordCiper;

    init(injector: Injector) {
        this.connection = injector.getConnection();
        this.passwordCipher = injector.get(PasswordCiper);
    }

    async authenticate(ctx: RequestContext, data: NativeAuthenticationData): Promise<User | false> {
        const user = await this.getUserFromIdentifier(data.username);
        const passwordMatch = await this.verifyUserPassword(user.id, data.password);
        if (!passwordMatch) {
            return false;
        }
        return user;
    }

    deauthenticate(user: User): Promise<void> {
        return Promise.resolve(undefined);
    }

    private async getUserFromIdentifier(identifier: string): Promise<User> {
        const user = await this.connection.getRepository(User).findOne({
            where: { identifier },
            relations: ['roles', 'roles.channels'],
        });
        if (!user) {
            throw new UnauthorizedError();
        }
        return user;
    }

    /**
     * Verify the provided password against the one we have for the given user.
     */
    async verifyUserPassword(userId: ID, password: string): Promise<boolean> {
        const user = await this.connection.getRepository(User).findOne(userId, {
            relations: ['authenticationMethods'],
        });
        if (!user) {
            return false;
        }
        const nativeAuthMethod = user.getNativeAuthenticationMethod();
        const pw =
            (
                await this.connection.getRepository(NativeAuthenticationMethod).findOne(nativeAuthMethod.id, {
                    select: ['passwordHash'],
                })
            )?.passwordHash ?? '';
        const passwordMatches = await this.passwordCipher.check(password, pw);
        if (!passwordMatches) {
            return false;
        }
        return true;
    }
}
