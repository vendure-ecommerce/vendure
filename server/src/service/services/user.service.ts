import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { ID } from '../../../../shared/shared-types';
import { VerificationTokenExpiredError } from '../../common/error/errors';
import { ConfigService } from '../../config/config.service';
import { User } from '../../entity/user/user.entity';
import { PasswordCiper } from '../helpers/password-cipher/password-ciper';
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
                await this.connection.getRepository(User).save(user);
                return user;
            } else {
                throw new VerificationTokenExpiredError();
            }
        }
    }
}
