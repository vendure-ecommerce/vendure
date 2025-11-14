/**
 * @description
 * Prisma-based repository for StockMovement entity operations.
 * Handles inventory tracking with different movement types.
 *
 * @since 3.6.0
 */

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { PrismaService } from '../../../connection/prisma.service';

export enum StockMovementType {
    ADJUSTMENT = 'ADJUSTMENT',
    ALLOCATION = 'ALLOCATION',
    RELEASE = 'RELEASE',
    SALE = 'SALE',
    CANCELLATION = 'CANCELLATION',
    RETURN = 'RETURN',
}

export interface StockMovementListOptions {
    skip?: number;
    take?: number;
    filter?: {
        type?: string;
        productVariantId?: string;
        stockLocationId?: string;
    };
    sort?: {
        field: string;
        order: 'asc' | 'desc';
    };
}

export interface CreateStockMovementData {
    type: string;
    productVariantId: string;
    stockLocationId: string;
    quantity: number;
    metadata?: Record<string, any>;
    customFields?: Record<string, any>;
}

export interface StockLevelSummary {
    productVariantId: string;
    stockLocationId: string;
    totalQuantity: number;
}

/**
 * Default include for loading StockMovement relations
 */
const DEFAULT_STOCK_MOVEMENT_INCLUDE = {
    productVariant: {
        include: {
            translations: true,
            product: {
                include: {
                    translations: true,
                },
            },
        },
    },
    stockLocation: {
        include: {
            translations: true,
        },
    },
} satisfies Prisma.StockMovementInclude;

@Injectable()
export class StockMovementPrismaRepository {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Find a single stock movement by ID
     */
    async findOne(id: ID, includeRelations: boolean = true): Promise<any | undefined> {
        const include = includeRelations ? DEFAULT_STOCK_MOVEMENT_INCLUDE : undefined;

        const stockMovement = await this.prisma.stockMovement.findUnique({
            where: { id: String(id) },
            include,
        });

        return stockMovement || undefined;
    }

    /**
     * Find all stock movements with pagination and filtering
     */
    async findAll(options: StockMovementListOptions = {}): Promise<PaginatedList<any>> {
        const { skip = 0, take = 10, filter, sort } = options;

        // Build where clause
        const where: Prisma.StockMovementWhereInput = {};

        if (filter?.type) {
            where.type = filter.type;
        }

        if (filter?.productVariantId) {
            where.productVariantId = filter.productVariantId;
        }

        if (filter?.stockLocationId) {
            where.stockLocationId = filter.stockLocationId;
        }

        // Build orderBy
        let orderBy: Prisma.StockMovementOrderByWithRelationInput = {
            createdAt: 'desc',
        };

        if (sort?.field) {
            orderBy = {
                [sort.field]: sort.order || 'asc',
            };
        }

        // Execute query
        const [items, totalItems] = await Promise.all([
            this.prisma.stockMovement.findMany({
                where,
                include: DEFAULT_STOCK_MOVEMENT_INCLUDE,
                skip,
                take,
                orderBy,
            }),
            this.prisma.stockMovement.count({ where }),
        ]);

        return {
            items,
            totalItems,
        };
    }

    /**
     * Find stock movements by product variant
     */
    async findByProductVariant(productVariantId: ID, stockLocationId?: ID): Promise<any[]> {
        const where: Prisma.StockMovementWhereInput = {
            productVariantId: String(productVariantId),
        };

        if (stockLocationId) {
            where.stockLocationId = String(stockLocationId);
        }

        const stockMovements = await this.prisma.stockMovement.findMany({
            where,
            include: DEFAULT_STOCK_MOVEMENT_INCLUDE,
            orderBy: {
                createdAt: 'desc',
            },
        });

        return stockMovements;
    }

    /**
     * Find stock movements by stock location
     */
    async findByStockLocation(stockLocationId: ID): Promise<any[]> {
        const stockMovements = await this.prisma.stockMovement.findMany({
            where: {
                stockLocationId: String(stockLocationId),
            },
            include: DEFAULT_STOCK_MOVEMENT_INCLUDE,
            orderBy: {
                createdAt: 'desc',
            },
        });

        return stockMovements;
    }

    /**
     * Get stock level for a product variant at a location
     */
    async getStockLevel(productVariantId: ID, stockLocationId: ID): Promise<number> {
        const result = await this.prisma.stockMovement.aggregate({
            where: {
                productVariantId: String(productVariantId),
                stockLocationId: String(stockLocationId),
            },
            _sum: {
                quantity: true,
            },
        });

        return result._sum.quantity || 0;
    }

