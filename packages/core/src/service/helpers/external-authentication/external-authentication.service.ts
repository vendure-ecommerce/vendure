import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { HistoryEntryType } from '@vendure/common/lib/generated-types';
import { Connection } from 'typeorm';

import { RequestContext } from '../../../api/common/request-context';
import { Administrator } from '../../../entity/administrator/administrator.entity';
import { ExternalAuthenticationMethod } from '../../../entity/authentication-method/external-authentication-method.entity';
import { Customer } from '../../../entity/customer/customer.entity';
import { Role } from '../../../entity/role/role.entity';
import { User } from '../../../entity/user/user.entity';
import { AdministratorService } from '../../services/administrator.service';
import { ChannelService } from '../../services/channel.service';
import { CustomerService } from '../../services/customer.service';
import { HistoryService } from '../../services/history.service';
import { RoleService } from '../../services/role.service';

/**
 * @description
 * This is a helper service which exposes methods related to looking up and creating Users based on an
 * external {@link AuthenticationStrategy}.
 *
 * @docsCategory auth
 */
@Injectable()
export class ExternalAuthenticationService {
    constructor(
        @InjectConnection() private connection: Connection,
        private roleService: RoleService,
        private historyService: HistoryService,
        private customerService: CustomerService,
        private administratorService: AdministratorService,
        private channelService: ChannelService,
    ) {}

    /**
     * @description
     * Looks up a User based on their identifier from an external authentication
     * provider, ensuring this User is associated with a Customer account.
     */
    async findCustomerUser(
        ctx: RequestContext,
        strategy: string,
        externalIdentifier: string,
    ): Promise<User | undefined> {
        const user = await this.findUser(strategy, externalIdentifier);

        if (user) {
            // Ensure this User is associated with a Customer
            const customer = await this.customerService.findOneByUserId(ctx, user.id);
            if (customer) {
                return user;
            }
        }
    }

    /**
     * @description
     * Looks up a User based on their identifier from an external authentication
     * provider, ensuring this User is associated with an Administrator account.
     */
    async findAdministratorUser(strategy: string, externalIdentifier: string): Promise<User | undefined> {
        const user = await this.findUser(strategy, externalIdentifier);
        if (user) {
            // Ensure this User is associated with an Administrator
            const administrator = await this.administratorService.findOneByUserId(user.id);
            if (administrator) {
                return user;
            }
        }
    }

    /**
     * @description
     * If a customer has been successfully authenticated by an external authentication provider, yet cannot
     * be found using `findCustomerUser`, then we need to create a new User and
     * Customer record in Vendure for that user. This method encapsulates that logic as well as additional
     * housekeeping such as adding a record to the Customer's history.
     */
    async createCustomerAndUser(
        ctx: RequestContext,
        config: {
            strategy: string;
            externalIdentifier: string;
            verified: boolean;
            emailAddress: string;
            firstName?: string;
            lastName?: string;
        },
    ): Promise<User> {
        const customerRole = await this.roleService.getCustomerRole();
        const newUser = new User({
            identifier: config.emailAddress,
            roles: [customerRole],
            verified: config.verified || false,
        });

        const authMethod = await this.connection.manager.save(
            new ExternalAuthenticationMethod({
                externalIdentifier: config.externalIdentifier,
                strategy: config.strategy,
            }),
        );

        newUser.authenticationMethods = [authMethod];
        const savedUser = await this.connection.manager.save(newUser);

        const customer = new Customer({
            emailAddress: config.emailAddress,
            firstName: config.firstName,
            lastName: config.lastName,
            user: savedUser,
        });
        this.channelService.assignToCurrentChannel(customer, ctx);
        await this.connection.manager.save(customer);

        await this.historyService.createHistoryEntryForCustomer({
            customerId: customer.id,
            ctx,
            type: HistoryEntryType.CUSTOMER_REGISTERED,
            data: {
                strategy: config.strategy,
            },
        });

        if (config.verified) {
            await this.historyService.createHistoryEntryForCustomer({
                customerId: customer.id,
                ctx,
                type: HistoryEntryType.CUSTOMER_VERIFIED,
                data: {
                    strategy: config.strategy,
                },
            });
        }

        return savedUser;
    }

    /**
     * @description
     * If an administrator has been successfully authenticated by an external authentication provider, yet cannot
     * be found using `findAdministratorUser`, then we need to create a new User and
     * Administrator record in Vendure for that user.
     */
    async createAdministratorAndUser(
        ctx: RequestContext,
        config: {
            strategy: string;
            externalIdentifier: string;
            identifier: string;
            emailAddress?: string;
            firstName?: string;
            lastName?: string;
            roles: Role[];
        },
    ) {
        const newUser = new User({
            identifier: config.identifier,
            roles: config.roles,
            verified: true,
        });

        const authMethod = await this.connection.manager.save(
            new ExternalAuthenticationMethod({
                externalIdentifier: config.externalIdentifier,
                strategy: config.strategy,
            }),
        );

        newUser.authenticationMethods = [authMethod];
        const savedUser = await this.connection.manager.save(newUser);

        const administrator = await this.connection.manager.save(
            new Administrator({
                emailAddress: config.emailAddress,
                firstName: config.firstName,
                lastName: config.lastName,
                user: savedUser,
            }),
        );

        return newUser;
    }

    private findUser(strategy: string, externalIdentifier: string): Promise<User | undefined> {
        return this.connection
            .getRepository(User)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.authenticationMethods', 'authMethod')
            .where('authMethod.strategy = :strategy', { strategy })
            .andWhere('authMethod.externalIdentifier = :externalIdentifier', { externalIdentifier })
            .andWhere('user.deletedAt IS NULL')
            .getOne();
    }
}
