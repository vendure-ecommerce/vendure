import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../connection/prisma.service';

/**
 * @description
 * Repository for Address entity using Prisma ORM.
 * This is part of Phase 2.3 - Pilot migration from TypeORM to Prisma.
 *
 * Provides type-safe database operations for Address entity with
 * improved query performance and better developer experience.
 *
 * @example
 * ```typescript
 * const address = await addressPrismaRepo.findOne('address-id');
 * const addresses = await addressPrismaRepo.findByCustomerId('customer-id');
 * ```
 *
 * @docsCategory services
 * @since 3.6.0
 */
@Injectable()
export class AddressPrismaRepository {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Find a single address by ID
     * @param id - Address ID
     * @param includeRelations - Whether to include related entities
     */
    async findOne(id: string, includeRelations: boolean = true) {
        return this.prisma.address.findUnique({
            where: { id },
            include: includeRelations
                ? {
                      customer: true,
                      country: true,
                  }
                : undefined,
        });
    }

    /**
     * Find all addresses for a customer
     * @param customerId - Customer ID
     */
    async findByCustomerId(customerId: string) {
        return this.prisma.address.findMany({
            where: { customerId },
            include: {
                country: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    /**
     * Find addresses with pagination and filtering
     * @param params - Query parameters
     */
    async findMany(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.AddressWhereUniqueInput;
        where?: Prisma.AddressWhereInput;
        orderBy?: Prisma.AddressOrderByWithRelationInput;
    }) {
        const { skip, take, cursor, where, orderBy } = params;

        const [items, count] = await Promise.all([
            this.prisma.address.findMany({
                skip,
                take,
                cursor,
                where,
                orderBy,
                include: {
                    customer: true,
                    country: true,
                },
            }),
            this.prisma.address.count({ where }),
        ]);

        return {
            items,
            totalItems: count,
        };
    }

    /**
     * Create a new address
     * @param data - Address data
     */
    async create(data: Prisma.AddressCreateInput) {
        return this.prisma.address.create({
            data,
            include: {
                customer: true,
                country: true,
            },
        });
    }

    /**
     * Update an address
     * @param id - Address ID
     * @param data - Update data
     */
    async update(id: string, data: Prisma.AddressUpdateInput) {
        return this.prisma.address.update({
            where: { id },
            data,
            include: {
                customer: true,
                country: true,
            },
        });
    }

    /**
     * Delete an address
     * @param id - Address ID
     */
    async delete(id: string) {
        return this.prisma.address.delete({
            where: { id },
        });
    }

    /**
     * Count addresses matching criteria
     * @param where - Filter criteria
     */
    async count(where?: Prisma.AddressWhereInput) {
        return this.prisma.address.count({ where });
    }

    /**
     * Check if address exists
     * @param id - Address ID
     */
    async exists(id: string): Promise<boolean> {
        const count = await this.prisma.address.count({
            where: { id },
        });
        return count > 0;
    }

    /**
     * Find addresses by IDs
     * @param ids - Array of address IDs
     */
    async findByIds(ids: string[]) {
        return this.prisma.address.findMany({
            where: {
                id: { in: ids },
            },
            include: {
                customer: true,
                country: true,
            },
        });
    }

    /**
     * Get default shipping address for a customer
     * @param customerId - Customer ID
     */
    async getDefaultShippingAddress(customerId: string) {
        return this.prisma.address.findFirst({
            where: {
                customerId,
                defaultShippingAddress: true,
            },
            include: {
                country: true,
            },
        });
    }

    /**
     * Get default billing address for a customer
     * @param customerId - Customer ID
     */
    async getDefaultBillingAddress(customerId: string) {
        return this.prisma.address.findFirst({
            where: {
                customerId,
                defaultBillingAddress: true,
            },
            include: {
                country: true,
            },
        });
    }

    /**
     * Set default shipping address
     * @param customerId - Customer ID
     * @param addressId - Address ID to set as default
     */
    async setDefaultShippingAddress(customerId: string, addressId: string) {
        // Use transaction to ensure atomicity
        return this.prisma.$transaction(async tx => {
            // Clear existing default
            await tx.address.updateMany({
                where: {
                    customerId,
                    defaultShippingAddress: true,
                },
                data: {
                    defaultShippingAddress: false,
                },
            });

            // Set new default
            return tx.address.update({
                where: { id: addressId },
                data: {
                    defaultShippingAddress: true,
                },
                include: {
                    country: true,
                },
            });
        });
    }

    /**
     * Set default billing address
     * @param customerId - Customer ID
     * @param addressId - Address ID to set as default
     */
    async setDefaultBillingAddress(customerId: string, addressId: string) {
        // Use transaction to ensure atomicity
        return this.prisma.$transaction(async tx => {
            // Clear existing default
            await tx.address.updateMany({
                where: {
                    customerId,
                    defaultBillingAddress: true,
                },
                data: {
                    defaultBillingAddress: false,
                },
            });

            // Set new default
            return tx.address.update({
                where: { id: addressId },
                data: {
                    defaultBillingAddress: true,
                },
                include: {
                    country: true,
                },
            });
        });
    }

    /**
     * Delete all addresses for a customer
     * @param customerId - Customer ID
     */
    async deleteByCustomerId(customerId: string) {
        return this.prisma.address.deleteMany({
            where: { customerId },
        });
    }

    /**
     * Search addresses by customer name or address fields
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
                    { fullName: { contains: searchTerm, mode: 'insensitive' } },
                    { company: { contains: searchTerm, mode: 'insensitive' } },
                    { streetLine1: { contains: searchTerm, mode: 'insensitive' } },
                    { city: { contains: searchTerm, mode: 'insensitive' } },
                    { postalCode: { contains: searchTerm, mode: 'insensitive' } },
                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    /**
     * Find addresses by country
     * @param countryId - Country ID
     */
    async findByCountryId(countryId: string) {
        return this.prisma.address.findMany({
            where: { countryId },
            include: {
                customer: true,
                country: true,
            },
        });
    }

    /**
     * Bulk create addresses
     * @param addresses - Array of address data
     */
    async createMany(addresses: Prisma.AddressCreateManyInput[]) {
        return this.prisma.address.createMany({
            data: addresses,
            skipDuplicates: true,
        });
    }

    /**
     * Validate address belongs to customer
     * @param addressId - Address ID
     * @param customerId - Customer ID
     */
    async validateOwnership(addressId: string, customerId: string): Promise<boolean> {
        const count = await this.prisma.address.count({
            where: {
                id: addressId,
                customerId,
            },
        });
        return count > 0;
    }
}
