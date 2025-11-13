/**
 * @description
 * Adapter layer for Customer ORM operations.
 * Provides a unified interface that can be implemented by both TypeORM and Prisma.
 *
 * This allows for gradual migration from TypeORM to Prisma with zero downtime.
 * The service layer depends on this interface, not on a specific ORM implementation.
 *
 * @since 3.6.0
 */

import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { Channel } from '../../entity/channel/channel.entity';
import { CustomerGroup } from '../../entity/customer-group/customer-group.entity';
import { Customer } from '../../entity/customer/customer.entity';

export interface CreateCustomerData {
    firstName: string;
    lastName: string;
    emailAddress: string;
    title?: string;
    phoneNumber?: string;
    userId?: ID;
    customFields?: any;
}

export interface UpdateCustomerData {
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
    title?: string;
    phoneNumber?: string;
    customFields?: any;
}

export interface CustomerListOptions {
    skip?: number;
    take?: number;
    filter?: any;
    sort?: any;
}

/**
 * ORM-agnostic interface for Customer operations
 */
export interface ICustomerOrmAdapter {
    /**
     * Find a customer by ID
     */
    findOne(id: ID, includeRelations?: string[]): Promise<Customer | undefined>;

    /**
     * Find a customer by email address
     */
    findByEmail(emailAddress: string): Promise<Customer | undefined>;

    /**
     * Find a customer by user ID
     */
    findByUserId(userId: ID): Promise<Customer | undefined>;

    /**
     * Find customers with pagination
     */
    findAll(options: CustomerListOptions): Promise<PaginatedList<Customer>>;

    /**
     * Create a new customer
     */
    create(data: CreateCustomerData): Promise<Customer>;

    /**
     * Update a customer
     */
    update(id: ID, data: UpdateCustomerData): Promise<Customer>;

    /**
     * Soft delete a customer
     */
    softDelete(id: ID): Promise<void>;

    /**
     * Restore a soft-deleted customer
     */
    restore(id: ID): Promise<Customer>;

    /**
     * Check if customer exists
     */
    exists(id: ID): Promise<boolean>;

    /**
     * Count customers
     */
    count(filter?: any): Promise<number>;

    /**
     * Add customer to group
     */
    addToGroup(customerId: ID, groupId: ID): Promise<void>;

    /**
     * Remove customer from group
     */
    removeFromGroup(customerId: ID, groupId: ID): Promise<void>;

    /**
     * Get customer groups
     */
    getGroups(customerId: ID): Promise<CustomerGroup[]>;

    /**
     * Add customer to channel
     */
    addToChannel(customerId: ID, channelId: ID): Promise<void>;

    /**
     * Remove customer from channel
     */
    removeFromChannel(customerId: ID, channelId: ID): Promise<void>;

    /**
     * Get customer channels
     */
    getChannels(customerId: ID): Promise<Channel[]>;

    /**
     * Search customers
     */
    search(searchTerm: string, options?: CustomerListOptions): Promise<PaginatedList<Customer>>;
}

/**
 * Factory function to get the appropriate ORM adapter
 */
export function getCustomerOrmAdapter(
    usePrisma: boolean,
    typeormAdapter: ICustomerOrmAdapter,
    prismaAdapter: ICustomerOrmAdapter,
): ICustomerOrmAdapter {
    return usePrisma ? prismaAdapter : typeormAdapter;
}
