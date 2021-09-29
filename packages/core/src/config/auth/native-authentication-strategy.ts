import { ID } from '@vendure/common/lib/shared-types';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

import { RequestContext } from '../../api/common/request-context';
import { UnauthorizedError } from '../../common/error/errors';
import { Injector } from '../../common/injector';
import { NativeAuthenticationMethod } from '../../entity/authentication-method/native-authentication-method.entity';
import { User } from '../../entity/user/user.entity';
import { PasswordCipher } from '../../service/helpers/password-cipher/password-cipher';
import { TransactionalConnection } from '../../service/transaction/transactional-connection';

import { AuthenticationStrategy } from './authentication-strategy';

export interface NativeAuthenticationData {
    username: string;
    password: string;
}

export const NATIVE_AUTH_STRATEGY_NAME = 'native';

/**
 * @description
 * This strategy implements a username/password credential-based authentication, with the credentials
 * being stored in the Vendure database. This is the default method of authentication, and it is advised
 * to keep it configured unless there is a specific reason not to.
 *
 * @docsCategory auth
 */
export class NativeAuthenticationStrategy implements AuthenticationStrategy<NativeAuthenticationData> {
    readonly name = NATIVE_AUTH_STRATEGY_NAME;

    private connection: TransactionalConnection;
    private passwordCipher: PasswordCipher;

    init(injector: Injector) {
        this.connection = injector.get(TransactionalConnection);
        this.passwordCipher = injector.get(PasswordCipher);
    }

    defineInputType(): DocumentNode {
        return gql`
            input NativeAuthInput {
                username: String!
                password: String!
            }
        `;
    }

    async authenticate(ctx: RequestContext, data: NativeAuthenticationData): Promise<User | false> {
        const user = await this.getUserFromIdentifier(ctx, data.username);
        if (!user) {
            return false;
        }
        const passwordMatch = await this.verifyUserPassword(ctx, user.id, data.password);
        if (!passwordMatch) {
            return false;
        }
        return user;
    }

    private getUserFromIdentifier(ctx: RequestContext, identifier: string): Promise<User | undefined> {
        return this.connection.getRepository(ctx, User).findOne({
            where: { identifier, deletedAt: null },
            relations: ['roles', 'roles.channels'],
        });
    }

    /**
     * Verify the provided password against the one we have for the given user.
     */
    async verifyUserPassword(ctx: RequestContext, userId: ID, password: string): Promise<boolean> {
        const user = await this.connection.getRepository(ctx, User).findOne(userId, {
            relations: ['authenticationMethods'],
        });
        if (!user) {
            return false;
        }
        const nativeAuthMethod = user.getNativeAuthenticationMethod();
        const pw =
            (
                await this.connection
                    .getRepository(ctx, NativeAuthenticationMethod)
                    .findOne(nativeAuthMethod.id, {
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
