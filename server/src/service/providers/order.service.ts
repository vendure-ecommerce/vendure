import { InjectConnection } from '@nestjs/typeorm';
import { ID, PaginatedList } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { generatePublicId } from '../../common/generate-public-id';
import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { OrderItem } from '../../entity/order-item/order-item.entity';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { I18nError } from '../../i18n/i18n-error';
import { buildListQuery } from '../helpers/build-list-query';
import { translateDeep } from '../helpers/translate-entity';

import { AdjustmentApplicatorService } from './adjustment-applicator.service';
import { ProductVariantService } from './product-variant.service';

export class OrderService {
    constructor(
        @InjectConnection() private connection: Connection,
        private productVariantService: ProductVariantService,
        private adjustmentApplicatorService: AdjustmentApplicatorService,
    ) {}

    findAll(ctx: RequestContext, options?: ListQueryOptions<Order>): Promise<PaginatedList<Order>> {
        return buildListQuery(this.connection, Order, options, ['lines', 'lines.productVariant', 'customer'])
            .getManyAndCount()
            .then(([items, totalItems]) => {
                return {
                    items,
                    totalItems,
                };
            });
    }

    async findOne(ctx: RequestContext, orderId: ID): Promise<Order | undefined> {
        const order = await this.connection.getRepository(Order).findOne(orderId, {
            relations: ['lines', 'lines.productVariant', 'lines.featuredAsset', 'lines.items'],
        });
        if (order) {
            order.lines.forEach(item => {
                item.productVariant = translateDeep(item.productVariant, ctx.languageCode);
            });
            return order;
        }
    }

    create(): Promise<Order> {
        const newOrder = new Order({
            code: generatePublicId(),
            lines: [],
            totalPrice: 0,
        });
        return this.connection.getRepository(Order).save(newOrder);
    }

    async addItemToOrder(
        ctx: RequestContext,
        orderId: ID,
        productVariantId: ID,
        quantity: number,
    ): Promise<Order> {
        this.assertQuantityIsPositive(quantity);
        const order = await this.getOrderOrThrow(ctx, orderId);
        const productVariant = await this.getProductVariantOrThrow(ctx, productVariantId);
        let orderLine = order.lines.find(line => idsAreEqual(line.productVariant.id, productVariantId));

        if (!orderLine) {
            const newLine = new OrderLine({
                productVariant,
                taxCategoryId: productVariant.taxCategory.id,
                featuredAsset: productVariant.product.featuredAsset,
                unitPrice: productVariant.price,
            });
            orderLine = await this.connection.getRepository(OrderLine).save(newLine);
            order.lines.push(orderLine);
            await this.connection.getRepository(Order).save(order);
        }
        return this.adjustItemQuantity(ctx, orderId, orderLine.id, orderLine.quantity + quantity);
    }

    async adjustItemQuantity(
        ctx: RequestContext,
        orderId: ID,
        orderLineId: ID,
        quantity: number,
    ): Promise<Order> {
        this.assertQuantityIsPositive(quantity);
        const order = await this.getOrderOrThrow(ctx, orderId);
        const orderLine = this.getOrderLineOrThrow(order, orderLineId);
        const currentQuantity = orderLine.quantity;
        if (currentQuantity < quantity) {
            if (!orderLine.items) {
                orderLine.items = [];
            }
            for (let i = currentQuantity; i < quantity; i++) {
                const orderItem = await this.connection.getRepository(OrderItem).save(
                    new OrderItem({
                        pendingAdjustments: [],
                    }),
                );
                orderLine.items.push(orderItem);
            }
        } else if (quantity < currentQuantity) {
            orderLine.items = orderLine.items.slice(0, quantity);
        }
        await this.connection.getRepository(OrderLine).save(orderLine);
        return assertFound(this.findOne(ctx, order.id));
    }

    async removeItemFromOrder(ctx: RequestContext, orderId: ID, orderItemId: ID): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const orderItem = this.getOrderLineOrThrow(order, orderItemId);
        order.lines = order.lines.filter(item => !idsAreEqual(item.id, orderItemId));
        return assertFound(this.findOne(ctx, order.id));
    }

    private async getOrderOrThrow(ctx: RequestContext, orderId: ID): Promise<Order> {
        const order = await this.findOne(ctx, orderId);
        if (!order) {
            throw new I18nError('error.entity-with-id-not-found', { entityName: 'Order', id: orderId });
        }
        return order;
    }

    private async getProductVariantOrThrow(
        ctx: RequestContext,
        productVariantId: ID,
    ): Promise<ProductVariant> {
        const productVariant = await this.productVariantService.findOne(ctx, productVariantId);
        if (!productVariant) {
            throw new I18nError('error.entity-with-id-not-found', {
                entityName: 'ProductVariant',
                id: productVariantId,
            });
        }
        return productVariant;
    }

    private getOrderLineOrThrow(order: Order, orderItemId: ID): OrderLine {
        const orderItem = order.lines.find(item => idsAreEqual(item.id, orderItemId));
        if (!orderItem) {
            throw new I18nError(`error.order-does-not-contain-item-with-id`, { id: orderItemId });
        }
        return orderItem;
    }

    /**
     * Throws if quantity is negative.
     */
    private assertQuantityIsPositive(quantity: number) {
        if (quantity < 0) {
            throw new I18nError(`error.order-item-quantity-must-be-positive`, { quantity });
        }
    }
}
