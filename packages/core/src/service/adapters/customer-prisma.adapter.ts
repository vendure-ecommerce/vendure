import { Injectable } from '@nestjs/common';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { PrismaService } from '../../connection/prisma.service';
import { Address } from '../../entity/address/address.entity';
import { Channel } from '../../entity/channel/channel.entity';
import { CustomerGroup } from '../../entity/customer-group/customer-group.entity';
import { Customer } from '../../entity/customer/customer.entity';

import {
    CreateCustomerData,
    CustomerListOptions,
    ICustomerOrmAdapter,
    UpdateCustomerData,
} from './customer-orm.adapter';

/**
 * @description
 * Prisma implementation of the Customer ORM adapter.
 * Translates Customer operations to Prisma Client calls and maps results
 * to TypeORM entity instances for backward compatibility.
 *
 * @since 3.6.0
 */
@Injectable()
export class CustomerPrismaAdapter implements ICustomerOrmAdapter {
    constructor(private prisma: PrismaService) {}

    async findOne(id: ID, includeRelations: string[] = []): Promise<Customer | undefined> {
        const customer = await this.prisma.customer.findUnique({
            where: { id: String(id) },
            include: {
                addresses: includeRelations.includes('addresses'),
                user: includeRelations.includes('user'),
                groups: includeRelations.includes('groups') ? { include: { group: true } } : false,
                channels: includeRelations.includes('channels') ? { include: { channel: true } } : false,
            },
        });

        return customer ? this.mapToEntity(customer) : undefined;
    }

    async findByEmail(emailAddress: string): Promise<Customer | undefined> {
        const customer = await this.prisma.customer.findFirst({
            where: { emailAddress },
            include: {
                addresses: true,
                user: true,
            },
        });

        return customer ? this.mapToEntity(customer) : undefined;
    }

    async findByUserId(userId: ID): Promise<Customer | undefined> {
        const customer = await this.prisma.customer.findFirst({
            where: {
                userId: String(userId),
                deletedAt: null,
            },
            include: {
                addresses: true,
                user: true,
            },
        });

        return customer ? this.mapToEntity(customer) : undefined;
    }

    async findAll(options: CustomerListOptions): Promise<PaginatedList<Customer>> {
        const { skip = 0, take = 20, filter = {}, sort = {} } = options;

        const [items, totalItems] = await Promise.all([
            this.prisma.customer.findMany({
                skip,
                take,
                where: {
                    ...this.mapFilter(filter),
                    deletedAt: null,
                },
                orderBy: this.mapSort(sort),
                include: {
                    addresses: true,
                    user: true,
                },
            }),
            this.prisma.customer.count({
                where: {
                    ...this.mapFilter(filter),
                    deletedAt: null,
                },
            }),
        ]);

        return {
            items: items.map(item => this.mapToEntity(item)),
            totalItems,
        };
    }

