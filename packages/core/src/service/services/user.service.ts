import { Injectable } from '@nestjs/common';
import { VerifyCustomerAccountResult } from '@vendure/common/lib/generated-shop-types';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { ErrorResultUnion } from '../../common/error/error-result';
import { EntityNotFoundError, InternalServerError } from '../../common/error/errors';
import {
    IdentifierChangeTokenExpiredError,
    IdentifierChangeTokenInvalidError,
    InvalidCredentialsError,
    MissingPasswordError,
    PasswordAlreadySetError,
    PasswordResetTokenExpiredError,
    PasswordResetTokenInvalidError,
    VerificationTokenExpiredError,
    VerificationTokenInvalidError,
} from '../../common/error/generated-graphql-shop-errors';
import { ConfigService } from '../../config/config.service';
import { NativeAuthenticationMethod } from '../../entity/authentication-method/native-authentication-method.entity';
import { User } from '../../entity/user/user.entity';
import { PasswordCipher } from '../helpers/password-cipher/password-cipher';
import { VerificationTokenGenerator } from '../helpers/verification-token-generator/verification-token-generator';
import { TransactionalConnection } from '../transaction/transactional-connection';

import { RoleService } from './role.service';

@Injectable()
export class UserService {
    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private roleService: RoleService,
        private passwordCipher: PasswordCipher,
        private verificationTokenGenerator: VerificationTokenGenerator,
    ) {}

    async getUserById(ctx: RequestContext, userId: ID): Promise<User | undefined> {
        return this.connection.getRepository(ctx, User).findOne(userId, {
            relations: ['roles', 'roles.channels', 'authenticationMethods'],
        });
    }

    async getUserByEmailAddress(ctx: RequestContext, emailAddress: string): Promise<User | undefined> {
        return this.connection.getRepository(ctx, User).findOne({
            where: {
                identifier: emailAddress,
                deletedAt: null,
            },
            relations: ['roles', 'roles.channels', 'authenticationMethods'],
        });
    }

    async createCustomerUser(ctx: RequestContext, identifier: string, password?: string): Promise<User> {
        const user = new User();
        user.identifier = identifier;
        const customerRole = await this.roleService.getCustomerRole();
        user.roles = [customerRole];
        return this.connection
            .getRepository(ctx, User)
            .save(await this.addNativeAuthenticationMethod(ctx, user, identifier, password));
    }

    async addNativeAuthenticationMethod(
        ctx: RequestContext,
        user: User,
        identifier: string,
        password?: string,
    ): Promise<User> {
        const checkUser = user.id != null && (await this.getUserById(ctx, user.id));
        if (checkUser) {
            if (
                !!checkUser.authenticationMethods.find(
                    (m): m is NativeAuthenticationMethod => m instanceof NativeAuthenticationMethod,
                )
            ) {
                // User already has a NativeAuthenticationMethod registered, so just return.
                return user;
            }
        }
        const authenticationMethod = new NativeAuthenticationMethod();
        if (this.configService.authOptions.requireVerification) {
            authenticationMethod.verificationToken =
                this.verificationTokenGenerator.generateVerificationToken();
            user.verified = false;
        } else {
            user.verified = true;
        }
        if (password) {
            authenticationMethod.passwordHash = await this.passwordCipher.hash(password);
        } else {
            authenticationMethod.passwordHash = '';
        }
        authenticationMethod.identifier = identifier;
        await this.connection.getRepository(ctx, NativeAuthenticationMethod).save(authenticationMethod);
        user.authenticationMethods = [...(user.authenticationMethods ?? []), authenticationMethod];
        return user;
    }

    async createAdminUser(ctx: RequestContext, identifier: string, password: string): Promise<User> {
        const user = new User({
            identifier,
            verified: true,
        });
        const authenticationMethod = await this.connection
            .getRepository(ctx, NativeAuthenticationMethod)
            .save(
                new NativeAuthenticationMethod({
                    identifier,
                    passwordHash: await this.passwordCipher.hash(password),
                }),
            );
        user.authenticationMethods = [authenticationMethod];
        return this.connection.getRepository(ctx, User).save(user);
    }

    async softDelete(ctx: RequestContext, userId: ID) {
        await this.connection.getEntityOrThrow(ctx, User, userId);
        await this.connection.getRepository(ctx, User).update({ id: userId }, { deletedAt: new Date() });
    }

    async setVerificationToken(ctx: RequestContext, user: User): Promise<User> {
        const nativeAuthMethod = user.getNativeAuthenticationMethod();
        nativeAuthMethod.verificationToken = this.verificationTokenGenerator.generateVerificationToken();
        user.verified = false;
        await this.connection.getRepository(ctx, NativeAuthenticationMethod).save(nativeAuthMethod);
        return this.connection.getRepository(ctx, User).save(user);
    }

    async verifyUserByToken(
        ctx: RequestContext,
        verificationToken: string,
        password?: string,
    ): Promise<ErrorResultUnion<VerifyCustomerAccountResult, User>> {
        const user = await this.connection
            .getRepository(ctx, User)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.authenticationMethods', 'authenticationMethod')
            .addSelect('authenticationMethod.passwordHash')
            .where('authenticationMethod.verificationToken = :verificationToken', { verificationToken })
            .getOne();
        if (user) {
            if (this.verificationTokenGenerator.verifyVerificationToken(verificationToken)) {
                const nativeAuthMethod = user.getNativeAuthenticationMethod();
                if (!password) {
                    if (!nativeAuthMethod.passwordHash) {
                        return new MissingPasswordError();
                    }
                } else {
                    if (!!nativeAuthMethod.passwordHash) {
                        return new PasswordAlreadySetError();
                    }
                    nativeAuthMethod.passwordHash = await this.passwordCipher.hash(password);
                }
                nativeAuthMethod.verificationToken = null;
                user.verified = true;
                await this.connection.getRepository(ctx, NativeAuthenticationMethod).save(nativeAuthMethod);
                return this.connection.getRepository(ctx, User).save(user);
            } else {
                return new VerificationTokenExpiredError();
            }
        } else {
            return new VerificationTokenInvalidError();
        }
    }

    async setPasswordResetToken(ctx: RequestContext, emailAddress: string): Promise<User | undefined> {
        const user = await this.getUserByEmailAddress(ctx, emailAddress);
        if (!user) {
            return;
        }
        const nativeAuthMethod = user.getNativeAuthenticationMethod();
        nativeAuthMethod.passwordResetToken =
            await this.verificationTokenGenerator.generateVerificationToken();
        await this.connection.getRepository(ctx, NativeAuthenticationMethod).save(nativeAuthMethod);
        return user;
    }

    async resetPasswordByToken(
        ctx: RequestContext,
        passwordResetToken: string,
        password: string,
    ): Promise<User | PasswordResetTokenExpiredError | PasswordResetTokenInvalidError> {
        const user = await this.connection
            .getRepository(ctx, User)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.authenticationMethods', 'authenticationMethod')
            .where('authenticationMethod.passwordResetToken = :passwordResetToken', { passwordResetToken })
            .getOne();
        if (!user) {
            return new PasswordResetTokenInvalidError();
        }
        if (this.verificationTokenGenerator.verifyVerificationToken(passwordResetToken)) {
            const nativeAuthMethod = user.getNativeAuthenticationMethod();
            nativeAuthMethod.passwordHash = await this.passwordCipher.hash(password);
            nativeAuthMethod.passwordResetToken = null;
            await this.connection.getRepository(ctx, NativeAuthenticationMethod).save(nativeAuthMethod);
            return this.connection.getRepository(ctx, User).save(user);
        } else {
            return new PasswordResetTokenExpiredError();
        }
    }

    /**
     * Changes the User identifier without an email verification step, so this should be only used when
     * an Administrator is setting a new email address.
     */
    async changeNativeIdentifier(ctx: RequestContext, userId: ID, newIdentifier: string) {
        const user = await this.getUserById(ctx, userId);
        if (!user) {
            return;
        }
        const nativeAuthMethod = user.authenticationMethods.find(
            (m): m is NativeAuthenticationMethod => m instanceof NativeAuthenticationMethod,
        );
        if (!nativeAuthMethod) {
            // If the NativeAuthenticationMethod is not configured, then
            // there is nothing to do.
            return;
        }
        user.identifier = newIdentifier;
        nativeAuthMethod.identifier = newIdentifier;
        nativeAuthMethod.identifierChangeToken = null;
        nativeAuthMethod.pendingIdentifier = null;
        await this.connection
            .getRepository(ctx, NativeAuthenticationMethod)
            .save(nativeAuthMethod, { reload: false });
        await this.connection.getRepository(ctx, User).save(user, { reload: false });
    }

    /**
     * Changes the User identifier as part of the storefront flow used by Customers to set a
     * new email address.
     */
    async changeIdentifierByToken(
        ctx: RequestContext,
        token: string,
    ): Promise<
        | { user: User; oldIdentifier: string }
        | IdentifierChangeTokenInvalidError
        | IdentifierChangeTokenExpiredError
    > {
        const user = await this.connection
            .getRepository(ctx, User)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.authenticationMethods', 'authenticationMethod')
            .where('authenticationMethod.identifierChangeToken = :identifierChangeToken', {
                identifierChangeToken: token,
            })
            .getOne();
        if (!user) {
            return new IdentifierChangeTokenInvalidError();
        }
        if (!this.verificationTokenGenerator.verifyVerificationToken(token)) {
            return new IdentifierChangeTokenExpiredError();
        }
        const nativeAuthMethod = user.getNativeAuthenticationMethod();
        const pendingIdentifier = nativeAuthMethod.pendingIdentifier;
        if (!pendingIdentifier) {
            throw new InternalServerError('error.pending-identifier-missing');
        }
        const oldIdentifier = user.identifier;
        user.identifier = pendingIdentifier;
        nativeAuthMethod.identifier = pendingIdentifier;
        nativeAuthMethod.identifierChangeToken = null;
        nativeAuthMethod.pendingIdentifier = null;
        await this.connection
            .getRepository(ctx, NativeAuthenticationMethod)
            .save(nativeAuthMethod, { reload: false });
        await this.connection.getRepository(ctx, User).save(user, { reload: false });
        return { user, oldIdentifier };
    }

    async updatePassword(
        ctx: RequestContext,
        userId: ID,
        currentPassword: string,
        newPassword: string,
    ): Promise<boolean | InvalidCredentialsError> {
        const user = await this.connection
            .getRepository(ctx, User)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.authenticationMethods', 'authenticationMethods')
            .addSelect('authenticationMethods.passwordHash')
            .where('user.id = :id', { id: userId })
            .getOne();
        if (!user) {
            throw new EntityNotFoundError('User', userId);
        }
        const nativeAuthMethod = user.getNativeAuthenticationMethod();
        const matches = await this.passwordCipher.check(currentPassword, nativeAuthMethod.passwordHash);
        if (!matches) {
            return new InvalidCredentialsError('');
        }
        nativeAuthMethod.passwordHash = await this.passwordCipher.hash(newPassword);
        await this.connection
            .getRepository(ctx, NativeAuthenticationMethod)
            .save(nativeAuthMethod, { reload: false });
        return true;
    }

    async setIdentifierChangeToken(ctx: RequestContext, user: User): Promise<User> {
        const nativeAuthMethod = user.getNativeAuthenticationMethod();
        nativeAuthMethod.identifierChangeToken = this.verificationTokenGenerator.generateVerificationToken();
        await this.connection.getRepository(ctx, NativeAuthenticationMethod).save(nativeAuthMethod);
        return user;
    }
}
