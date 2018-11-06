import { InjectConnection } from '@nestjs/typeorm';
import { CreateAddressInput, PaymentInput, ShippingMethodQuote } from 'shared/generated-types';
import { ID, PaginatedList } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { generatePublicId } from '../../common/generate-public-id';
import { ListQueryOptions } from '../../common/types/common-types';
import { idsAreEqual } from '../../common/utils';
import { OrderItem } from '../../entity/order-item/order-item.entity';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';
import { Payment } from '../../entity/payment/payment.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { Promotion } from '../../entity/promotion/promotion.entity';
import { User } from '../../entity/user/user.entity';
import { I18nError } from '../../i18n/i18n-error';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { OrderCalculator } from '../helpers/order-calculator/order-calculator';
import { OrderMerger } from '../helpers/order-merger/order-merger';
import { OrderState } from '../helpers/order-state-machine/order-state';
import { OrderStateMachine } from '../helpers/order-state-machine/order-state-machine';
import { ShippingCalculator } from '../helpers/shipping-calculator/shipping-calculator';
import { translateDeep } from '../helpers/utils/translate-entity';

import { CustomerService } from './customer.service';
import { PaymentMethodService } from './payment-method.service';
import { ProductVariantService } from './product-variant.service';

export class OrderService {
    constructor(
        @InjectConnection() private connection: Connection,
        private productVariantService: ProductVariantService,
        private customerService: CustomerService,
        private orderCalculator: OrderCalculator,
        private shippingCalculator: ShippingCalculator,
        private orderStateMachine: OrderStateMachine,
        private orderMerger: OrderMerger,
        private paymentMethodService: PaymentMethodService,
        private listQueryBuilder: ListQueryBuilder,
    ) {}

