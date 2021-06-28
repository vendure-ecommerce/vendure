import { Injectable } from '@nestjs/common';
import {
    RegisterCustomerAccountResult,
    RegisterCustomerInput,
    UpdateCustomerInput as UpdateCustomerShopInput,
    VerifyCustomerAccountResult,
} from '@vendure/common/lib/generated-shop-types';
import {
    AddNoteToCustomerInput,
    CreateAddressInput,
    CreateCustomerInput,
    CreateCustomerResult,
    DeletionResponse,
    DeletionResult,
    HistoryEntryType,
    UpdateAddressInput,
    UpdateCustomerInput,
    UpdateCustomerNoteInput,
    UpdateCustomerResult,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { ErrorResultUnion, isGraphQlErrorResult } from '../../common/error/error-result';
import { EntityNotFoundError, InternalServerError } from '../../common/error/errors';
import { EmailAddressConflictError as EmailAddressConflictAdminError } from '../../common/error/generated-graphql-admin-errors';
import {
    EmailAddressConflictError,
    IdentifierChangeTokenExpiredError,
    IdentifierChangeTokenInvalidError,
    MissingPasswordError,
    PasswordResetTokenExpiredError,
    PasswordResetTokenInvalidError,
} from '../../common/error/generated-graphql-shop-errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound, idsAreEqual, normalizeEmailAddress } from '../../common/utils';
import { NATIVE_AUTH_STRATEGY_NAME } from '../../config/auth/native-authentication-strategy';
import { ConfigService } from '../../config/config.service';
import { Address } from '../../entity/address/address.entity';
import { NativeAuthenticationMethod } from '../../entity/authentication-method/native-authentication-method.entity';
import { Channel } from '../../entity/channel/channel.entity';
import { CustomerGroup } from '../../entity/customer-group/customer-group.entity';
import { Customer } from '../../entity/customer/customer.entity';
import { HistoryEntry } from '../../entity/history-entry/history-entry.entity';
import { User } from '../../entity/user/user.entity';
import { EventBus } from '../../event-bus/event-bus';
import { AccountRegistrationEvent } from '../../event-bus/events/account-registration-event';
import { CustomerAddressEvent } from '../../event-bus/events/customer-address-event';
import { CustomerEvent } from '../../event-bus/events/customer-event';
import { IdentifierChangeEvent } from '../../event-bus/events/identifier-change-event';
import { IdentifierChangeRequestEvent } from '../../event-bus/events/identifier-change-request-event';
import { PasswordResetEvent } from '../../event-bus/events/password-reset-event';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { addressToLine } from '../helpers/utils/address-to-line';
import { patchEntity } from '../helpers/utils/patch-entity';
import { translateDeep } from '../helpers/utils/translate-entity';
import { TransactionalConnection } from '../transaction/transactional-connection';

import { ChannelService } from './channel.service';
import { CountryService } from './country.service';
import { HistoryService } from './history.service';
import { UserService } from './user.service';

@Injectable()
export class CustomerService {
    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private userService: UserService,
        private countryService: CountryService,
        private listQueryBuilder: ListQueryBuilder,
        private eventBus: EventBus,
        private historyService: HistoryService,
        private channelService: ChannelService,
        private customFieldRelationService: CustomFieldRelationService,
    ) {}

    findAll(
        ctx: RequestContext,
        options: ListQueryOptions<Customer> | undefined,
    ): Promise<PaginatedList<Customer>> {
        return this.listQueryBuilder
            .build(Customer, options, {
                relations: ['channels'],
                channelId: ctx.channelId,
                where: { deletedAt: null },
                ctx,
            })
            .getManyAndCount()
            .then(([items, totalItems]) => ({ items, totalItems }));
    }

    findOne(ctx: RequestContext, id: ID): Promise<Customer | undefined> {
        return this.connection.findOneInChannel(ctx, Customer, id, ctx.channelId, {
            where: { deletedAt: null },
        });
    }

    findOneByUserId(ctx: RequestContext, userId: ID, filterOnChannel = true): Promise<Customer | undefined> {
        let query = this.connection
            .getRepository(ctx, Customer)
            .createQueryBuilder('customer')
            .leftJoin('customer.channels', 'channel')
            .leftJoinAndSelect('customer.user', 'user')
            .where('user.id = :userId', { userId })
            .andWhere('customer.deletedAt is null');
        if (filterOnChannel) {
            query = query.andWhere('channel.id = :channelId', { channelId: ctx.channelId });
        }
        return query.getOne();
    }

    findAddressesByCustomerId(ctx: RequestContext, customerId: ID): Promise<Address[]> {
        return this.connection
            .getRepository(ctx, Address)
            .createQueryBuilder('address')
            .leftJoinAndSelect('address.country', 'country')
            .leftJoinAndSelect('country.translations', 'countryTranslation')
            .where('address.customer = :id', { id: customerId })
            .getMany()
            .then(addresses => {
                addresses.forEach(address => {
                    address.country = translateDeep(address.country, ctx.languageCode);
                });
                return addresses;
            });
    }

    async getCustomerGroups(ctx: RequestContext, customerId: ID): Promise<CustomerGroup[]> {
        const customerWithGroups = await this.connection.findOneInChannel(
            ctx,
            Customer,
            customerId,
            ctx?.channelId,
            {
                relations: ['groups'],
                where: {
                    deletedAt: null,
                },
            },
        );
        if (customerWithGroups) {
            return customerWithGroups.groups;
        } else {
            return [];
        }
    }

    async create(
        ctx: RequestContext,
        input: CreateCustomerInput,
        password?: string,
    ): Promise<ErrorResultUnion<CreateCustomerResult, Customer>> {
        input.emailAddress = normalizeEmailAddress(input.emailAddress);
        const customer = new Customer(input);

        const existingCustomerInChannel = await this.connection
            .getRepository(ctx, Customer)
            .createQueryBuilder('customer')
            .leftJoin('customer.channels', 'channel')
            .where('channel.id = :channelId', { channelId: ctx.channelId })
            .andWhere('customer.emailAddress = :emailAddress', { emailAddress: input.emailAddress })
            .andWhere('customer.deletedAt is null')
            .getOne();

        if (existingCustomerInChannel) {
            return new EmailAddressConflictAdminError();
        }

        const existingCustomer = await this.connection.getRepository(ctx, Customer).findOne({
            relations: ['channels'],
            where: {
                emailAddress: input.emailAddress,
                deletedAt: null,
            },
        });
        const existingUser = await this.connection.getRepository(ctx, User).findOne({
            where: {
                identifier: input.emailAddress,
                deletedAt: null,
            },
        });

        if (existingCustomer && existingUser) {
            // Customer already exists, bring to this Channel
            const updatedCustomer = patchEntity(existingCustomer, input);
            updatedCustomer.channels.push(ctx.channel);
            return this.connection.getRepository(Customer).save(updatedCustomer);
        } else if (existingCustomer || existingUser) {
            // Not sure when this situation would occur
            return new EmailAddressConflictAdminError();
        }
        customer.user = await this.userService.createCustomerUser(ctx, input.emailAddress, password);

        if (password && password !== '') {
            const verificationToken = customer.user.getNativeAuthenticationMethod().verificationToken;
            if (verificationToken) {
                const result = await this.userService.verifyUserByToken(ctx, verificationToken);
                if (isGraphQlErrorResult(result)) {
                    // In theory this should never be reached, so we will just
                    // throw the result
                    throw result;
                } else {
                    customer.user = result;
                }
            }
        } else {
            this.eventBus.publish(new AccountRegistrationEvent(ctx, customer.user));
        }
        this.channelService.assignToCurrentChannel(customer, ctx);
        const createdCustomer = await this.connection.getRepository(ctx, Customer).save(customer);
        await this.customFieldRelationService.updateRelations(ctx, Customer, input, createdCustomer);
        await this.historyService.createHistoryEntryForCustomer({
            ctx,
            customerId: createdCustomer.id,
            type: HistoryEntryType.CUSTOMER_REGISTERED,
            data: {
                strategy: NATIVE_AUTH_STRATEGY_NAME,
            },
        });

        if (customer.user?.verified) {
            await this.historyService.createHistoryEntryForCustomer({
                ctx,
                customerId: createdCustomer.id,
                type: HistoryEntryType.CUSTOMER_VERIFIED,
                data: {
                    strategy: NATIVE_AUTH_STRATEGY_NAME,
                },
            });
        }
        this.eventBus.publish(new CustomerEvent(ctx, createdCustomer, 'created'));
        return createdCustomer;
    }

    async update(ctx: RequestContext, input: UpdateCustomerShopInput & { id: ID }): Promise<Customer>;
    async update(
        ctx: RequestContext,
        input: UpdateCustomerInput,
    ): Promise<ErrorResultUnion<UpdateCustomerResult, Customer>>;
    async update(
        ctx: RequestContext,
        input: UpdateCustomerInput | (UpdateCustomerShopInput & { id: ID }),
    ): Promise<ErrorResultUnion<UpdateCustomerResult, Customer>> {
        const hasEmailAddress = (i: any): i is UpdateCustomerInput & { emailAddress: string } =>
            Object.hasOwnProperty.call(i, 'emailAddress');

        if (hasEmailAddress(input)) {
            const existingCustomerInChannel = await this.connection
                .getRepository(ctx, Customer)
                .createQueryBuilder('customer')
                .leftJoin('customer.channels', 'channel')
                .where('channel.id = :channelId', { channelId: ctx.channelId })
                .andWhere('customer.emailAddress = :emailAddress', { emailAddress: input.emailAddress })
                .andWhere('customer.id != :customerId', { customerId: input.id })
                .andWhere('customer.deletedAt is null')
                .getOne();

            if (existingCustomerInChannel) {
                return new EmailAddressConflictAdminError();
            }
        }

        const customer = await this.connection.getEntityOrThrow(ctx, Customer, input.id, {
            channelId: ctx.channelId,
        });
        const updatedCustomer = patchEntity(customer, input);
        await this.connection.getRepository(ctx, Customer).save(updatedCustomer, { reload: false });
        await this.customFieldRelationService.updateRelations(ctx, Customer, input, updatedCustomer);
        await this.historyService.createHistoryEntryForCustomer({
            customerId: customer.id,
            ctx,
            type: HistoryEntryType.CUSTOMER_DETAIL_UPDATED,
            data: {
                input,
            },
        });
        this.eventBus.publish(new CustomerEvent(ctx, customer, 'updated'));
        return assertFound(this.findOne(ctx, customer.id));
    }

    async registerCustomerAccount(
        ctx: RequestContext,
        input: RegisterCustomerInput,
    ): Promise<RegisterCustomerAccountResult | EmailAddressConflictError> {
        if (!this.configService.authOptions.requireVerification) {
            if (!input.password) {
                return new MissingPasswordError();
            }
        }
        let user = await this.userService.getUserByEmailAddress(ctx, input.emailAddress);
        const hasNativeAuthMethod = !!user?.authenticationMethods.find(
            m => m instanceof NativeAuthenticationMethod,
        );
        if (user && user.verified) {
            if (hasNativeAuthMethod) {
                // If the user has already been verified and has already
                // registered with the native authentication strategy, do nothing.
                return { success: true };
            }
        }
        const customFields = (input as any).customFields;
        const customer = await this.createOrUpdate(ctx, {
            emailAddress: input.emailAddress,
            title: input.title || '',
            firstName: input.firstName || '',
            lastName: input.lastName || '',
            phoneNumber: input.phoneNumber || '',
            ...(customFields ? { customFields } : {}),
        });
        if (isGraphQlErrorResult(customer)) {
            return customer;
        }
        await this.historyService.createHistoryEntryForCustomer({
            customerId: customer.id,
            ctx,
            type: HistoryEntryType.CUSTOMER_REGISTERED,
            data: {
                strategy: NATIVE_AUTH_STRATEGY_NAME,
            },
        });
        if (!user) {
            user = await this.userService.createCustomerUser(
                ctx,
                input.emailAddress,
                input.password || undefined,
            );
        }
        if (!hasNativeAuthMethod) {
            user = await this.userService.addNativeAuthenticationMethod(
                ctx,
                user,
                input.emailAddress,
                input.password || undefined,
            );
        }
        if (!user.verified) {
            user = await this.userService.setVerificationToken(ctx, user);
        }

        customer.user = user;
        await this.connection.getRepository(ctx, User).save(user, { reload: false });
        await this.connection.getRepository(ctx, Customer).save(customer, { reload: false });
        if (!user.verified) {
            this.eventBus.publish(new AccountRegistrationEvent(ctx, user));
        } else {
            await this.historyService.createHistoryEntryForCustomer({
                customerId: customer.id,
                ctx,
                type: HistoryEntryType.CUSTOMER_VERIFIED,
                data: {
                    strategy: NATIVE_AUTH_STRATEGY_NAME,
                },
            });
        }
        return { success: true };
    }

    async refreshVerificationToken(ctx: RequestContext, emailAddress: string): Promise<void> {
        const user = await this.userService.getUserByEmailAddress(ctx, emailAddress);
        if (user) {
            await this.userService.setVerificationToken(ctx, user);
            if (!user.verified) {
                this.eventBus.publish(new AccountRegistrationEvent(ctx, user));
            }
        }
    }

    async verifyCustomerEmailAddress(
        ctx: RequestContext,
        verificationToken: string,
        password?: string,
    ): Promise<ErrorResultUnion<VerifyCustomerAccountResult, Customer>> {
        const result = await this.userService.verifyUserByToken(ctx, verificationToken, password);
        if (isGraphQlErrorResult(result)) {
            return result;
        }
        const customer = await this.findOneByUserId(ctx, result.id, false);
        if (!customer) {
            throw new InternalServerError('error.cannot-locate-customer-for-user');
        }
        if (ctx.channelId) {
            await this.channelService.assignToChannels(ctx, Customer, customer.id, [ctx.channelId]);
        }
        await this.historyService.createHistoryEntryForCustomer({
            customerId: customer.id,
            ctx,
            type: HistoryEntryType.CUSTOMER_VERIFIED,
            data: {
                strategy: NATIVE_AUTH_STRATEGY_NAME,
            },
        });
        return assertFound(this.findOneByUserId(ctx, result.id));
    }

    async requestPasswordReset(ctx: RequestContext, emailAddress: string): Promise<void> {
        const user = await this.userService.setPasswordResetToken(ctx, emailAddress);
        if (user) {
            this.eventBus.publish(new PasswordResetEvent(ctx, user));
            const customer = await this.findOneByUserId(ctx, user.id);
            if (!customer) {
                throw new InternalServerError('error.cannot-locate-customer-for-user');
            }
            await this.historyService.createHistoryEntryForCustomer({
                customerId: customer.id,
                ctx,
                type: HistoryEntryType.CUSTOMER_PASSWORD_RESET_REQUESTED,
                data: {},
            });
        }
    }

    async resetPassword(
        ctx: RequestContext,
        passwordResetToken: string,
        password: string,
    ): Promise<User | PasswordResetTokenExpiredError | PasswordResetTokenInvalidError> {
        const result = await this.userService.resetPasswordByToken(ctx, passwordResetToken, password);
        if (isGraphQlErrorResult(result)) {
            return result;
        }
        const customer = await this.findOneByUserId(ctx, result.id);
        if (!customer) {
            throw new InternalServerError('error.cannot-locate-customer-for-user');
        }
        await this.historyService.createHistoryEntryForCustomer({
            customerId: customer.id,
            ctx,
            type: HistoryEntryType.CUSTOMER_PASSWORD_RESET_VERIFIED,
            data: {},
        });
        return result;
    }

    async requestUpdateEmailAddress(
        ctx: RequestContext,
        userId: ID,
        newEmailAddress: string,
    ): Promise<boolean | EmailAddressConflictError> {
        const userWithConflictingIdentifier = await this.userService.getUserByEmailAddress(
            ctx,
            newEmailAddress,
        );
        if (userWithConflictingIdentifier) {
            return new EmailAddressConflictError();
        }
        const user = await this.userService.getUserById(ctx, userId);
        if (!user) {
            return false;
        }
        const customer = await this.findOneByUserId(ctx, user.id);
        if (!customer) {
            return false;
        }
        const oldEmailAddress = customer.emailAddress;
        await this.historyService.createHistoryEntryForCustomer({
            customerId: customer.id,
            ctx,
            type: HistoryEntryType.CUSTOMER_EMAIL_UPDATE_REQUESTED,
            data: {
                oldEmailAddress,
                newEmailAddress,
            },
        });
        if (this.configService.authOptions.requireVerification) {
            user.getNativeAuthenticationMethod().pendingIdentifier = newEmailAddress;
            await this.userService.setIdentifierChangeToken(ctx, user);
            this.eventBus.publish(new IdentifierChangeRequestEvent(ctx, user));
            return true;
        } else {
            const oldIdentifier = user.identifier;
            user.identifier = newEmailAddress;
            customer.emailAddress = newEmailAddress;
            await this.connection.getRepository(ctx, User).save(user, { reload: false });
            await this.connection.getRepository(ctx, Customer).save(customer, { reload: false });
            this.eventBus.publish(new IdentifierChangeEvent(ctx, user, oldIdentifier));
            await this.historyService.createHistoryEntryForCustomer({
                customerId: customer.id,
                ctx,
                type: HistoryEntryType.CUSTOMER_EMAIL_UPDATE_VERIFIED,
                data: {
                    oldEmailAddress,
                    newEmailAddress,
                },
            });
            return true;
        }
    }

    async updateEmailAddress(
        ctx: RequestContext,
        token: string,
    ): Promise<boolean | IdentifierChangeTokenInvalidError | IdentifierChangeTokenExpiredError> {
        const result = await this.userService.changeIdentifierByToken(ctx, token);
        if (isGraphQlErrorResult(result)) {
            return result;
        }
        const { user, oldIdentifier } = result;
        if (!user) {
            return false;
        }
        const customer = await this.findOneByUserId(ctx, user.id);
        if (!customer) {
            return false;
        }
        this.eventBus.publish(new IdentifierChangeEvent(ctx, user, oldIdentifier));
        customer.emailAddress = user.identifier;
        await this.connection.getRepository(ctx, Customer).save(customer, { reload: false });
        await this.historyService.createHistoryEntryForCustomer({
            customerId: customer.id,
            ctx,
            type: HistoryEntryType.CUSTOMER_EMAIL_UPDATE_VERIFIED,
            data: {
                oldEmailAddress: oldIdentifier,
                newEmailAddress: customer.emailAddress,
            },
        });
        return true;
    }

    /**
     * For guest checkouts, we assume that a matching email address is the same customer.
     */
    async createOrUpdate(
        ctx: RequestContext,
        input: Partial<CreateCustomerInput> & { emailAddress: string },
        errorOnExistingUser: boolean = false,
    ): Promise<Customer | EmailAddressConflictError> {
        input.emailAddress = normalizeEmailAddress(input.emailAddress);
        let customer: Customer;
        const existing = await this.connection.getRepository(ctx, Customer).findOne({
            relations: ['channels'],
            where: {
                emailAddress: input.emailAddress,
                deletedAt: null,
            },
        });
        if (existing) {
            if (existing.user && errorOnExistingUser) {
                // It is not permitted to modify an existing *registered* Customer
                return new EmailAddressConflictError();
            }
            customer = patchEntity(existing, input);
            customer.channels.push(await this.connection.getEntityOrThrow(ctx, Channel, ctx.channelId));
        } else {
            customer = new Customer(input);
            this.channelService.assignToCurrentChannel(customer, ctx);
            this.eventBus.publish(new CustomerEvent(ctx, customer, 'created'));
        }
        return this.connection.getRepository(ctx, Customer).save(customer);
    }

    async createAddress(ctx: RequestContext, customerId: ID, input: CreateAddressInput): Promise<Address> {
        const customer = await this.connection.getEntityOrThrow(ctx, Customer, customerId, {
            where: { deletedAt: null },
            relations: ['addresses'],
            channelId: ctx.channelId,
        });

        const country = await this.countryService.findOneByCode(ctx, input.countryCode);
        const address = new Address({
            ...input,
            country,
        });
        const createdAddress = await this.connection.getRepository(ctx, Address).save(address);
        await this.customFieldRelationService.updateRelations(ctx, Address, input, createdAddress);
        customer.addresses.push(createdAddress);
        await this.connection.getRepository(ctx, Customer).save(customer, { reload: false });
        await this.enforceSingleDefaultAddress(ctx, createdAddress.id, input);
        await this.historyService.createHistoryEntryForCustomer({
            customerId: customer.id,
            ctx,
            type: HistoryEntryType.CUSTOMER_ADDRESS_CREATED,
            data: { address: addressToLine(createdAddress) },
        });
        this.eventBus.publish(new CustomerAddressEvent(ctx, createdAddress, 'created'));
        return createdAddress;
    }

    async updateAddress(ctx: RequestContext, input: UpdateAddressInput): Promise<Address> {
        const address = await this.connection.getEntityOrThrow(ctx, Address, input.id, {
            relations: ['customer', 'country'],
        });
        const customer = await this.connection.findOneInChannel(
            ctx,
            Customer,
            address.customer.id,
            ctx.channelId,
        );
        if (!customer) {
            throw new EntityNotFoundError('Address', input.id);
        }
        if (input.countryCode && input.countryCode !== address.country.code) {
            address.country = await this.countryService.findOneByCode(ctx, input.countryCode);
        } else {
            address.country = translateDeep(address.country, ctx.languageCode);
        }
        let updatedAddress = patchEntity(address, input);
        updatedAddress = await this.connection.getRepository(ctx, Address).save(updatedAddress);
        await this.customFieldRelationService.updateRelations(ctx, Address, input, updatedAddress);
        await this.enforceSingleDefaultAddress(ctx, input.id, input);

        await this.historyService.createHistoryEntryForCustomer({
            customerId: address.customer.id,
            ctx,
            type: HistoryEntryType.CUSTOMER_ADDRESS_UPDATED,
            data: {
                address: addressToLine(updatedAddress),
                input,
            },
        });
        this.eventBus.publish(new CustomerAddressEvent(ctx, updatedAddress, 'updated'));
        return updatedAddress;
    }

    async deleteAddress(ctx: RequestContext, id: ID): Promise<boolean> {
        const address = await this.connection.getEntityOrThrow(ctx, Address, id, {
            relations: ['customer', 'country'],
        });
        const customer = await this.connection.findOneInChannel(
            ctx,
            Customer,
            address.customer.id,
            ctx.channelId,
        );
        if (!customer) {
            throw new EntityNotFoundError('Address', id);
        }
        address.country = translateDeep(address.country, ctx.languageCode);
        await this.reassignDefaultsForDeletedAddress(ctx, address);
        await this.historyService.createHistoryEntryForCustomer({
            customerId: address.customer.id,
            ctx,
            type: HistoryEntryType.CUSTOMER_ADDRESS_DELETED,
            data: {
                address: addressToLine(address),
            },
        });
        await this.connection.getRepository(ctx, Address).remove(address);
        this.eventBus.publish(new CustomerAddressEvent(ctx, address, 'deleted'));
        return true;
    }

    async softDelete(ctx: RequestContext, customerId: ID): Promise<DeletionResponse> {
        const customer = await this.connection.getEntityOrThrow(ctx, Customer, customerId, {
            channelId: ctx.channelId,
        });
        await this.connection
            .getRepository(ctx, Customer)
            .update({ id: customerId }, { deletedAt: new Date() });
        // tslint:disable-next-line:no-non-null-assertion
        await this.userService.softDelete(ctx, customer.user!.id);
        this.eventBus.publish(new CustomerEvent(ctx, customer, 'deleted'));
        return {
            result: DeletionResult.DELETED,
        };
    }

    async addNoteToCustomer(ctx: RequestContext, input: AddNoteToCustomerInput): Promise<Customer> {
        const customer = await this.connection.getEntityOrThrow(ctx, Customer, input.id, {
            channelId: ctx.channelId,
        });
        await this.historyService.createHistoryEntryForCustomer(
            {
                ctx,
                customerId: customer.id,
                type: HistoryEntryType.CUSTOMER_NOTE,
                data: {
                    note: input.note,
                },
            },
            input.isPublic,
        );
        return customer;
    }

    async updateCustomerNote(ctx: RequestContext, input: UpdateCustomerNoteInput): Promise<HistoryEntry> {
        return this.historyService.updateCustomerHistoryEntry(ctx, {
            type: HistoryEntryType.CUSTOMER_NOTE,
            data: input.note ? { note: input.note } : undefined,
            ctx,
            entryId: input.noteId,
        });
    }

    async deleteCustomerNote(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        try {
            await this.historyService.deleteCustomerHistoryEntry(ctx, id);
            return {
                result: DeletionResult.DELETED,
            };
        } catch (e) {
            return {
                result: DeletionResult.NOT_DELETED,
                message: e.message,
            };
        }
    }

    private async enforceSingleDefaultAddress(
        ctx: RequestContext,
        addressId: ID,
        input: CreateAddressInput | UpdateAddressInput,
    ) {
        const result = await this.connection
            .getRepository(ctx, Address)
            .findOne(addressId, { relations: ['customer', 'customer.addresses'] });
        if (result) {
            const customerAddressIds = result.customer.addresses
                .map(a => a.id)
                .filter(id => !idsAreEqual(id, addressId)) as string[];

            if (customerAddressIds.length) {
                if (input.defaultBillingAddress === true) {
                    await this.connection.getRepository(ctx, Address).update(customerAddressIds, {
                        defaultBillingAddress: false,
                    });
                }
                if (input.defaultShippingAddress === true) {
                    await this.connection.getRepository(ctx, Address).update(customerAddressIds, {
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
    private async reassignDefaultsForDeletedAddress(ctx: RequestContext, addressToDelete: Address) {
        if (!addressToDelete.defaultBillingAddress && !addressToDelete.defaultShippingAddress) {
            return;
        }
        const result = await this.connection
            .getRepository(ctx, Address)
            .findOne(addressToDelete.id, { relations: ['customer', 'customer.addresses'] });
        if (result) {
            const customerAddresses = result.customer.addresses;
            if (1 < customerAddresses.length) {
                const otherAddresses = customerAddresses
                    .filter(address => !idsAreEqual(address.id, addressToDelete.id))
                    .sort((a, b) => (a.id < b.id ? -1 : 1));
                if (addressToDelete.defaultShippingAddress) {
                    otherAddresses[0].defaultShippingAddress = true;
                }
                if (addressToDelete.defaultBillingAddress) {
                    otherAddresses[0].defaultBillingAddress = true;
                }
                await this.connection.getRepository(ctx, Address).save(otherAddresses[0], { reload: false });
            }
        }
    }
}