    async create(data: CreateCustomerData): Promise<Customer> {
        const customer = await this.prisma.customer.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                emailAddress: data.emailAddress,
                title: data.title,
                phoneNumber: data.phoneNumber,
                user: data.userId
                    ? {
                          connect: { id: String(data.userId) },
                      }
                    : undefined,
                customFields: data.customFields || undefined,
            },
            include: {
                addresses: true,
                user: true,
            },
        });

        return this.mapToEntity(customer);
    }

    async update(id: ID, data: UpdateCustomerData): Promise<Customer> {
        const customer = await this.prisma.customer.update({
            where: { id: String(id) },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                emailAddress: data.emailAddress,
                title: data.title,
                phoneNumber: data.phoneNumber,
                customFields: data.customFields,
            },
            include: {
                addresses: true,
                user: true,
            },
        });

        return this.mapToEntity(customer);
    }

    async softDelete(id: ID): Promise<void> {
        await this.prisma.customer.update({
            where: { id: String(id) },
            data: { deletedAt: new Date() },
        });
    }

    async restore(id: ID): Promise<Customer> {
        const customer = await this.prisma.customer.update({
            where: { id: String(id) },
            data: { deletedAt: null },
            include: {
                addresses: true,
                user: true,
            },
        });

        return this.mapToEntity(customer);
    }

    async exists(id: ID): Promise<boolean> {
        const count = await this.prisma.customer.count({
            where: {
                id: String(id),
                deletedAt: null,
            },
        });
        return count > 0;
    }

    async count(filter: any = {}): Promise<number> {
        return this.prisma.customer.count({
            where: {
                ...this.mapFilter(filter),
                deletedAt: null,
            },
        });
    }

    async addToGroup(customerId: ID, groupId: ID): Promise<void> {
        await this.prisma.customerGroupMembership.create({
            data: {
                customerId: String(customerId),
                groupId: String(groupId),
            },
        });
    }

    async removeFromGroup(customerId: ID, groupId: ID): Promise<void> {
        await this.prisma.customerGroupMembership.delete({
            where: {
                customerId_groupId: {
                    customerId: String(customerId),
                    groupId: String(groupId),
                },
            },
        });
    }

    async getGroups(customerId: ID): Promise<CustomerGroup[]> {
        const memberships = await this.prisma.customerGroupMembership.findMany({
            where: { customerId: String(customerId) },
            include: { group: true },
        });

        return memberships.map(m => this.mapToGroupEntity(m.group));
    }

    async addToChannel(customerId: ID, channelId: ID): Promise<void> {
        await this.prisma.customerChannel.create({
            data: {
                customerId: String(customerId),
                channelId: String(channelId),
            },
        });
    }

    async removeFromChannel(customerId: ID, channelId: ID): Promise<void> {
        await this.prisma.customerChannel.delete({
            where: {
                customerId_channelId: {
                    customerId: String(customerId),
                    channelId: String(channelId),
                },
            },
        });
    }

    async getChannels(customerId: ID): Promise<Channel[]> {
        const channels = await this.prisma.customerChannel.findMany({
            where: { customerId: String(customerId) },
            include: { channel: true },
        });

        return channels.map(c => this.mapToChannelEntity(c.channel));
    }

    async search(searchTerm: string, options: CustomerListOptions = {}): Promise<PaginatedList<Customer>> {
        const { skip = 0, take = 20 } = options;

        const [items, totalItems] = await Promise.all([
            this.prisma.customer.findMany({
                skip,
                take,
                where: {
                    OR: [
                        { firstName: { contains: searchTerm, mode: 'insensitive' } },
                        { lastName: { contains: searchTerm, mode: 'insensitive' } },
                        { emailAddress: { contains: searchTerm, mode: 'insensitive' } },
                    ],
                    deletedAt: null,
                },
                include: {
                    addresses: true,
                    user: true,
                },
            }),
            this.prisma.customer.count({
                where: {
                    OR: [
                        { firstName: { contains: searchTerm, mode: 'insensitive' } },
                        { lastName: { contains: searchTerm, mode: 'insensitive' } },
                        { emailAddress: { contains: searchTerm, mode: 'insensitive' } },
                    ],
                    deletedAt: null,
                },
            }),
        ]);

        return {
            items: items.map(item => this.mapToEntity(item)),
            totalItems,
        };
    }

    /**
     * Map Prisma customer to TypeORM entity for backward compatibility
     * @private
     */
    private mapToEntity(prismaCustomer: any): Customer {
        // This mapping ensures backward compatibility with existing code
        // that expects TypeORM Customer entities
        const customer = new Customer({
            id: prismaCustomer.id,
            createdAt: prismaCustomer.createdAt,
            updatedAt: prismaCustomer.updatedAt,
            deletedAt: prismaCustomer.deletedAt,
            firstName: prismaCustomer.firstName,
            lastName: prismaCustomer.lastName,
            emailAddress: prismaCustomer.emailAddress,
            title: prismaCustomer.title,
            phoneNumber: prismaCustomer.phoneNumber,
            customFields: prismaCustomer.customFields,
        });

        // Map relations if included
        if (prismaCustomer.user) {
            customer.user = prismaCustomer.user;
        }
        if (prismaCustomer.addresses) {
            customer.addresses = prismaCustomer.addresses.map((addr: any) => new Address(addr));
        }

        return customer;
    }

    /**
     * Map Prisma group to TypeORM entity
     * @private
     */
    private mapToGroupEntity(prismaGroup: any): CustomerGroup {
        return new CustomerGroup({
            id: prismaGroup.id,
            createdAt: prismaGroup.createdAt,
            updatedAt: prismaGroup.updatedAt,
            name: prismaGroup.name,
            customFields: prismaGroup.customFields,
        });
    }

    /**
     * Map Prisma channel to TypeORM entity
     * @private
     */
    private mapToChannelEntity(prismaChannel: any): Channel {
        return new Channel({
            id: prismaChannel.id,
            createdAt: prismaChannel.createdAt,
            updatedAt: prismaChannel.updatedAt,
            code: prismaChannel.code,
            token: prismaChannel.token,
            defaultLanguageCode: prismaChannel.defaultLanguageCode,
            availableLanguageCodes: prismaChannel.availableLanguageCodes,
            defaultCurrencyCode: prismaChannel.defaultCurrencyCode,
            availableCurrencyCodes: prismaChannel.availableCurrencyCodes,
            pricesIncludeTax: prismaChannel.pricesIncludeTax,
            customFields: prismaChannel.customFields,
        });
    }

    /**
     * Map filter object to Prisma where clause
     * @private
     */
    private mapFilter(filter: any): any {
        // Map TypeORM-style filters to Prisma where clauses
        // This is a simplified example - full implementation would handle all filter types
        const prismaFilter: any = {};

        if (filter.firstName) {
            prismaFilter.firstName = { contains: filter.firstName, mode: 'insensitive' };
        }
        if (filter.lastName) {
            prismaFilter.lastName = { contains: filter.lastName, mode: 'insensitive' };
        }
        if (filter.emailAddress) {
            prismaFilter.emailAddress = { contains: filter.emailAddress, mode: 'insensitive' };
        }

        return prismaFilter;
    }

    /**
     * Map sort object to Prisma orderBy clause
     * @private
     */
    private mapSort(sort: any): any {
        // Map TypeORM-style sort to Prisma orderBy
        const prismaOrderBy: any = {};

        if (sort.createdAt) {
            prismaOrderBy.createdAt = sort.createdAt === 'ASC' ? 'asc' : 'desc';
        }
        if (sort.lastName) {
            prismaOrderBy.lastName = sort.lastName === 'ASC' ? 'asc' : 'desc';
        }

        return Object.keys(prismaOrderBy).length > 0 ? prismaOrderBy : { createdAt: 'desc' };
    }
}
