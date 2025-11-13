/**
 * @description
 * Prisma-based repository for Order entity operations.
 * Handles CRUD operations for Orders with their relations (lines, payments, fulfillments, etc.)
 *
 * @since 3.6.0
 */

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { PrismaService } from '../../../connection/prisma.service';

export interface OrderListOptions {
    skip?: number;
    take?: number;
    filter?: {
        active?: boolean;
        state?: string;
        customerId?: string;
        code?: string;
    };
    sort?: {
        field: string;
        order: 'asc' | 'desc';
    };
}

export interface CreateOrderData {
    code: string;
    state: string;
    active?: boolean;
    type?: string;
    customerId?: string | null;
    currencyCode: string;
    subTotal: number;
    subTotalWithTax: number;
    shipping?: number;
    shippingWithTax?: number;
    taxZoneId?: string | null;
    couponCodes?: string[];
    shippingAddressId?: string | null;
    billingAddressId?: string | null;
    customFields?: Record<string, any>;
}

export interface UpdateOrderData {
    state?: string;
    active?: boolean;
    orderPlacedAt?: Date | null;
    subTotal?: number;
    subTotalWithTax?: number;
    shipping?: number;
    shippingWithTax?: number;
    couponCodes?: string[];
    customFields?: Record<string, any>;
}

/**
 * Default include for loading Order relations
 */
const DEFAULT_ORDER_INCLUDE = {
    customer: true,
    lines: {
        include: {
            productVariant: {
                include: {
                    product: {
                        include: {
                            translations: true,
                        },
                    },
                    translations: true,
                },
            },
            featuredAsset: true,
            taxCategory: true,
        },
    },
    payments: {
        include: {
            refunds: true,
        },
    },
    shippingLines: {
        include: {
            shippingMethod: {
                include: {
                    translations: true,
                },
            },
        },
    },
    surcharges: true,
    promotions: {
        include: {
            promotion: {
                include: {
                    translations: true,
                },
            },
        },
    },
    fulfillments: {
        include: {
            fulfillment: true,
        },
    },
    modifications: true,
    channels: {
        include: {
            channel: true,
        },
    },
    shippingAddress: {
        include: {
            country: true,
        },
    },
    billingAddress: {
        include: {
            country: true,
        },
    },
    aggregateOrder: true,
    sellerOrders: true,
} satisfies Prisma.OrderInclude;

@Injectable()
export class OrderPrismaRepository {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Find a single order by ID
     */
    async findOne(id: ID, includeRelations: boolean = true): Promise<any | undefined> {
        const include = includeRelations ? DEFAULT_ORDER_INCLUDE : undefined;

        const order = await this.prisma.order.findUnique({
            where: { id: String(id) },
            include,
        });

        return order || undefined;
    }

    /**
     * Find an order by code
     */
    async findByCode(code: string): Promise<any | undefined> {
        const order = await this.prisma.order.findUnique({
            where: { code },
            include: DEFAULT_ORDER_INCLUDE,
        });

        return order || undefined;
    }

