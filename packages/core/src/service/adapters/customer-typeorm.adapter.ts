import { Injectable } from '@nestjs/common';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { IsNull } from 'typeorm';

import { TransactionalConnection } from '../../connection/transactional-connection';
import { Address } from '../../entity/address/address.entity';
import { Channel } from '../../entity/channel/channel.entity';
import { CustomerGroup } from '../../entity/customer-group/customer-group.entity';
import { Customer } from '../../entity/customer/customer.entity';
import { RequestContext } from '../../api/common/request-context';

import {
    CreateCustomerData,
    CustomerListOptions,
    ICustomerOrmAdapter,
    UpdateCustomerData,
} from './customer-orm.adapter';

/**
 * @description
 * TypeORM implementation of the Customer ORM adapter.
 * This wraps the existing TypeORM-based Customer operations to match
 * the ICustomerOrmAdapter interface, allowing for A/B testing against Prisma.
 *
 * This is the "legacy" implementation that will be removed after migration.
 *
 * @since 3.6.0
 */
@Injectable()
export class CustomerTypeOrmAdapter implements ICustomerOrmAdapter {
    constructor(private connection: TransactionalConnection) {}

    async findOne(id: ID, includeRelations: string[] = []): Promise<Customer | undefined> {
        const ctx = this.getContext();
        return this.connection
            .findOneInChannel(ctx, Customer, id, ctx.channelId, {
                relations: includeRelations,
                where: { deletedAt: IsNull() },
            })
            .then(result => result ?? undefined);
    }

    async findByEmail(emailAddress: string): Promise<Customer | undefined> {
        const ctx = this.getContext();
        const repo = this.connection.getRepository(ctx, Customer);

        return repo.findOne({
            where: {
                emailAddress,
                deletedAt: IsNull(),
            },
            relations: ['addresses', 'user'],
        });
    }

    async findByUserId(userId: ID): Promise<Customer | undefined> {
        const ctx = this.getContext();
        const repo = this.connection.getRepository(ctx, Customer);

        return repo
            .createQueryBuilder('customer')
            .leftJoin('customer.channels', 'channel')
            .leftJoinAndSelect('customer.user', 'user')
            .leftJoinAndSelect('customer.addresses', 'addresses')
            .where('user.id = :userId', { userId })
            .andWhere('customer.deletedAt is null')
            .andWhere('channel.id = :channelId', { channelId: ctx.channelId })
            .getOne();
    }

    async findAll(options: CustomerListOptions): Promise<PaginatedList<Customer>> {
        const ctx = this.getContext();
        const repo = this.connection.getRepository(ctx, Customer);
        const { skip = 0, take = 20, filter = {}, sort = {} } = options;

        const qb = repo
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.addresses', 'addresses')
            .leftJoinAndSelect('customer.user', 'user')
            .leftJoin('customer.channels', 'channel')
            .where('customer.deletedAt is null')
            .andWhere('channel.id = :channelId', { channelId: ctx.channelId })
            .skip(skip)
            .take(take);

        // Apply filters
        if (filter.firstName) {
            qb.andWhere('customer.firstName LIKE :firstName', {
                firstName: `%${filter.firstName}%`,
            });
        }
        if (filter.lastName) {
            qb.andWhere('customer.lastName LIKE :lastName', { lastName: `%${filter.lastName}%` });
        }
        if (filter.emailAddress) {
            qb.andWhere('customer.emailAddress LIKE :emailAddress', {
                emailAddress: `%${filter.emailAddress}%`,
            });
        }

        // Apply sorting
        const sortField = Object.keys(sort)[0];
        if (sortField) {
            const sortOrder = sort[sortField] === 'ASC' ? 'ASC' : 'DESC';
            qb.orderBy(`customer.${sortField}`, sortOrder);
        } else {
            qb.orderBy('customer.createdAt', 'DESC');
        }

        const [items, totalItems] = await qb.getManyAndCount();

        return { items, totalItems };
    }

    async create(data: CreateCustomerData): Promise<Customer> {
        const ctx = this.getContext();
        const repo = this.connection.getRepository(ctx, Customer);

        const customer = repo.create({
            firstName: data.firstName,
            lastName: data.lastName,
            emailAddress: data.emailAddress,
            title: data.title,
            phoneNumber: data.phoneNumber,
            customFields: data.customFields,
        });

        if (data.userId) {
            customer.user = { id: data.userId } as any;
        }

        return repo.save(customer);
    }

    async update(id: ID, data: UpdateCustomerData): Promise<Customer> {
        const ctx = this.getContext();
        const repo = this.connection.getRepository(ctx, Customer);

        await repo.update(id, {
            firstName: data.firstName,
            lastName: data.lastName,
            emailAddress: data.emailAddress,
            title: data.title,
            phoneNumber: data.phoneNumber,
            customFields: data.customFields,
        });

        const updated = await this.findOne(id, ['addresses', 'user']);
        if (!updated) {
            throw new Error(`Customer with id ${id} not found after update`);
        }
        return updated;
    }

    async softDelete(id: ID): Promise<void> {
        const ctx = this.getContext();
        const repo = this.connection.getRepository(ctx, Customer);

        await repo.update(id, { deletedAt: new Date() });
    }

    async restore(id: ID): Promise<Customer> {
        const ctx = this.getContext();
        const repo = this.connection.getRepository(ctx, Customer);

        await repo.update(id, { deletedAt: null });

        const restored = await repo.findOne({
            where: { id } as any,
            relations: ['addresses', 'user'],
        });

        if (!restored) {
            throw new Error(`Customer with id ${id} not found after restore`);
        }
        return restored;
    }

