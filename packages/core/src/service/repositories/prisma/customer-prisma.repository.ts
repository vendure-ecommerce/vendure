import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../connection/prisma.service';

/**
 * @description
 * Repository for Customer entity using Prisma ORM.
 * This is part of Phase 2.3 - Pilot migration from TypeORM to Prisma.
 *
 * Provides type-safe database operations for Customer entity with
 * improved query performance and better developer experience.
 *
 * @example
 * ```typescript
 * const customer = await customerPrismaRepo.findOne('customer-id');
 * const customers = await customerPrismaRepo.findMany({
 *   where: { emailAddress: { contains: '@example.com' } },
 *   skip: 0,
 *   take: 10,
 * });
 * ```
 *
 * @docsCategory services
 * @since 3.6.0
 */
@Injectable()
export class CustomerPrismaRepository {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Find a single customer by ID
     * @param id - Customer ID
     * @param includeRelations - Whether to include related entities
     */
    async findOne(id: string, includeRelations: boolean = true) {
        return this.prisma.customer.findUnique({
            where: { id },
            include: includeRelations
                ? {
                      addresses: {
                          include: {
                              country: true,
                          },
                      },
                      user: true,
                      groups: {
                          include: {
                              group: true,
                          },
                      },
                      channels: {
                          include: {
                              channel: true,
                          },
                      },
                  }
                : undefined,
        });
    }

    /**
     * Find a customer by email address
     * @param emailAddress - Customer email
     */
    async findByEmail(emailAddress: string) {
        return this.prisma.customer.findFirst({
            where: { emailAddress },
            include: {
                addresses: {
                    include: {
                        country: true,
                    },
                },
                user: true,
            },
        });
    }

    /**
     * Find customers with pagination and filtering
     * @param params - Query parameters
     */
    async findMany(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.CustomerWhereUniqueInput;
        where?: Prisma.CustomerWhereInput;
        orderBy?: Prisma.CustomerOrderByWithRelationInput;
    }) {
        const { skip, take, cursor, where, orderBy } = params;

        const [items, count] = await Promise.all([
            this.prisma.customer.findMany({
                skip,
                take,
                cursor,
                where: {
                    ...where,
                    deletedAt: null, // Exclude soft-deleted customers
                },
                orderBy,
                include: {
                    addresses: {
                        include: {
                            country: true,
                        },
                    },
                    user: true,
                },
            }),
            this.prisma.customer.count({
                where: {
                    ...where,
                    deletedAt: null,
                },
            }),
        ]);

        return {
            items,
            totalItems: count,
        };
    }

    /**
     * Create a new customer
     * @param data - Customer data
     */
    async create(data: Prisma.CustomerCreateInput) {
        return this.prisma.customer.create({
            data,
            include: {
                addresses: true,
                user: true,
            },
        });
    }

    /**
     * Update a customer
     * @param id - Customer ID
     * @param data - Update data
     */
    async update(id: string, data: Prisma.CustomerUpdateInput) {
        return this.prisma.customer.update({
            where: { id },
            data,
            include: {
                addresses: {
                    include: {
                        country: true,
                    },
                },
                user: true,
            },
        });
    }

    /**
     * Soft delete a customer
     * @param id - Customer ID
     */
    async softDelete(id: string) {
        return this.prisma.customer.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    /**
     * Restore a soft-deleted customer
     * @param id - Customer ID
     */
    async restore(id: string) {
        return this.prisma.customer.update({
            where: { id },
            data: {
                deletedAt: null,
            },
        });
    }

    /**
     * Hard delete a customer (use with caution!)
     * @param id - Customer ID
     */
    async hardDelete(id: string) {
        return this.prisma.customer.delete({
            where: { id },
        });
    }

    /**
     * Count customers matching criteria
     * @param where - Filter criteria
     */
    async count(where?: Prisma.CustomerWhereInput) {
        return this.prisma.customer.count({
            where: {
                ...where,
                deletedAt: null,
            },
        });
    }

    /**
     * Check if customer exists
     * @param id - Customer ID
     */
    async exists(id: string): Promise<boolean> {
        const count = await this.prisma.customer.count({
            where: { id, deletedAt: null },
        });
        return count > 0;
    }

    /**
     * Find customers by IDs
     * @param ids - Array of customer IDs
     */
    async findByIds(ids: string[]) {
        return this.prisma.customer.findMany({
            where: {
                id: { in: ids },
                deletedAt: null,
            },
            include: {
                addresses: {
                    include: {
                        country: true,
                    },
                },
                user: true,
            },
        });
    }

    /**
     * Add customer to group
     * @param customerId - Customer ID
     * @param groupId - Customer group ID
     */
    async addToGroup(customerId: string, groupId: string) {
        return this.prisma.customerGroupMembership.create({
            data: {
                customerId,
                groupId,
            },
        });
    }

    /**
     * Remove customer from group
     * @param customerId - Customer ID
     * @param groupId - Customer group ID
     */
    async removeFromGroup(customerId: string, groupId: string) {
        return this.prisma.customerGroupMembership.delete({
            where: {
                customerId_groupId: {
                    customerId,
                    groupId,
                },
            },
        });
    }

    /**
     * Get customer groups
     * @param customerId - Customer ID
     */
    async getGroups(customerId: string) {
        const memberships = await this.prisma.customerGroupMembership.findMany({
            where: { customerId },
            include: {
                group: true,
            },
        });

        return memberships.map(m => m.group);
    }

    /**
     * Add customer to channel
     * @param customerId - Customer ID
     * @param channelId - Channel ID
     */
    async addToChannel(customerId: string, channelId: string) {
        return this.prisma.customerChannel.create({
            data: {
                customerId,
                channelId,
            },
        });
    }

    /**
     * Remove customer from channel
     * @param customerId - Customer ID
     * @param channelId - Channel ID
     */
    async removeFromChannel(customerId: string, channelId: string) {
        return this.prisma.customerChannel.delete({
            where: {
                customerId_channelId: {
                    customerId,
                    channelId,
                },
            },
        });
    }

    /**
     * Get customer channels
     * @param customerId - Customer ID
     */
    async getChannels(customerId: string) {
        const channels = await this.prisma.customerChannel.findMany({
            where: { customerId },
            include: {
                channel: true,
            },
        });

        return channels.map(c => c.channel);
    }

    /**
     * Search customers by name or email
     * @param searchTerm - Search term
     * @param options - Pagination options
     */
    async search(searchTerm: string, options: { skip?: number; take?: number } = {}) {
        const { skip = 0, take = 20 } = options;

        return this.findMany({
            skip,
            take,
            where: {
                OR: [
                    { firstName: { contains: searchTerm, mode: 'insensitive' } },
                    { lastName: { contains: searchTerm, mode: 'insensitive' } },
                    { emailAddress: { contains: searchTerm, mode: 'insensitive' } },
                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}
