/**
 * @description
 * Prisma-based repository for TaxRate entity operations.
 * Handles CRUD operations for TaxRates with their relations (category, zone, customerGroup).
 *
 * @since 3.6.0
 */

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { PrismaService } from '../../../connection/prisma.service';

export interface TaxRateListOptions {
    skip?: number;
    take?: number;
    filter?: {
        enabled?: boolean;
        categoryId?: string;
        zoneId?: string;
        customerGroupId?: string;
    };
    sort?: {
        field: string;
        order: 'asc' | 'desc';
    };
}

export interface CreateTaxRateData {
    name: string;
    enabled?: boolean;
    value: number;
    categoryId: string;
    zoneId: string;
    customerGroupId?: string | null;
    customFields?: Record<string, any>;
}

export interface UpdateTaxRateData {
    name?: string;
    enabled?: boolean;
    value?: number;
    categoryId?: string;
    zoneId?: string;
    customerGroupId?: string | null;
    customFields?: Record<string, any>;
}

/**
 * Default include for loading TaxRate relations
 */
const DEFAULT_TAX_RATE_INCLUDE = {
    category: true,
    zone: true,
    customerGroup: true,
} satisfies Prisma.TaxRateInclude;

@Injectable()
export class TaxRatePrismaRepository {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Find a single tax rate by ID
     */
    async findOne(id: ID, includeRelations: boolean = true): Promise<any | undefined> {
        const include = includeRelations ? DEFAULT_TAX_RATE_INCLUDE : undefined;

        const taxRate = await this.prisma.taxRate.findUnique({
            where: { id: String(id) },
            include,
        });

        return taxRate || undefined;
    }

    /**
     * Find all tax rates with pagination and filtering
     */
    async findAll(options: TaxRateListOptions = {}): Promise<PaginatedList<any>> {
        const { skip = 0, take = 10, filter, sort } = options;

        // Build where clause
        const where: Prisma.TaxRateWhereInput = {};

        if (filter?.enabled !== undefined) {
            where.enabled = filter.enabled;
        }

        if (filter?.categoryId) {
            where.categoryId = filter.categoryId;
        }

        if (filter?.zoneId) {
            where.zoneId = filter.zoneId;
        }

        if (filter?.customerGroupId) {
            where.customerGroupId = filter.customerGroupId;
        }

        // Build orderBy
        let orderBy: Prisma.TaxRateOrderByWithRelationInput = {
            createdAt: 'desc',
        };

        if (sort?.field) {
            orderBy = {
                [sort.field]: sort.order || 'asc',
            };
        }

        // Execute query
        const [items, totalItems] = await Promise.all([
            this.prisma.taxRate.findMany({
                where,
                include: DEFAULT_TAX_RATE_INCLUDE,
                skip,
                take,
                orderBy,
            }),
            this.prisma.taxRate.count({ where }),
        ]);

        return {
            items,
            totalItems,
        };
    }

    /**
     * Find tax rates by category ID
     */
    async findByCategory(categoryId: ID): Promise<any[]> {
        const taxRates = await this.prisma.taxRate.findMany({
            where: {
                categoryId: String(categoryId),
                enabled: true,
            },
            include: DEFAULT_TAX_RATE_INCLUDE,
        });

        return taxRates;
    }

    /**
     * Find tax rates by zone ID
     */
    async findByZone(zoneId: ID): Promise<any[]> {
        const taxRates = await this.prisma.taxRate.findMany({
            where: {
                zoneId: String(zoneId),
                enabled: true,
            },
            include: DEFAULT_TAX_RATE_INCLUDE,
        });

        return taxRates;
    }

    /**
     * Find applicable tax rate for a given category, zone, and optional customer group
     */
    async findApplicableTaxRate(categoryId: ID, zoneId: ID, customerGroupId?: ID): Promise<any | undefined> {
        // First try to find a tax rate with customer group
        if (customerGroupId) {
            const customerGroupTaxRate = await this.prisma.taxRate.findFirst({
                where: {
                    categoryId: String(categoryId),
                    zoneId: String(zoneId),
                    customerGroupId: String(customerGroupId),
                    enabled: true,
                },
                include: DEFAULT_TAX_RATE_INCLUDE,
            });

            if (customerGroupTaxRate) {
                return customerGroupTaxRate;
            }
        }

        // Fall back to tax rate without customer group
        const taxRate = await this.prisma.taxRate.findFirst({
            where: {
                categoryId: String(categoryId),
                zoneId: String(zoneId),
                customerGroupId: null,
                enabled: true,
            },
            include: DEFAULT_TAX_RATE_INCLUDE,
        });

        return taxRate || undefined;
    }

    /**
     * Create a new tax rate
     */
    async create(data: CreateTaxRateData): Promise<any> {
        const taxRate = await this.prisma.taxRate.create({
            data: {
                name: data.name,
                enabled: data.enabled ?? true,
                value: data.value,
                categoryId: data.categoryId,
                zoneId: data.zoneId,
                customerGroupId: data.customerGroupId,
                customFields: data.customFields as Prisma.JsonValue,
            },
            include: DEFAULT_TAX_RATE_INCLUDE,
        });

        return taxRate;
    }

    /**
     * Update an existing tax rate
     */
    async update(id: ID, data: UpdateTaxRateData): Promise<any> {
        const updateData: Prisma.TaxRateUpdateInput = {};

        if (data.name !== undefined) {
            updateData.name = data.name;
        }

        if (data.enabled !== undefined) {
            updateData.enabled = data.enabled;
        }

        if (data.value !== undefined) {
            updateData.value = data.value;
        }

        if (data.categoryId !== undefined) {
            updateData.categoryId = data.categoryId;
        }

        if (data.zoneId !== undefined) {
            updateData.zoneId = data.zoneId;
        }

        if (data.customerGroupId !== undefined) {
            updateData.customerGroupId = data.customerGroupId;
        }

        if (data.customFields !== undefined) {
            updateData.customFields = data.customFields as Prisma.JsonValue;
        }

        const taxRate = await this.prisma.taxRate.update({
            where: { id: String(id) },
            data: updateData,
            include: DEFAULT_TAX_RATE_INCLUDE,
        });

        return taxRate;
    }

    /**
     * Delete a tax rate
     */
    async delete(id: ID): Promise<void> {
        await this.prisma.taxRate.delete({
            where: { id: String(id) },
        });
    }
}