    async exists(id: ID): Promise<boolean> {
        const ctx = this.getContext();
        const repo = this.connection.getRepository(ctx, Customer);

        const count = await repo.count({
            where: {
                id: id as any,
                deletedAt: IsNull(),
            },
        });

        return count > 0;
    }

    async count(filter: any = {}): Promise<number> {
        const ctx = this.getContext();
        const repo = this.connection.getRepository(ctx, Customer);

        const qb = repo.createQueryBuilder('customer').where('customer.deletedAt is null');

        if (filter.firstName) {
            qb.andWhere('customer.firstName LIKE :firstName', {
                firstName: `%${filter.firstName}%`,
            });
        }
        if (filter.lastName) {
            qb.andWhere('customer.lastName LIKE :lastName', { lastName: `%${filter.lastName}%` });
        }
        if (filter.emailAddress) {
            qb.andWhere('customer.emailAddress LIKE :emailAddress', {
                emailAddress: `%${filter.emailAddress}%`,
            });
        }

        return qb.getCount();
    }

    async addToGroup(customerId: ID, groupId: ID): Promise<void> {
        const ctx = this.getContext();
        const customer = await this.connection.getRepository(ctx, Customer).findOne({
            where: { id: customerId as any },
            relations: ['groups'],
        });

        if (!customer) {
            throw new Error(`Customer with id ${customerId} not found`);
        }

        const group = await this.connection.getRepository(ctx, CustomerGroup).findOne({
            where: { id: groupId as any },
        });

        if (!group) {
            throw new Error(`CustomerGroup with id ${groupId} not found`);
        }

        if (!customer.groups) {
            customer.groups = [];
        }

        if (!customer.groups.some(g => g.id === groupId)) {
            customer.groups.push(group);
            await this.connection.getRepository(ctx, Customer).save(customer);
        }
    }

    async removeFromGroup(customerId: ID, groupId: ID): Promise<void> {
        const ctx = this.getContext();
        const customer = await this.connection.getRepository(ctx, Customer).findOne({
            where: { id: customerId as any },
            relations: ['groups'],
        });

        if (!customer) {
            throw new Error(`Customer with id ${customerId} not found`);
        }

        if (customer.groups) {
            customer.groups = customer.groups.filter(g => g.id !== groupId);
            await this.connection.getRepository(ctx, Customer).save(customer);
        }
    }

    async getGroups(customerId: ID): Promise<CustomerGroup[]> {
        const ctx = this.getContext();
        const customer = await this.connection.getRepository(ctx, Customer).findOne({
            where: { id: customerId as any },
            relations: ['groups'],
        });

        return customer?.groups || [];
    }

    async addToChannel(customerId: ID, channelId: ID): Promise<void> {
        const ctx = this.getContext();
        const customer = await this.connection.getRepository(ctx, Customer).findOne({
            where: { id: customerId as any },
            relations: ['channels'],
        });

        if (!customer) {
            throw new Error(`Customer with id ${customerId} not found`);
        }

        const channel = await this.connection.getRepository(ctx, Channel).findOne({
            where: { id: channelId as any },
        });

        if (!channel) {
            throw new Error(`Channel with id ${channelId} not found`);
        }

        if (!customer.channels) {
            customer.channels = [];
        }

        if (!customer.channels.some(c => c.id === channelId)) {
            customer.channels.push(channel);
            await this.connection.getRepository(ctx, Customer).save(customer);
        }
    }

    async removeFromChannel(customerId: ID, channelId: ID): Promise<void> {
        const ctx = this.getContext();
        const customer = await this.connection.getRepository(ctx, Customer).findOne({
            where: { id: customerId as any },
            relations: ['channels'],
        });

        if (!customer) {
            throw new Error(`Customer with id ${customerId} not found`);
        }

        if (customer.channels) {
            customer.channels = customer.channels.filter(c => c.id !== channelId);
            await this.connection.getRepository(ctx, Customer).save(customer);
        }
    }

    async getChannels(customerId: ID): Promise<Channel[]> {
        const ctx = this.getContext();
        const customer = await this.connection.getRepository(ctx, Customer).findOne({
            where: { id: customerId as any },
            relations: ['channels'],
        });

        return customer?.channels || [];
    }

    async search(searchTerm: string, options: CustomerListOptions = {}): Promise<PaginatedList<Customer>> {
        const ctx = this.getContext();
        const repo = this.connection.getRepository(ctx, Customer);
        const { skip = 0, take = 20 } = options;

        const qb = repo
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.addresses', 'addresses')
            .leftJoinAndSelect('customer.user', 'user')
            .where('customer.deletedAt is null')
            .andWhere(
                '(customer.firstName LIKE :searchTerm OR customer.lastName LIKE :searchTerm OR customer.emailAddress LIKE :searchTerm)',
                { searchTerm: `%${searchTerm}%` },
            )
            .skip(skip)
            .take(take)
            .orderBy('customer.createdAt', 'DESC');

        const [items, totalItems] = await qb.getManyAndCount();

        return { items, totalItems };
    }

    /**
     * Get or create a RequestContext
     * In a real implementation, this should be injected via constructor
     * For now, we create a minimal context
     */
    private getContext(): RequestContext {
        // This is a simplified context creation
        // In production, this should be injected from the service layer
        return RequestContext.empty();
    }
}
