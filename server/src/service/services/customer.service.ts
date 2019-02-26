import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { RegisterCustomerInput } from '../../../../shared/generated-shop-types';
import {
    CreateAddressInput,
    CreateCustomerInput,
    DeletionResponse,
    DeletionResult,
    UpdateAddressInput,
    UpdateCustomerInput,
} from '../../../../shared/generated-types';
import { ID, PaginatedList } from '../../../../shared/shared-types';
import { RequestContext } from '../../api/common/request-context';
import { EntityNotFoundError, InternalServerError, UserInputError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound, idsAreEqual, normalizeEmailAddress } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { Address } from '../../entity/address/address.entity';
import { Customer } from '../../entity/customer/customer.entity';
import { EventBus } from '../../event-bus/event-bus';
import { AccountRegistrationEvent } from '../../event-bus/events/account-registration-event';
import { PasswordResetEvent } from '../../event-bus/events/password-reset-event';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { patchEntity } from '../helpers/utils/patch-entity';
import { translateDeep } from '../helpers/utils/translate-entity';

import { CountryService } from './country.service';
import { UserService } from './user.service';

@Injectable()
export class CustomerService {
    constructor(
        @InjectConnection() private connection: Connection,
        private configService: ConfigService,
        private userService: UserService,
        private countryService: CountryService,
        private listQueryBuilder: ListQueryBuilder,
        private eventBus: EventBus,
    ) {}

    findAll(options: ListQueryOptions<Customer> | undefined): Promise<PaginatedList<Customer>> {
        return this.listQueryBuilder
            .build(Customer, options, { where: { deletedAt: null } })
            .getManyAndCount()
            .then(([items, totalItems]) => ({ items, totalItems }));
    }

    findOne(id: ID): Promise<Customer | undefined> {
        return this.connection.getRepository(Customer).findOne(id, { where: { deletedAt: null } });
    }

    findOneByUserId(userId: ID): Promise<Customer | undefined> {
        return this.connection.getRepository(Customer).findOne({
            where: {
                user: { id: userId },
                deletedAt: null,
            },
        });
    }

    findAddressesByCustomerId(ctx: RequestContext, customerId: ID): Promise<Address[]> {
        return this.connection
            .getRepository(Address)
            .createQueryBuilder('address')
            .leftJoinAndSelect('address.country', 'country')
            .leftJoinAndSelect('country.translations', 'countryTranslation')
            .where('address.customerId = :id', { id: customerId })
            .getMany()
            .then(addresses => {
                addresses.forEach(address => {
                    address.country = translateDeep(address.country, ctx.languageCode);
                });
                return addresses;
            });
    }

    async create(input: CreateCustomerInput, password?: string): Promise<Customer> {
        input.emailAddress = normalizeEmailAddress(input.emailAddress);
        const customer = new Customer(input);

        const existing = await this.connection.getRepository(Customer).findOne({
            where: {
                emailAddress: input.emailAddress,
            },
        });

        if (existing) {
            throw new InternalServerError(`error.email-address-must-be-unique`);
        }

        if (password) {
            customer.user = await this.userService.createCustomerUser(input.emailAddress, password);
        }
        return this.connection.getRepository(Customer).save(customer);
    }

    async registerCustomerAccount(ctx: RequestContext, input: RegisterCustomerInput): Promise<boolean> {
        if (this.configService.authOptions.requireVerification) {
            if (input.password) {
                throw new UserInputError(`error.unexpected-password-on-registration`);
            }
        } else {
            if (!input.password) {
                throw new UserInputError(`error.missing-password-on-registration`);
            }
        }
        let user = await this.userService.getUserByEmailAddress(input.emailAddress);
        if (user && user.verified) {
            // If the user has already been verified, do nothing
            return false;
        }
        const customer = await this.createOrUpdate({
            emailAddress: input.emailAddress,
            title: input.title || '',
            firstName: input.firstName || '',
            lastName: input.lastName || '',
        });
        if (!user) {
            user = await this.userService.createCustomerUser(input.emailAddress, input.password || undefined);
        } else if (!user.verified) {
            user = await this.userService.setVerificationToken(user);
        }
        customer.user = user;
        await this.connection.getRepository(Customer).save(customer);
        if (!user.verified) {
            this.eventBus.publish(new AccountRegistrationEvent(ctx, user));
        }
        return true;
    }

    async refreshVerificationToken(ctx: RequestContext, emailAddress: string): Promise<void> {
        const user = await this.userService.getUserByEmailAddress(emailAddress);
        if (user) {
            await this.userService.setVerificationToken(user);
            if (!user.verified) {
                this.eventBus.publish(new AccountRegistrationEvent(ctx, user));
            }
        }
    }

    async verifyCustomerEmailAddress(
        verificationToken: string,
        password: string,
    ): Promise<Customer | undefined> {
        const user = await this.userService.verifyUserByToken(verificationToken, password);
        if (user) {
            return this.findOneByUserId(user.id);
        }
    }

