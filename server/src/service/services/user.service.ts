import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import * as ms from 'ms';
import { ID } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { generatePublicId } from '../../common/generate-public-id';
import { ConfigService } from '../../config/config.service';
import { User } from '../../entity/user/user.entity';
import { PasswordCiper } from '../helpers/password-cipher/password-ciper';

import { RoleService } from './role.service';

@Injectable()
export class UserService {
    constructor(
        @InjectConnection() private connection: Connection,
        private configService: ConfigService,
        private roleService: RoleService,
        private passwordCipher: PasswordCiper,
    ) {}

    async getUserById(userId: ID): Promise<User | undefined> {
        return this.connection.getRepository(User).findOne(userId, {
            relations: ['roles', 'roles.channels'],
        });
    }

    async createCustomerUser(identifier: string, password: string): Promise<User> {
        const user = new User();
        if (this.configService.authOptions.requireVerification) {
            user.verificationToken = this.generateVerificationToken();
            user.verified = false;
        } else {
            user.verified = true;
        }
        user.passwordHash = await this.passwordCipher.hash(password);
        user.identifier = identifier;
        user.roles = [await this.roleService.getCustomerRole()];
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

    async verifyUserByToken(verificationToken: string, password: string): Promise<User | undefined> {
        const user = await this.connection.getRepository(User).findOne({
            where: { verificationToken },
        });
        if (user && this.passwordCipher.check(password, user.passwordHash)) {
            if (this.verifyVerificationToken(verificationToken)) {
                user.verificationToken = null;
                user.verified = true;
                await this.connection.getRepository(User).save(user);
                return user;
            }
        }
    }

    /**
     * Generates a verification token which encodes the time of generation and concatenates it with a
     * random id.
     */
    private generateVerificationToken() {
        const now = new Date();
        const base64Now = Buffer.from(now.toJSON()).toString('base64');
        const id = generatePublicId();
        return `${base64Now}_${id}`;
    }

    /**
     * Checks the age of the verification token to see if it falls within the token duration
     * as specified in the VendureConfig.
     */
    private verifyVerificationToken(token: string): boolean {
        const duration = ms(this.configService.authOptions.verificationTokenDuration);
        const [generatedOn] = token.split('_');
        const dateString = Buffer.from(generatedOn, 'base64').toString();
        const date = new Date(dateString);
        const elapsed = +new Date() - +date;
        return elapsed < duration;
    }
}
