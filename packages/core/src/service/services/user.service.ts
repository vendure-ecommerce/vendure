import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { ID } from '@vendure/common/lib/shared-types';
import { Connection } from 'typeorm';

import {
    IdentifierChangeTokenError,
    IdentifierChangeTokenExpiredError,
    InternalServerError,
    PasswordResetTokenExpiredError,
    UnauthorizedError,
    VerificationTokenExpiredError,
} from '../../common/error/errors';
import { ConfigService } from '../../config/config.service';
import { NativeAuthenticationMethod } from '../../entity/authentication-method/native-authentication-method.entity';
import { User } from '../../entity/user/user.entity';
import { PasswordCiper } from '../helpers/password-cipher/password-ciper';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { VerificationTokenGenerator } from '../helpers/verification-token-generator/verification-token-generator';

import { RoleService } from './role.service';

@Injectable()
export class UserService {
    constructor(
        @InjectConnection() private connection: Connection,
        private configService: ConfigService,
        private roleService: RoleService,
        private passwordCipher: PasswordCiper,
        private verificationTokenGenerator: VerificationTokenGenerator,
    ) {}

    async getUserById(userId: ID): Promise<User | undefined> {
        return this.connection.getRepository(User).findOne(userId, {
            relations: ['roles', 'roles.channels', 'authenticationMethods'],
        });
    }

    async getUserByEmailAddress(emailAddress: string): Promise<User | undefined> {
        return this.connection.getRepository(User).findOne({
            where: {
                identifier: emailAddress,
                deletedAt: null,
            },
            relations: ['roles', 'roles.channels', 'authenticationMethods'],
        });
    }

    async createCustomerUser(identifier: string, password?: string): Promise<User> {
        const user = new User();
        user.identifier = identifier;
        const customerRole = await this.roleService.getCustomerRole();
        user.roles = [customerRole];
        return this.connection.manager.save(
            await this.addNativeAuthenticationMethod(user, identifier, password),
        );
    }

    async addNativeAuthenticationMethod(user: User, identifier: string, password?: string): Promise<User> {
        const authenticationMethod = new NativeAuthenticationMethod();
        if (this.configService.authOptions.requireVerification) {
            authenticationMethod.verificationToken = this.verificationTokenGenerator.generateVerificationToken();
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
        await this.connection.manager.save(authenticationMethod);
        user.authenticationMethods = [...(user.authenticationMethods ?? []), authenticationMethod];
        return user;
    }

    async createAdminUser(identifier: string, password: string): Promise<User> {
        const user = new User({
            identifier,
            verified: true,
        });
        const authenticationMethod = await this.connection.manager.save(
            new NativeAuthenticationMethod({
                identifier,
                passwordHash: await this.passwordCipher.hash(password),
            }),
        );
        user.authenticationMethods = [authenticationMethod];
        return this.connection.manager.save(user);
    }

    async softDelete(userId: ID) {
        await getEntityOrThrow(this.connection, User, userId);
        await this.connection.getRepository(User).update({ id: userId }, { deletedAt: new Date() });
    }

    async setVerificationToken(user: User): Promise<User> {
        const nativeAuthMethod = user.getNativeAuthenticationMethod();
        nativeAuthMethod.verificationToken = this.verificationTokenGenerator.generateVerificationToken();
        user.verified = false;
        await this.connection.manager.save(nativeAuthMethod);
        return this.connection.manager.save(user);
    }

    async verifyUserByToken(verificationToken: string, password: string): Promise<User | undefined> {
        const user = await this.connection
            .getRepository(User)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.authenticationMethods', 'authenticationMethod')
            .where('authenticationMethod.verificationToken = :verificationToken', { verificationToken })
            .getOne();
        if (user) {
            if (this.verificationTokenGenerator.verifyVerificationToken(verificationToken)) {
                const nativeAuthMethod = user.getNativeAuthenticationMethod();
                nativeAuthMethod.passwordHash = await this.passwordCipher.hash(password);
                nativeAuthMethod.verificationToken = null;
                user.verified = true;
                await this.connection.manager.save(nativeAuthMethod);
                return this.connection.getRepository(User).save(user);
            } else {
                throw new VerificationTokenExpiredError();
            }
        }
    }

    async setPasswordResetToken(emailAddress: string): Promise<User | undefined> {
        const user = await this.getUserByEmailAddress(emailAddress);
        if (!user) {
            return;
        }
        const nativeAuthMethod = user.getNativeAuthenticationMethod();
        nativeAuthMethod.passwordResetToken = await this.verificationTokenGenerator.generateVerificationToken();
        await this.connection.manager.save(nativeAuthMethod);
        return user;
    }

    async resetPasswordByToken(passwordResetToken: string, password: string): Promise<User | undefined> {
        const user = await this.connection
            .getRepository(User)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.authenticationMethods', 'authenticationMethod')
            .where('authenticationMethod.passwordResetToken = :passwordResetToken', { passwordResetToken })
            .getOne();
        if (user) {
            if (this.verificationTokenGenerator.verifyVerificationToken(passwordResetToken)) {
                const nativeAuthMethod = user.getNativeAuthenticationMethod();
                nativeAuthMethod.passwordHash = await this.passwordCipher.hash(password);
                nativeAuthMethod.passwordResetToken = null;
                await this.connection.manager.save(nativeAuthMethod);
                return this.connection.getRepository(User).save(user);
            } else {
                throw new PasswordResetTokenExpiredError();
            }
        }
    }

    async changeIdentifierByToken(token: string): Promise<{ user: User; oldIdentifier: string }> {
        const user = await this.connection
            .getRepository(User)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.authenticationMethods', 'authenticationMethod')
            .where('authenticationMethod.identifierChangeToken = :identifierChangeToken', {
                identifierChangeToken: token,
            })
            .getOne();
        if (!user) {
            throw new IdentifierChangeTokenError();
        }
        if (!this.verificationTokenGenerator.verifyVerificationToken(token)) {
            throw new IdentifierChangeTokenExpiredError();
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
        await this.connection.manager.save(nativeAuthMethod, { reload: false });
        await this.connection.getRepository(User).save(user, { reload: false });
        return { user, oldIdentifier };
    }

    async updatePassword(userId: ID, currentPassword: string, newPassword: string): Promise<boolean> {
        const user = await this.connection
            .getRepository(User)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.authenticationMethods', 'authenticationMethods')
            .addSelect('authenticationMethods.passwordHash')
            .where('user.id = :id', { id: userId })
            .getOne();
        if (!user) {
            throw new InternalServerError(`error.no-active-user-id`);
        }
        const nativeAuthMethod = user.getNativeAuthenticationMethod();
        const matches = await this.passwordCipher.check(currentPassword, nativeAuthMethod.passwordHash);
        if (!matches) {
            throw new UnauthorizedError();
        }
        nativeAuthMethod.passwordHash = await this.passwordCipher.hash(newPassword);
        await this.connection.manager.save(nativeAuthMethod, { reload: false });
        return true;
    }

    async setIdentifierChangeToken(user: User): Promise<User> {
        const nativeAuthMethod = user.getNativeAuthenticationMethod();
        nativeAuthMethod.identifierChangeToken = this.verificationTokenGenerator.generateVerificationToken();
        await this.connection.manager.save(nativeAuthMethod);
        return user;
    }
}