    /**
     * Find all orders for a customer
     */
    async findByCustomerId(
        customerId: ID,
        options: { skip?: number; take?: number } = {},
    ): Promise<PaginatedList<any>> {
        const { skip = 0, take = 10 } = options;

        const where: Prisma.OrderWhereInput = {
            customerId: String(customerId),
        };

        const [items, totalItems] = await Promise.all([
            this.prisma.order.findMany({
                where,
                include: DEFAULT_ORDER_INCLUDE,
                skip,
                take,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.order.count({ where }),
        ]);

        return {
            items,
            totalItems,
        };
    }

    /**
     * Find all orders with pagination and filtering
     */
    async findAll(options: OrderListOptions = {}): Promise<PaginatedList<any>> {
        const { skip = 0, take = 10, filter, sort } = options;

        // Build where clause
        const where: Prisma.OrderWhereInput = {};

        if (filter?.active !== undefined) {
            where.active = filter.active;
        }

        if (filter?.state) {
            where.state = filter.state;
        }

        if (filter?.customerId) {
            where.customerId = filter.customerId;
        }

        if (filter?.code) {
            where.code = {
                contains: filter.code,
                mode: 'insensitive',
            };
        }

        // Build orderBy
        let orderBy: Prisma.OrderOrderByWithRelationInput = {
            createdAt: 'desc',
        };

        if (sort?.field) {
            orderBy = {
                [sort.field]: sort.order || 'asc',
            };
        }

        // Execute query
        const [items, totalItems] = await Promise.all([
            this.prisma.order.findMany({
                where,
                include: DEFAULT_ORDER_INCLUDE,
                skip,
                take,
                orderBy,
            }),
            this.prisma.order.count({ where }),
        ]);

        return {
            items,
            totalItems,
        };
    }

    /**
     * Create a new order
     */
    async create(data: CreateOrderData): Promise<any> {
        const order = await this.prisma.order.create({
            data: {
                code: data.code,
                state: data.state,
                active: data.active ?? true,
                type: data.type || 'Regular',
                customerId: data.customerId,
                currencyCode: data.currencyCode,
                subTotal: data.subTotal,
                subTotalWithTax: data.subTotalWithTax,
                shipping: data.shipping ?? 0,
                shippingWithTax: data.shippingWithTax ?? 0,
                taxZoneId: data.taxZoneId,
                couponCodes: data.couponCodes || [],
                shippingAddressId: data.shippingAddressId,
                billingAddressId: data.billingAddressId,
                customFields: data.customFields as Prisma.JsonValue,
            },
            include: DEFAULT_ORDER_INCLUDE,
        });

        return order;
    }

    /**
     * Update an existing order
     */
    async update(id: ID, data: UpdateOrderData): Promise<any> {
        const updateData: Prisma.OrderUpdateInput = {};

        if (data.state !== undefined) {
            updateData.state = data.state;
        }

        if (data.active !== undefined) {
            updateData.active = data.active;
        }

        if (data.orderPlacedAt !== undefined) {
            updateData.orderPlacedAt = data.orderPlacedAt;
        }

        if (data.subTotal !== undefined) {
            updateData.subTotal = data.subTotal;
        }

        if (data.subTotalWithTax !== undefined) {
            updateData.subTotalWithTax = data.subTotalWithTax;
        }

        if (data.shipping !== undefined) {
            updateData.shipping = data.shipping;
        }

        if (data.shippingWithTax !== undefined) {
            updateData.shippingWithTax = data.shippingWithTax;
        }

        if (data.couponCodes !== undefined) {
            updateData.couponCodes = data.couponCodes;
        }

        if (data.customFields !== undefined) {
            updateData.customFields = data.customFields as Prisma.JsonValue;
        }

        const order = await this.prisma.order.update({
            where: { id: String(id) },
            data: updateData,
            include: DEFAULT_ORDER_INCLUDE,
        });

        return order;
    }

    /**
     * Transition order state
     */
    async transitionState(id: ID, newState: string): Promise<any> {
        const order = await this.prisma.order.update({
            where: { id: String(id) },
            data: {
                state: newState,
                // If transitioning to a placed state, set orderPlacedAt
                ...(newState === 'PaymentSettled' || newState === 'PaymentAuthorized'
                    ? { orderPlacedAt: new Date(), active: false }
                    : {}),
            },
            include: DEFAULT_ORDER_INCLUDE,
        });

        return order;
    }

    // =========================================================================
    // Order Lines Management
    // =========================================================================

    /**
     * Add a line to an order
     */
    async addLine(
        orderId: ID,
        data: {
            productVariantId: string;
            quantity: number;
            unitPrice: number;
            unitPriceWithTax: number;
            taxCategoryId?: string;
        },
    ): Promise<any> {
        const linePrice = data.unitPrice * data.quantity;
        const linePriceWithTax = data.unitPriceWithTax * data.quantity;

        const line = await this.prisma.orderLine.create({
            data: {
                orderId: String(orderId),
                productVariantId: data.productVariantId,
                quantity: data.quantity,
                unitPrice: data.unitPrice,
                unitPriceWithTax: data.unitPriceWithTax,
                linePrice,
                linePriceWithTax,
                proratedLinePrice: linePrice,
                proratedLinePriceWithTax: linePriceWithTax,
                initialLinePrice: linePrice,
                initialLinePriceWithTax: linePriceWithTax,
                taxCategoryId: data.taxCategoryId,
            },
            include: {
                productVariant: {
                    include: {
                        product: {
                            include: {
                                translations: true,
                            },
                        },
                        translations: true,
                    },
                },
            },
        });

        return line;
    }

    /**
     * Update an order line
     */
    async updateLine(
        lineId: ID,
        data: {
            quantity?: number;
            unitPrice?: number;
            unitPriceWithTax?: number;
        },
    ): Promise<any> {
        const currentLine = await this.prisma.orderLine.findUnique({
            where: { id: String(lineId) },
        });

        if (!currentLine) {
            throw new Error(`OrderLine with id ${String(lineId)} not found`);
        }

        const quantity = data.quantity ?? currentLine.quantity;
        const unitPrice = data.unitPrice ?? currentLine.unitPrice;
        const unitPriceWithTax = data.unitPriceWithTax ?? currentLine.unitPriceWithTax;

        const linePrice = unitPrice * quantity;
        const linePriceWithTax = unitPriceWithTax * quantity;

        const line = await this.prisma.orderLine.update({
            where: { id: String(lineId) },
            data: {
                quantity,
                unitPrice,
                unitPriceWithTax,
                linePrice,
                linePriceWithTax,
                proratedLinePrice: linePrice,
                proratedLinePriceWithTax: linePriceWithTax,
            },
            include: {
                productVariant: {
                    include: {
                        product: {
                            include: {
                                translations: true,
                            },
                        },
                        translations: true,
                    },
                },
            },
        });

        return line;
    }

    /**
     * Remove a line from an order
     */
    async removeLine(lineId: ID): Promise<void> {
        await this.prisma.orderLine.delete({
            where: { id: String(lineId) },
        });
    }

    /**
     * Get all lines for an order
     */
    async getLines(orderId: ID): Promise<any[]> {
        const lines = await this.prisma.orderLine.findMany({
            where: {
                orderId: String(orderId),
            },
            include: {
                productVariant: {
                    include: {
                        product: {
                            include: {
                                translations: true,
                            },
                        },
                        translations: true,
                    },
                },
                featuredAsset: true,
                taxCategory: true,
            },
        });

        return lines;
    }

    // =========================================================================
    // Payment Management
    // =========================================================================

    /**
     * Add a payment to an order
     */
    async addPayment(
        orderId: ID,
        data: {
            method: string;
            amount: number;
            state: string;
            transactionId?: string;
            metadata?: Record<string, any>;
        },
    ): Promise<any> {
        const payment = await this.prisma.payment.create({
            data: {
                orderId: String(orderId),
                method: data.method,
                amount: data.amount,
                state: data.state,
                transactionId: data.transactionId,
                metadata: data.metadata as Prisma.JsonValue,
            },
            include: {
                refunds: true,
            },
        });

        return payment;
    }

    /**
     * Update a payment
     */
    async updatePayment(
        paymentId: ID,
        data: {
            state?: string;
            transactionId?: string;
            errorMessage?: string;
        },
    ): Promise<any> {
        const payment = await this.prisma.payment.update({
            where: { id: String(paymentId) },
            data,
            include: {
                refunds: true,
            },
        });

        return payment;
    }

    /**
     * Add a refund to a payment
     */
    async addRefund(
        paymentId: ID,
        data: {
            items: number;
            shipping: number;
            adjustment: number;
            state: string;
            reason?: string;
        },
    ): Promise<any> {
        const total = data.items + data.shipping + data.adjustment;

        const refund = await this.prisma.refund.create({
            data: {
                paymentId: String(paymentId),
                items: data.items,
                shipping: data.shipping,
                adjustment: data.adjustment,
                total,
                state: data.state,
                reason: data.reason,
            },
        });

        return refund;
    }

    // =========================================================================
    // Shipping Management
    // =========================================================================

    /**
     * Add a shipping line to an order
     */
    async addShippingLine(
        orderId: ID,
        data: {
            shippingMethodId: string;
            listPrice: number;
            listPriceIncludesTax: boolean;
            price: number;
            priceWithTax: number;
        },
    ): Promise<any> {
        const shippingLine = await this.prisma.shippingLine.create({
            data: {
                orderId: String(orderId),
                shippingMethodId: data.shippingMethodId,
                listPrice: data.listPrice,
                listPriceIncludesTax: data.listPriceIncludesTax,
                price: data.price,
                priceWithTax: data.priceWithTax,
                discountedPrice: data.price,
                discountedPriceWithTax: data.priceWithTax,
            },
            include: {
                shippingMethod: {
                    include: {
                        translations: true,
                    },
                },
            },
        });

        return shippingLine;
    }

    // =========================================================================
    // Fulfillment Management
    // =========================================================================

    /**
     * Add a fulfillment to an order
     */
    async addFulfillment(
        orderId: ID,
        data: {
            state: string;
            method: string;
            trackingCode?: string;
        },
    ): Promise<any> {
        // Create the fulfillment
        const fulfillment = await this.prisma.fulfillment.create({
            data: {
                state: data.state,
                method: data.method,
                trackingCode: data.trackingCode,
            },
        });

        // Link to order
        await this.prisma.orderFulfillment.create({
            data: {
                orderId: String(orderId),
                fulfillmentId: fulfillment.id,
            },
        });

        return fulfillment;
    }

    // =========================================================================
    // Channel Management
    // =========================================================================

    /**
     * Add order to a channel
     */
    async addToChannel(orderId: ID, channelId: ID): Promise<void> {
        await this.prisma.orderChannel.create({
            data: {
                orderId: String(orderId),
                channelId: String(channelId),
            },
        });
    }

    /**
     * Remove order from a channel
     */
    async removeFromChannel(orderId: ID, channelId: ID): Promise<void> {
        await this.prisma.orderChannel.delete({
            where: {
                orderId_channelId: {
                    orderId: String(orderId),
                    channelId: String(channelId),
                },
            },
        });
    }

    // =========================================================================
    // Surcharge Management
    // =========================================================================

    /**
     * Add a surcharge to an order
     */
    async addSurcharge(
        orderId: ID,
        data: {
            description: string;
            sku?: string;
            listPrice: number;
            listPriceIncludesTax: boolean;
            price: number;
            priceWithTax: number;
            taxRate: number;
        },
    ): Promise<any> {
        const surcharge = await this.prisma.surcharge.create({
            data: {
                orderId: String(orderId),
                description: data.description,
                sku: data.sku,
                listPrice: data.listPrice,
                listPriceIncludesTax: data.listPriceIncludesTax,
                price: data.price,
                priceWithTax: data.priceWithTax,
                taxRate: data.taxRate,
            },
        });

        return surcharge;
    }
}
