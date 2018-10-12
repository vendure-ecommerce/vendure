import { InjectConnection } from '@nestjs/typeorm';
import { ID, PaginatedList } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { generatePublicId } from '../../common/generate-public-id';
import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { OrderItem } from '../../entity/order-item/order-item.entity';
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
        return buildListQuery(this.connection, Order, options, ['items', 'items.productVariant', 'customer'])
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
            relations: ['items', 'items.productVariant', 'items.featuredAsset'],
        });
        if (order) {
            order.items.forEach(item => {
                item.productVariant = translateDeep(item.productVariant, ctx.languageCode);
            });
            return order;
        }
    }

    create(): Promise<Order> {
        const newOrder = new Order({
            code: generatePublicId(),
            items: [],
            adjustments: [],
            totalPriceBeforeAdjustment: 0,
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
        const existingItem = order.items.find(item => idsAreEqual(item.productVariant.id, productVariantId));

        if (existingItem) {
            return this.adjustItemQuantity(ctx, orderId, existingItem.id, existingItem.quantity + quantity);
        }
        const orderItem = new OrderItem({
            quantity,
            productVariant,
            taxCategoryId: productVariant.taxCategory.id,
            featuredAsset: productVariant.product.featuredAsset,
            unitPrice: productVariant.price,
            unitPriceBeforeTax: 0,
            totalPriceBeforeAdjustment: 0 * quantity,
            totalPrice: 0 * quantity,
            adjustments: [],
        });
        const newOrderItem = await this.connection.getRepository(OrderItem).save(orderItem);
        order.items.push(newOrderItem);
        await this.adjustmentApplicatorService.applyAdjustments(order);
        return assertFound(this.findOne(ctx, order.id));
    }

    async adjustItemQuantity(
        ctx: RequestContext,
        orderId: ID,
        orderItemId: ID,
        quantity: number,
    ): Promise<Order> {
        this.assertQuantityIsPositive(quantity);
        const order = await this.getOrderOrThrow(ctx, orderId);
        const orderItem = this.getOrderItemOrThrow(order, orderItemId);
        orderItem.quantity = quantity;
        orderItem.totalPriceBeforeAdjustment = orderItem.unitPrice * orderItem.quantity;
        await this.connection.getRepository(OrderItem).save(orderItem);
        await this.adjustmentApplicatorService.applyAdjustments(order);
        return assertFound(this.findOne(ctx, order.id));
    }

    async removeItemFromOrder(ctx: RequestContext, orderId: ID, orderItemId: ID): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const orderItem = this.getOrderItemOrThrow(order, orderItemId);
        order.items = order.items.filter(item => !idsAreEqual(item.id, orderItemId));
        await this.adjustmentApplicatorService.applyAdjustments(order);
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

    private getOrderItemOrThrow(order: Order, orderItemId: ID): OrderItem {
        const orderItem = order.items.find(item => idsAreEqual(item.id, orderItemId));
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