    async requestPasswordReset(ctx: RequestContext, emailAddress: string): Promise<void> {
        const user = await this.userService.setPasswordResetToken(emailAddress);
        if (user) {
            this.eventBus.publish(new PasswordResetEvent(ctx, user));
        }
    }

    async resetPassword(passwordResetToken: string, password: string): Promise<Customer | undefined> {
        const user = await this.userService.resetPasswordByToken(passwordResetToken, password);
        if (user) {
            return this.findOneByUserId(user.id);
        }
    }

    async update(input: UpdateCustomerInput): Promise<Customer> {
        const customer = await getEntityOrThrow(this.connection, Customer, input.id);
        const updatedCustomer = patchEntity(customer, input);
        await this.connection.getRepository(Customer).save(customer);
        return assertFound(this.findOne(customer.id));
    }

    /**
     * For guest checkouts, we assume that a matching email address is the same customer.
     */
    async createOrUpdate(input: Partial<CreateCustomerInput> & { emailAddress: string }): Promise<Customer> {
        input.emailAddress = normalizeEmailAddress(input.emailAddress);
        let customer: Customer;
        const existing = await this.connection.getRepository(Customer).findOne({
            where: {
                emailAddress: input.emailAddress,
            },
        });
        if (existing) {
            customer = patchEntity(existing, input);
        } else {
            customer = new Customer(input);
        }
        return this.connection.getRepository(Customer).save(customer);
    }

    async createAddress(
        ctx: RequestContext,
        customerId: string,
        input: CreateAddressInput,
    ): Promise<Address> {
        const customer = await this.connection.manager.findOne(Customer, customerId, {
            where: { deletedAt: null },
            relations: ['addresses'],
        });

        if (!customer) {
            throw new EntityNotFoundError('Customer', customerId);
        }
        const country = await this.countryService.findOneByCode(ctx, input.countryCode);
        const address = new Address({
            ...input,
            country,
        });
        const createdAddress = await this.connection.manager.getRepository(Address).save(address);
        customer.addresses.push(createdAddress);
        await this.connection.manager.save(customer);
        await this.enforceSingleDefaultAddress(createdAddress.id, input);
        return createdAddress;
    }

    async updateAddress(ctx: RequestContext, input: UpdateAddressInput): Promise<Address> {
        const address = await getEntityOrThrow(this.connection, Address, input.id, {
            relations: ['country'],
        });
        address.country = translateDeep(address.country, ctx.languageCode);
        const updatedAddress = patchEntity(address, input);
        await this.connection.getRepository(Address).save(updatedAddress);
        await this.enforceSingleDefaultAddress(input.id, input);
        return updatedAddress;
    }

    async deleteAddress(id: ID): Promise<boolean> {
        const address = await getEntityOrThrow(this.connection, Address, id);
        await this.reassignDefaultsForDeletedAddress(address);
        await this.connection.getRepository(Address).remove(address);
        return true;
    }

    async softDelete(customerId: ID): Promise<DeletionResponse> {
        await getEntityOrThrow(this.connection, Customer, customerId);
        await this.connection.getRepository(Customer).update({ id: customerId }, { deletedAt: new Date() });
        return {
            result: DeletionResult.DELETED,
        };
    }

    private async enforceSingleDefaultAddress(addressId: ID, input: CreateAddressInput | UpdateAddressInput) {
        const result = await this.connection
            .getRepository(Address)
            .findOne(addressId, { relations: ['customer', 'customer.addresses'] });
        if (result) {
            const customerAddressIds = result.customer.addresses
                .map(a => a.id)
                .filter(id => !idsAreEqual(id, addressId)) as string[];

            if (customerAddressIds.length) {
                if (input.defaultBillingAddress === true) {
                    await this.connection.getRepository(Address).update(customerAddressIds, {
                        defaultBillingAddress: false,
                    });
                }
                if (input.defaultShippingAddress === true) {
                    await this.connection.getRepository(Address).update(customerAddressIds, {
                        defaultShippingAddress: false,
                    });
                }
            }
        }
    }

    /**
     * If a Customer Address is to be deleted, check if it is assigned as a default for shipping or
     * billing. If so, attempt to transfer default status to one of the other addresses if there are
     * any.
     */
    private async reassignDefaultsForDeletedAddress(addressToDelete: Address) {
        if (!addressToDelete.defaultBillingAddress && !addressToDelete.defaultShippingAddress) {
            return;
        }
        const result = await this.connection
            .getRepository(Address)
            .findOne(addressToDelete.id, { relations: ['customer', 'customer.addresses'] });
        if (result) {
            const customerAddresses = result.customer.addresses;
            if (1 < customerAddresses.length) {
                const otherAddresses = customerAddresses.filter(
                    address => !idsAreEqual(address.id, addressToDelete.id),
                );
                if (addressToDelete.defaultShippingAddress) {
                    otherAddresses[0].defaultShippingAddress = true;
                }
                if (addressToDelete.defaultBillingAddress) {
                    otherAddresses[0].defaultBillingAddress = true;
                }
                await this.connection.getRepository(Address).save(otherAddresses[0]);
            }
        }
    }
}