    /**
     * Get stock levels for all locations of a product variant
     */
    async getStockLevelsByVariant(productVariantId: ID): Promise<StockLevelSummary[]> {
        const movements = await this.prisma.stockMovement.groupBy({
            by: ['productVariantId', 'stockLocationId'],
            where: {
                productVariantId: String(productVariantId),
            },
            _sum: {
                quantity: true,
            },
        });

        return movements.map(m => ({
            productVariantId: m.productVariantId,
            stockLocationId: m.stockLocationId,
            totalQuantity: m._sum.quantity || 0,
        }));
    }

    /**
     * Get stock levels for all variants at a location
     */
    async getStockLevelsByLocation(stockLocationId: ID): Promise<StockLevelSummary[]> {
        const movements = await this.prisma.stockMovement.groupBy({
            by: ['productVariantId', 'stockLocationId'],
            where: {
                stockLocationId: String(stockLocationId),
            },
            _sum: {
                quantity: true,
            },
        });

        return movements.map(m => ({
            productVariantId: m.productVariantId,
            stockLocationId: m.stockLocationId,
            totalQuantity: m._sum.quantity || 0,
        }));
    }

    /**
     * Create a new stock movement
     */
    async create(data: CreateStockMovementData): Promise<any> {
        const stockMovement = await this.prisma.stockMovement.create({
            data: {
                type: data.type,
                productVariantId: data.productVariantId,
                stockLocationId: data.stockLocationId,
                quantity: data.quantity,
                metadata: data.metadata as Prisma.JsonValue,
                customFields: data.customFields as Prisma.JsonValue,
            },
            include: DEFAULT_STOCK_MOVEMENT_INCLUDE,
        });

        return stockMovement;
    }

    /**
     * Delete a stock movement (usually not recommended - use adjustments instead)
     */
    async delete(id: ID): Promise<void> {
        await this.prisma.stockMovement.delete({
            where: { id: String(id) },
        });
    }

    /**
     * Get stock movement history for a product variant
     * Returns movements in chronological order
     */
    async getHistory(
        productVariantId: ID,
        stockLocationId?: ID,
        options?: { skip?: number; take?: number },
    ): Promise<PaginatedList<any>> {
        const where: Prisma.StockMovementWhereInput = {
            productVariantId: String(productVariantId),
        };

        if (stockLocationId) {
            where.stockLocationId = String(stockLocationId);
        }

        const { skip = 0, take = 50 } = options || {};

        const [items, totalItems] = await Promise.all([
            this.prisma.stockMovement.findMany({
                where,
                include: DEFAULT_STOCK_MOVEMENT_INCLUDE,
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take,
            }),
            this.prisma.stockMovement.count({ where }),
        ]);

        return {
            items,
            totalItems,
        };
    }

    /**
     * Create a stock adjustment movement
     */
    async createAdjustment(
        productVariantId: ID,
        stockLocationId: ID,
        quantity: number,
        metadata?: Record<string, any>,
    ): Promise<any> {
        return this.create({
            type: StockMovementType.ADJUSTMENT,
            productVariantId: String(productVariantId),
            stockLocationId: String(stockLocationId),
            quantity,
            metadata,
        });
    }

    /**
     * Create a stock sale movement
     */
    async createSale(
        productVariantId: ID,
        stockLocationId: ID,
        quantity: number,
        orderLineId: string,
    ): Promise<any> {
        return this.create({
            type: StockMovementType.SALE,
            productVariantId: String(productVariantId),
            stockLocationId: String(stockLocationId),
            quantity: -Math.abs(quantity), // Sale is negative
            metadata: { orderLineId },
        });
    }

    /**
     * Create a stock allocation movement
     */
    async createAllocation(
        productVariantId: ID,
        stockLocationId: ID,
        quantity: number,
        orderLineId: string,
    ): Promise<any> {
        return this.create({
            type: StockMovementType.ALLOCATION,
            productVariantId: String(productVariantId),
            stockLocationId: String(stockLocationId),
            quantity: -Math.abs(quantity), // Allocation is negative
            metadata: { orderLineId },
        });
    }

    /**
     * Create a stock release movement
     */
    async createRelease(
        productVariantId: ID,
        stockLocationId: ID,
        quantity: number,
        orderLineId: string,
    ): Promise<any> {
        return this.create({
            type: StockMovementType.RELEASE,
            productVariantId: String(productVariantId),
            stockLocationId: String(stockLocationId),
            quantity: Math.abs(quantity), // Release is positive
            metadata: { orderLineId },
        });
    }

    /**
     * Create a stock return movement
     */
    async createReturn(
        productVariantId: ID,
        stockLocationId: ID,
        quantity: number,
        orderLineId: string,
    ): Promise<any> {
        return this.create({
            type: StockMovementType.RETURN,
            productVariantId: String(productVariantId),
            stockLocationId: String(stockLocationId),
            quantity: Math.abs(quantity), // Return is positive
            metadata: { orderLineId },
        });
    }
}
