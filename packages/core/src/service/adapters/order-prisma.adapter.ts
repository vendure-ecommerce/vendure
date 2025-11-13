/**
 * @description
 * Prisma implementation of the Order ORM adapter.
 * Converts Prisma results to TypeORM Order entities for backward compatibility.
 *
 * @since 3.6.0
 */

import { Injectable } from '@nestjs/common';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';
import { OrderPrismaRepository } from '../repositories/prisma/order-prisma.repository';

import {
    AddOrderLineInput,
    AddPaymentInput,
    AddShippingLineInput,
    CreateOrderInput,
    IOrderOrmAdapter,
    OrderListOptions,
    UpdateOrderInput,
    UpdateOrderLineInput,
} from './order-orm.adapter';

@Injectable()
export class OrderPrismaAdapter implements IOrderOrmAdapter {
    constructor(private readonly repository: OrderPrismaRepository) {}

    async findOne(id: ID, includeRelations: boolean = true): Promise<Order | undefined> {
        const prismaOrder = await this.repository.findOne(id, includeRelations);

        if (!prismaOrder) {
            return undefined;
        }

        return this.mapToEntity(prismaOrder);
    }

    async findByCode(code: string): Promise<Order | undefined> {
        const prismaOrder = await this.repository.findByCode(code);

        if (!prismaOrder) {
            return undefined;
        }

        return this.mapToEntity(prismaOrder);
    }

    async findByCustomerId(
        customerId: ID,
        options: { skip?: number; take?: number } = {},
    ): Promise<PaginatedList<Order>> {
        const result = await this.repository.findByCustomerId(customerId, options);

        return {
            items: result.items.map(item => this.mapToEntity(item)),
            totalItems: result.totalItems,
        };
    }

    async findAll(options: OrderListOptions = {}): Promise<PaginatedList<Order>> {
        const result = await this.repository.findAll({
            skip: options.skip,
            take: options.take,
            filter: options.filter,
            sort: options.sort,
        });

        return {
            items: result.items.map(item => this.mapToEntity(item)),
            totalItems: result.totalItems,
        };
    }

    async create(data: CreateOrderInput): Promise<Order> {
        const prismaOrder = await this.repository.create(data);
        return this.mapToEntity(prismaOrder);
    }

    async update(id: ID, data: UpdateOrderInput): Promise<Order> {
        const prismaOrder = await this.repository.update(id, data);
        return this.mapToEntity(prismaOrder);
    }

    async transitionState(id: ID, newState: string): Promise<Order> {
        const prismaOrder = await this.repository.transitionState(id, newState);
        return this.mapToEntity(prismaOrder);
    }

    async addLine(orderId: ID, data: AddOrderLineInput): Promise<OrderLine> {
        const prismaLine = await this.repository.addLine(orderId, data);
        return this.mapLineToEntity(prismaLine);
    }

    async updateLine(lineId: ID, data: UpdateOrderLineInput): Promise<OrderLine> {
        const prismaLine = await this.repository.updateLine(lineId, data);
        return this.mapLineToEntity(prismaLine);
    }

    async removeLine(lineId: ID): Promise<void> {
        await this.repository.removeLine(lineId);
    }

    async getLines(orderId: ID): Promise<OrderLine[]> {
        const prismaLines = await this.repository.getLines(orderId);
        return prismaLines.map(line => this.mapLineToEntity(line));
    }

    async addPayment(orderId: ID, data: AddPaymentInput): Promise<any> {
        return this.repository.addPayment(orderId, data);
    }

    async addShippingLine(orderId: ID, data: AddShippingLineInput): Promise<any> {
        return this.repository.addShippingLine(orderId, data);
    }

    async addToChannel(orderId: ID, channelId: ID): Promise<void> {
        await this.repository.addToChannel(orderId, channelId);
    }

    async removeFromChannel(orderId: ID, channelId: ID): Promise<void> {
        await this.repository.removeFromChannel(orderId, channelId);
    }

