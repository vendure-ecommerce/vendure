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
            relations: ['roles', 'roles.channels'],
        });
    }

    async getUserByEmailAddress(emailAddress: string): Promise<User | undefined> {
        return this.connection.getRepository(User).findOne({
            where: {
                identifier: emailAddress,
            },
            relations: ['roles', 'roles.channels'],
        });
    }

    async createCustomerUser(identifier: string, password?: string): Promise<User> {
        const user = new User();
        if (this.configService.authOptions.requireVerification) {
            user.verificationToken = this.verificationTokenGenerator.generateVerificationToken();
            user.verified = false;
        } else {
            user.verified = true;
        }
        if (password) {
            user.passwordHash = await this.passwordCipher.hash(password);
        } else {
            user.passwordHash = '';
        }
        user.identifier = identifier;
        const customerRole = await this.roleService.getCustomerRole();
        user.roles = [customerRole];
        return this.connection.manager.save(user);
    }

    async createAdminUser(identifier: string, password: string): Promise<User> {
        const user = new User({
            passwordHash: await this.passwordCipher.hash(password),
            identifier,
            verified: true,
        });
        return this.connection.manager.save(user);
    }

    async softDelete(userId: ID) {
        await getEntityOrThrow(this.connection, User, userId);
        await this.connection.getRepository(User).update({ id: userId }, { deletedAt: new Date() });
    }

    async setVerificationToken(user: User): Promise<User> {
        user.verificationToken = this.verificationTokenGenerator.generateVerificationToken();
        user.verified = false;
        return this.connection.manager.save(user);
    }

    async verifyUserByToken(verificationToken: string, password: string): Promise<User | undefined> {
        const user = await this.connection.getRepository(User).findOne({
            where: { verificationToken },
        });
        if (user) {
            if (this.verificationTokenGenerator.verifyVerificationToken(verificationToken)) {
                user.passwordHash = await this.passwordCipher.hash(password);
                user.verificationToken = null;
                user.verified = true;
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
        user.passwordResetToken = await this.verificationTokenGenerator.generateVerificationToken();
        return this.connection.getRepository(User).save(user);
    }

    async resetPasswordByToken(passwordResetToken: string, password: string): Promise<User | undefined> {
        const user = await this.connection.getRepository(User).findOne({
            where: { passwordResetToken },
        });
        if (user) {
            if (this.verificationTokenGenerator.verifyVerificationToken(passwordResetToken)) {
                user.passwordHash = await this.passwordCipher.hash(password);
                user.passwordResetToken = null;
                return this.connection.getRepository(User).save(user);
            } else {
                throw new PasswordResetTokenExpiredError();
            }
        }
    }

    async changeIdentifierByToken(token: string): Promise<{ user: User; oldIdentifier: string }> {
        const user = await this.connection.getRepository(User).findOne({
            where: { identifierChangeToken: token },
        });
        if (!user) {
            throw new IdentifierChangeTokenError();
        }
        if (!this.verificationTokenGenerator.verifyVerificationToken(token)) {
            throw new IdentifierChangeTokenExpiredError();
        }
        const pendingIdentifier = user.pendingIdentifier;
        if (!pendingIdentifier) {
            throw new InternalServerError('error.pending-identifier-missing');
        }
        const oldIdentifier = user.identifier;
        user.identifier = pendingIdentifier;
        user.identifierChangeToken = null;
        user.pendingIdentifier = null;
        await this.connection.getRepository(User).save(user, { reload: false });
        return { user, oldIdentifier };
    }

    async updatePassword(userId: ID, currentPassword: string, newPassword: string): Promise<boolean> {
        const user = await this.connection
            .getRepository(User)
            .findOne(userId, { select: ['id', 'passwordHash'] });
        if (!user) {
            throw new InternalServerError(`error.no-active-user-id`);
        }
        const matches = await this.passwordCipher.check(currentPassword, user.passwordHash);
        if (!matches) {
            throw new UnauthorizedError();
        }
        user.passwordHash = await this.passwordCipher.hash(newPassword);
        await this.connection.getRepository(User).save(user, { reload: false });
        return true;
    }

    async setIdentifierChangeToken(user: User): Promise<User> {
        user.identifierChangeToken = this.verificationTokenGenerator.generateVerificationToken();
        return this.connection.manager.save(user);
    }
}