    findAll(ctx: RequestContext, options?: ListQueryOptions<Order>): Promise<PaginatedList<Order>> {
        return this.listQueryBuilder
            .build(Order, options, ['lines', 'lines.productVariant', 'customer'])
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
                'customer',
                'lines',
                'lines.productVariant',
                'lines.productVariant.taxCategory',
                'lines.featuredAsset',
                'lines.items',
                'lines.taxCategory',
            ],
        });
        if (order) {
            order.lines.forEach(line => {
                line.productVariant = translateDeep(
                    this.productVariantService.applyChannelPriceAndTax(line.productVariant, ctx),
                    ctx.languageCode,
                );
            });
            return order;
        }
    }

    async findOneByCode(ctx: RequestContext, orderCode: string): Promise<Order | undefined> {
        const order = await this.connection.getRepository(Order).findOne({
            relations: ['customer'],
            where: {
                code: orderCode,
            },
        });
        return order;
    }

    getOrderPayments(orderId: ID): Promise<Payment[]> {
        return this.connection.getRepository(Payment).find({
            where: {
                order: { id: orderId } as any,
            },
        });
    }

    async getActiveOrderForUser(ctx: RequestContext, userId: ID): Promise<Order | undefined> {
        const customer = await this.customerService.findOneByUserId(userId);
        if (customer) {
            const activeOrder = await this.connection.getRepository(Order).findOne({
                where: {
                    customer,
                    active: true,
                },
            });
            if (activeOrder) {
                return this.findOne(ctx, activeOrder.id);
            }
        }
    }

    async create(userId?: ID): Promise<Order> {
        const newOrder = new Order({
            code: generatePublicId(),
            state: this.orderStateMachine.getInitialState(),
            lines: [],
            shippingAddress: {},
            pendingAdjustments: [],
            subTotal: 0,
            subTotalBeforeTax: 0,
        });
        if (userId) {
            const customer = await this.customerService.findOneByUserId(userId);
            if (customer) {
                newOrder.customer = customer;
            }
        }
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
            const newLine = this.createOrderLineFromVariant(productVariant);
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
            const productVariant = orderLine.productVariant;
            for (let i = currentQuantity; i < quantity; i++) {
                const orderItem = await this.connection.getRepository(OrderItem).save(
                    new OrderItem({
                        unitPrice: productVariant.price,
                        pendingAdjustments: [],
                        unitPriceIncludesTax: productVariant.priceIncludesTax,
                        taxRate: productVariant.priceIncludesTax ? productVariant.taxRateApplied.value : 0,
                    }),
                );
                orderLine.items.push(orderItem);
            }
        } else if (quantity < currentQuantity) {
            orderLine.items = orderLine.items.slice(0, quantity);
        }
        await this.connection.getRepository(OrderLine).save(orderLine);
        return this.applyPriceAdjustments(ctx, order);
    }

    async removeItemFromOrder(ctx: RequestContext, orderId: ID, orderLineId: ID): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const orderLine = this.getOrderLineOrThrow(order, orderLineId);
        order.lines = order.lines.filter(line => !idsAreEqual(line.id, orderLineId));
        const updatedOrder = await this.applyPriceAdjustments(ctx, order);
        await this.connection.getRepository(OrderLine).remove(orderLine);
        return updatedOrder;
    }

    getNextOrderStates(order: Order): OrderState[] {
        return this.orderStateMachine.getNextStates(order);
    }

    async setShippingAddress(ctx: RequestContext, orderId: ID, input: CreateAddressInput): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        order.shippingAddress = input;
        return this.connection.getRepository(Order).save(order);
    }

    async getEligibleShippingMethods(ctx: RequestContext, orderId: ID): Promise<ShippingMethodQuote[]> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const eligibleMethods = await this.shippingCalculator.getEligibleShippingMethods(ctx, order);
        return eligibleMethods.map(result => ({
            shippingMethodId: result.method.id as string,
            price: result.price,
            description: result.method.description,
        }));
    }

    async setShippingMethod(ctx: RequestContext, orderId: ID, shippingMethodId: ID): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        await this.applyPriceAdjustments(ctx, order, shippingMethodId);
        return this.connection.getRepository(Order).save(order);
    }

    async transitionToState(ctx: RequestContext, orderId: ID, state: OrderState): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        await this.orderStateMachine.transition(order, state);
        await this.connection.getRepository(Order).save(order);
        return order;
    }

    async addPaymentToOrder(ctx: RequestContext, orderId: ID, input: PaymentInput): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const payment = await this.paymentMethodService.createPayment(order, input.method, input.metadata);
        if (order.payments) {
            order.payments.push(payment);
        } else {
            order.payments = [payment];
        }
        await this.connection.getRepository(Order).save(order);
        const orderTotalCovered = order.payments.reduce((sum, p) => sum + p.amount, 0) === order.total;
        if (orderTotalCovered && order.payments.every(p => p.state === 'Settled')) {
            return this.transitionToState(ctx, orderId, 'PaymentSettled');
        }
        if (orderTotalCovered && order.payments.every(p => p.state === 'Authorized')) {
            return this.transitionToState(ctx, orderId, 'PaymentAuthorized');
        }
        return order;
    }

    /**
     * When a guest user with an anonymous Order signs in and has an existing Order associated with that Customer,
     * we need to reconcile the contents of the two orders.
     */
    async mergeOrders(
        ctx: RequestContext,
        user: User,
        guestOrder?: Order,
        existingOrder?: Order,
    ): Promise<Order | undefined> {
        const mergeResult = await this.orderMerger.merge(guestOrder, existingOrder);
        const { orderToDelete, linesToInsert } = mergeResult;
        let { order } = mergeResult;
        if (orderToDelete) {
            await this.connection.getRepository(Order).delete(orderToDelete.id);
        }
        if (order && linesToInsert) {
            for (const line of linesToInsert) {
                order = await this.addItemToOrder(ctx, order.id, line.productVariantId, line.quantity);
            }
        }
        const customer = await this.customerService.findOneByUserId(user.id);
        if (order && customer) {
            order.customer = customer;
            await this.connection.getRepository(Order).save(order);
        }
        return order;
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

    private createOrderLineFromVariant(productVariant: ProductVariant): OrderLine {
        return new OrderLine({
            productVariant,
            taxCategory: productVariant.taxCategory,
            featuredAsset: productVariant.product.featuredAsset,
        });
    }

    /**
     * Throws if quantity is negative.
     */
    private assertQuantityIsPositive(quantity: number) {
        if (quantity < 0) {
            throw new I18nError(`error.order-item-quantity-must-be-positive`, { quantity });
        }
    }

    /**
     * Applies promotions, taxes and shipping to the Order.
     */
    private async applyPriceAdjustments(
        ctx: RequestContext,
        order: Order,
        preferredShippingMethod?: ID,
    ): Promise<Order> {
        const promotions = await this.connection.getRepository(Promotion).find({
            where: { enabled: true },
            order: { priorityScore: 'ASC' },
        });
        order = await this.orderCalculator.applyPriceAdjustments(
            ctx,
            order,
            promotions,
            preferredShippingMethod,
        );
        await this.connection.getRepository(Order).save(order);
        await this.connection.getRepository(OrderItem).save(order.getOrderItems());
        await this.connection.getRepository(OrderLine).save(order.lines);
        return order;
    }
}