    /**
     * Map Prisma Order to TypeORM Order entity
     * This ensures backward compatibility with existing code
     */
    private mapToEntity(prismaOrder: any): Order {
        const order = new Order({
            id: prismaOrder.id,
            createdAt: prismaOrder.createdAt,
            updatedAt: prismaOrder.updatedAt,
            code: prismaOrder.code,
            state: prismaOrder.state,
            active: prismaOrder.active,
            orderPlacedAt: prismaOrder.orderPlacedAt,
            type: prismaOrder.type,
            customerId: prismaOrder.customerId,
            aggregateOrderId: prismaOrder.aggregateOrderId,
            currencyCode: prismaOrder.currencyCode,
            subTotal: prismaOrder.subTotal,
            subTotalWithTax: prismaOrder.subTotalWithTax,
            shipping: prismaOrder.shipping,
            shippingWithTax: prismaOrder.shippingWithTax,
            taxZoneId: prismaOrder.taxZoneId,
            couponCodes: prismaOrder.couponCodes,
            customFields: prismaOrder.customFields,
        });

        // Map customer (if loaded)
        if (prismaOrder.customer) {
            order.customer = prismaOrder.customer;
        }

        // Map lines (if loaded)
        if (prismaOrder.lines) {
            order.lines = prismaOrder.lines.map((line: any) => this.mapLineToEntity(line));
        }

        // Map payments (if loaded)
        if (prismaOrder.payments) {
            order.payments = prismaOrder.payments;
        }

        // Map shipping lines (if loaded)
        if (prismaOrder.shippingLines) {
            order.shippingLines = prismaOrder.shippingLines;
        }

        // Map surcharges (if loaded)
        if (prismaOrder.surcharges) {
            order.surcharges = prismaOrder.surcharges;
        }

        // Map promotions (if loaded)
        if (prismaOrder.promotions) {
            // Extract just the promotion from the join table
            order.promotions = prismaOrder.promotions.map((p: any) => p.promotion);
        }

        // Map fulfillments (if loaded)
        if (prismaOrder.fulfillments) {
            // Extract just the fulfillment from the join table
            order.fulfillments = prismaOrder.fulfillments.map((f: any) => f.fulfillment);
        }

        // Map modifications (if loaded)
        if (prismaOrder.modifications) {
            order.modifications = prismaOrder.modifications;
        }

        // Map channels (if loaded)
        if (prismaOrder.channels) {
            // Extract just the channel from the join table
            order.channels = prismaOrder.channels.map((c: any) => c.channel);
        }

        // Map addresses (if loaded)
        if (prismaOrder.shippingAddress) {
            order.shippingAddress = {
                fullName: prismaOrder.shippingAddress.fullName,
                company: prismaOrder.shippingAddress.company,
                streetLine1: prismaOrder.shippingAddress.streetLine1,
                streetLine2: prismaOrder.shippingAddress.streetLine2,
                city: prismaOrder.shippingAddress.city,
                province: prismaOrder.shippingAddress.province,
                postalCode: prismaOrder.shippingAddress.postalCode,
                country: prismaOrder.shippingAddress.country?.name || '',
                phoneNumber: prismaOrder.shippingAddress.phoneNumber,
            };
        }

        if (prismaOrder.billingAddress) {
            order.billingAddress = {
                fullName: prismaOrder.billingAddress.fullName,
                company: prismaOrder.billingAddress.company,
                streetLine1: prismaOrder.billingAddress.streetLine1,
                streetLine2: prismaOrder.billingAddress.streetLine2,
                city: prismaOrder.billingAddress.city,
                province: prismaOrder.billingAddress.province,
                postalCode: prismaOrder.billingAddress.postalCode,
                country: prismaOrder.billingAddress.country?.name || '',
                phoneNumber: prismaOrder.billingAddress.phoneNumber,
            };
        }

        // Map aggregate order relation (if loaded)
        if (prismaOrder.aggregateOrder) {
            order.aggregateOrder = this.mapToEntity(prismaOrder.aggregateOrder);
        }

        // Map seller orders (if loaded)
        if (prismaOrder.sellerOrders) {
            order.sellerOrders = prismaOrder.sellerOrders.map((o: any) => this.mapToEntity(o));
        }

        return order;
    }

    /**
     * Map Prisma OrderLine to TypeORM OrderLine entity
     */
    private mapLineToEntity(prismaLine: any): OrderLine {
        const line = new OrderLine({
            id: prismaLine.id,
            createdAt: prismaLine.createdAt,
            updatedAt: prismaLine.updatedAt,
            productVariantId: prismaLine.productVariantId,
            taxCategoryId: prismaLine.taxCategoryId,
            featuredAssetId: prismaLine.featuredAssetId,
            quantity: prismaLine.quantity,
            unitPrice: prismaLine.unitPrice,
            unitPriceWithTax: prismaLine.unitPriceWithTax,
            linePrice: prismaLine.linePrice,
            linePriceWithTax: prismaLine.linePriceWithTax,
            proratedLinePrice: prismaLine.proratedLinePrice,
            proratedLinePriceWithTax: prismaLine.proratedLinePriceWithTax,
            discounts: prismaLine.discounts,
            taxLines: prismaLine.taxLines,
            adjustments: prismaLine.adjustments,
            customFields: prismaLine.customFields,
        });

        // Map product variant (if loaded)
        if (prismaLine.productVariant) {
            line.productVariant = prismaLine.productVariant;
        }

        // Map featured asset (if loaded)
        if (prismaLine.featuredAsset) {
            line.featuredAsset = prismaLine.featuredAsset;
        }

        // Map tax category (if loaded)
        if (prismaLine.taxCategory) {
            line.taxCategory = prismaLine.taxCategory;
        }

        return line;
    }
}
