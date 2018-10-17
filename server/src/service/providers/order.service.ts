import { InjectConnection } from '@nestjs/typeorm';
import { AdjustmentType } from 'shared/generated-types';
import { ID, PaginatedList } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { generatePublicId } from '../../common/generate-public-id';
import { ListQueryOptions } from '../../common/types/common-types';
import { idsAreEqual } from '../../common/utils';
import { OrderItem } from '../../entity/order-item/order-item.entity';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { Promotion } from '../../entity/promotion/promotion.entity';
import { TaxRate } from '../../entity/tax-rate/tax-rate.entity';
import { Zone } from '../../entity/zone/zone.entity';
import { I18nError } from '../../i18n/i18n-error';
import { buildListQuery } from '../helpers/build-list-query';
import { translateDeep } from '../helpers/translate-entity';

import { ProductVariantService } from './product-variant.service';

export class OrderService {
    constructor(
        @InjectConnection() private connection: Connection,
        private productVariantService: ProductVariantService,
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
            relations: [
                'lines',
                'lines.productVariant',
                'lines.featuredAsset',
                'lines.items',
                'lines.taxCategory',
            ],
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
            totalPriceBeforeTax: 0,
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
                taxCategory: productVariant.taxCategory,
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
        return this.applyAdjustments(ctx, order);
    }

    async removeItemFromOrder(ctx: RequestContext, orderId: ID, orderLineId: ID): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const orderLine = this.getOrderLineOrThrow(order, orderLineId);
        order.lines = order.lines.filter(line => !idsAreEqual(line.id, orderLineId));
        const updatedOrder = await this.applyAdjustments(ctx, order);
        await this.connection.getRepository(OrderLine).remove(orderLine);
        return updatedOrder;
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

    private getOrderLineOrThrow(order: Order, orderLineId: ID): OrderLine {
        const orderItem = order.lines.find(line => idsAreEqual(line.id, orderLineId));
        if (!orderItem) {
            throw new I18nError(`error.order-does-not-contain-line-with-id`, { id: orderLineId });
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

    // TODO: Refactor the mail calculation logic out into a more testable service.
    private async applyAdjustments(ctx: RequestContext, order: Order): Promise<Order> {
        const activeZone = ctx.channel.defaultTaxZone;
        const taxRates = await this.connection.getRepository(TaxRate).find({
            where: {
                enabled: true,
                zone: activeZone,
            },
            relations: ['category', 'zone', 'customerGroup'],
        });
        const promotions = await this.connection.getRepository(Promotion).find({ where: { enabled: true } });

        order.clearAdjustments();
        // First apply taxes to the non-discounted prices
        this.applyTaxes(order, taxRates, activeZone);
        // Then test and apply promotions
        this.applyPromotions(order, promotions);
        // Finally, re-calculate taxes because the promotions may have
        // altered the unit prices, which in turn will alter the tax payable.
        this.applyTaxes(order, taxRates, activeZone);

        await this.connection.getRepository(Order).save(order);
        await this.connection.getRepository(OrderItem).save(order.getOrderItems());
        return order;
    }

    /**
     * Applies the correct TaxRate to each OrderItem in the order.
     */
    private applyTaxes(order: Order, taxRates: TaxRate[], activeZone: Zone) {
        for (const line of order.lines) {
            const applicableTaxRate = taxRates.find(taxRate => taxRate.test(activeZone, line.taxCategory));

            line.clearAdjustments(AdjustmentType.TAX);

            for (const item of line.items) {
                if (applicableTaxRate) {
                    item.pendingAdjustments = item.pendingAdjustments.concat(
                        applicableTaxRate.apply(line.unitPriceWithPromotions),
                    );
                }
            }
            this.calculateOrderTotals(order);
        }
    }

    /**
     * Applies any eligible promotions to each OrderItem in the order.
     */
    private applyPromotions(order: Order, promotions: Promotion[]) {
        for (const line of order.lines) {
            const applicablePromotions = promotions.filter(p => p.test(order));

            line.clearAdjustments(AdjustmentType.PROMOTION);

            for (const item of line.items) {
                if (applicablePromotions) {
                    for (const promotion of applicablePromotions) {
                        const adjustment = promotion.apply(item, line);
                        if (adjustment) {
                            item.pendingAdjustments = item.pendingAdjustments.concat(adjustment);
                        }
                    }
                }
            }
            this.calculateOrderTotals(order);
        }
    }

    private calculateOrderTotals(order: Order) {
        let totalPrice = 0;
        let totalTax = 0;

        for (const line of order.lines) {
            totalPrice += line.totalPrice;
            totalTax += line.unitTax * line.quantity;
        }
        const totalPriceBeforeTax = totalPrice - totalTax;

        order.totalPriceBeforeTax = totalPriceBeforeTax;
        order.totalPrice = totalPrice;
    }
}
